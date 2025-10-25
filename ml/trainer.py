import argparse, os
from datasets import load_from_disk, load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer, DataCollatorForLanguageModeling
try:
    from peft import LoraConfig, get_peft_model
    USE_LORA = True
except:
    USE_LORA = False

p = argparse.ArgumentParser()
p.add_argument('--model', required=True)
p.add_argument('--dataset', required=True)
p.add_argument('--output', required=True)
p.add_argument('--epochs', type=int, default=3)
p.add_argument('--lr', type=float, default=2e-5)
p.add_argument('--batch', type=int, default=4)
p.add_argument('--fp16', type=int, default=1)
args = p.parse_args()

os.makedirs(args.output, exist_ok=True)
tokenizer = AutoTokenizer.from_pretrained(args.model, use_fast=True)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token

if os.path.isdir(args.dataset):
    ds = load_from_disk(args.dataset)
else:
    ds = load_dataset(args.dataset)

def tok(ex):
    return tokenizer(ex['text'], truncation=True, max_length=1024)
cols = [c for c in ds['train'].column_names if c != 'text']
ds = ds.map(tok, batched=True, remove_columns=cols)

model = AutoModelForCausalLM.from_pretrained(args.model)
if USE_LORA:
    cfg = LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05, bias="none", task_type="CAUSAL_LM")
    model = get_peft_model(model, cfg)

collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
train_args = TrainingArguments(
    output_dir=args.output,
    per_device_train_batch_size=args.batch,
    num_train_epochs=args.epochs,
    learning_rate=args.lr,
    fp16=bool(args.fp16),
    logging_steps=10,
    save_steps=200,
    save_total_limit=2,
    report_to=[]
)

class ProgCb:
    def on_log(self, args2, state, control):
        if state.log_history and 'loss' in state.log_history[-1] and 'step' in state.log_history[-1]:
            lh = state.log_history[-1]
            total = state.max_steps if state.max_steps is not None else 0
            print(f"PROGRESS step={lh['step']}/{total} loss={lh['loss']:.4f}", flush=True)

trainer = Trainer(
    model=model,
    args=train_args,
    train_dataset=ds['train'],
    eval_dataset=ds['validation'] if 'validation' in ds else None,
    data_collator=collator,
    tokenizer=tokenizer,
    callbacks=[ProgCb()]
)

resume = None
if os.path.exists(os.path.join(args.output, 'trainer_state.json')):
    resume = True
trainer.train(resume_from_checkpoint=resume)
trainer.save_model(args.output)
tokenizer.save_pretrained(args.output)
print("DONE", flush=True)
