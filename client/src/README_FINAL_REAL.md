# 🚀 سیستم آموزش مدل‌های AI - راهنمای نهایی

## 📦 فایل‌های پروژه

### 🔷 **TypeScript API**
1. **[types.ts](computer:///mnt/user-data/outputs/types.ts)** - Type definitions کامل
2. **[client.ts](computer:///mnt/user-data/outputs/client.ts)** - API Client با WebSocket
3. **[Dashboard.tsx](computer:///mnt/user-data/outputs/Dashboard.tsx)** - Dashboard با TypeScript

### 🤖 **مدل‌ها و آموزش**
4. **[MODELS_GUIDE.md](computer:///mnt/user-data/outputs/MODELS_GUIDE.md)** - راهنمای کامل مدل‌های Hugging Face
5. **[download_models.py](computer:///mnt/user-data/outputs/download_models.py)** - اسکریپت دانلود خودکار

### 📚 **مستندات**
6. **[.env.example](computer:///mnt/user-data/outputs/.env.example)** - Environment variables
7. **[DEPLOYMENT_GUIDE.md](computer:///mnt/user-data/outputs/DEPLOYMENT_GUIDE.md)** - راهنمای VPS

---

## 🎯 شروع سریع

### مرحله 1: نصب Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### مرحله 2: دانلود مدل‌ها از Hugging Face

```bash
# دانلود مدل‌های پایه (ParsBERT + GPT2-Persian)
python download_models.py

# یا دانلود مدل‌های خاص
python download_models.py --models parsbert,gpt2-persian,mt5-base

# لیست مدل‌های موجود
python download_models.py --list
```

**مدل‌های پیشنهادی**:
- **ParsBERT**: https://huggingface.co/HooshvareLab/bert-fa-base-uncased (440MB)
- **GPT2-Persian**: https://huggingface.co/flax-community/gpt2-persian (500MB)
- **mT5-Base**: https://huggingface.co/google/mt5-base (2.3GB)
- **XLM-RoBERTa**: https://huggingface.co/xlm-roberta-base (1.1GB)

### مرحله 3: تنظیم Environment

```bash
# کپی .env.example
cp .env.example .env

# ویرایش .env
nano .env
```

```env
# Backend API
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

### مرحله 4: اجرای Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### مرحله 5: اجرای Frontend

```bash
cd frontend
npm run dev
```

برو به: http://localhost:5173

---

## 🏗️ ساختار پروژه

```
project/
├── backend/
│   ├── models/                  # مدل‌های دانلود شده
│   │   ├── parsbert/
│   │   ├── gpt2-persian/
│   │   └── mt5-base/
│   ├── datasets/               # دیتاست‌های آموزشی
│   ├── checkpoints/            # Checkpoints
│   ├── api/
│   │   ├── training.py        # Training endpoints
│   │   ├── models.py          # Models endpoints
│   │   └── datasets.py        # Datasets endpoints
│   ├── requirements.txt
│   └── main.py
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── types.ts       # Type definitions
    │   │   └── client.ts      # API Client
    │   ├── pages/
    │   │   └── Dashboard.tsx  # Dashboard
    │   └── main.tsx
    ├── .env
    └── package.json
```

---

## 🔌 API Endpoints

### Dashboard
```typescript
// آمار کلی
const stats = await apiClient.getDashboardStats();

// وضعیت سیستم
const status = await apiClient.getSystemStatus();

// متریک‌های real-time
const metrics = await apiClient.getSystemMetrics();
```

### Models
```typescript
// لیست مدل‌ها
const models = await apiClient.getModels();

// جزئیات یک مدل
const model = await apiClient.getModel('parsbert');
```

### Training
```typescript
// شروع آموزش
const job = await apiClient.startTraining({
  baseModel: 'parsbert',
  datasets: ['dataset-1'],
  modelName: 'my-model',
  config: {
    epochs: 10,
    batchSize: 32,
    learningRate: 2e-5,
    optimizer: 'adamw'
  }
});

// مدیریت training
await apiClient.pauseTraining(job.id);
await apiClient.resumeTraining(job.id);
await apiClient.stopTraining(job.id);
```

### WebSocket - Real-time Updates
```typescript
// Subscribe به متریک‌ها
const unsubscribe = apiClient.subscribeToMetrics((metrics) => {
  console.log('CPU:', metrics.cpu);
  console.log('GPU:', metrics.gpu);
});

// Subscribe به training progress
apiClient.subscribeToTraining(jobId, (update) => {
  console.log('Progress:', update.progress);
  console.log('Loss:', update.metrics.valLoss);
});
```

---

## 🤖 استفاده از مدل‌های Hugging Face

### دانلود مدل با Python

```python
from transformers import AutoModel, AutoTokenizer

# دانلود ParsBERT
model = AutoModel.from_pretrained("HooshvareLab/bert-fa-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("HooshvareLab/bert-fa-base-uncased")

# ذخیره local
model.save_pretrained("./models/parsbert")
tokenizer.save_pretrained("./models/parsbert")
```

### Fine-tuning مدل

```python
from transformers import Trainer, TrainingArguments

training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=32,
    learning_rate=2e-5,
    fp16=True,  # Mixed Precision
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

trainer.train()
```

برای جزئیات بیشتر: **[MODELS_GUIDE.md](computer:///mnt/user-data/outputs/MODELS_GUIDE.md)**

---

## 📊 دیتاست‌های فارسی

### دانلود از Hugging Face

```python
from datasets import load_dataset

# Persian News
dataset = load_dataset("persiannlp/parsinlu_reading_comprehension")

# Sentiment Analysis
dataset = load_dataset("HooshvareLab/sentiment-fa")

# Question Answering
dataset = load_dataset("persiannlp/parsinlu_multiple_choice")
```

### فرمت دیتاست برای آموزش

```json
{
  "train": [
    {
      "text": "این یک متن فارسی است",
      "label": 0
    }
  ],
  "validation": [
    {
      "text": "متن دیگری برای validation",
      "label": 1
    }
  ]
}
```

---

## 🔥 ویژگی‌های کلیدی

### ✅ Type Safety با TypeScript
```typescript
// همه چیز Type-safe
const stats: DashboardStats = await apiClient.getDashboardStats();
// IntelliSense کامل
// Compile-time error checking
```

### ✅ Real-time با WebSocket
```typescript
// Auto-reconnect
// Heartbeat
// Event subscriptions
```

### ✅ استفاده از مدل‌های واقعی Hugging Face
- ParsBERT برای Classification
- GPT2-Persian برای Text Generation
- mT5 برای Translation
- XLM-RoBERTa برای Multilingual

### ✅ Training پیشرفته
- Mixed Precision (FP16)
- Gradient Accumulation
- Auto-recovery from failures
- Checkpoint management
- Auto-tuning hyperparameters

---

## ⚡ بهینه‌سازی

### 1. استفاده از Mixed Precision
```python
training_args = TrainingArguments(
    fp16=True,  # کاهش 50% مصرف حافظه
    ...
)
```

### 2. Gradient Accumulation
```python
training_args = TrainingArguments(
    gradient_accumulation_steps=4,
    per_device_train_batch_size=8,  # effective batch = 32
    ...
)
```

### 3. استفاده از LoRA (PEFT)
```python
from peft import get_peft_model, LoraConfig

peft_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    r=16,
    lora_alpha=16,
)

model = get_peft_model(model, peft_config)
# فقط 1% پارامترها آموزش می‌بینن!
```

---

## 📈 مثال کامل End-to-End

### 1. دانلود مدل
```bash
python download_models.py --models parsbert
```

### 2. آماده‌سازی دیتاست
```python
from datasets import Dataset

data = {
    "text": ["متن اول", "متن دوم"],
    "label": [0, 1]
}
dataset = Dataset.from_dict(data)
dataset.save_to_disk("./datasets/my-dataset")
```

### 3. شروع آموزش از Frontend
```typescript
const job = await apiClient.startTraining({
  baseModel: 'parsbert',
  datasets: ['my-dataset'],
  modelName: 'my-fine-tuned-model',
  config: {
    epochs: 10,
    batchSize: 32,
    learningRate: 2e-5,
    optimizer: 'adamw',
    mixedPrecision: true
  }
});
```

### 4. مانیتورینگ Real-time
```typescript
apiClient.subscribeToTraining(job.id, (update) => {
  console.log(`Epoch ${update.currentEpoch}/${job.totalEpochs}`);
  console.log(`Loss: ${update.metrics.valLoss}`);
  console.log(`Accuracy: ${update.metrics.valAccuracy}%`);
});
```

### 5. استفاده از مدل آموزش داده شده
```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis", model="./checkpoints/job-1/final")
result = classifier("این محصول عالی است!")
```

---

## 🎯 Requirements

### Backend
```txt
fastapi==0.104.1
uvicorn==0.24.0
transformers==4.35.0
torch==2.1.0
datasets==2.14.6
accelerate==0.24.1
peft==0.6.2
websockets==12.0
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.300.0"
  }
}
```

---

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && uvicorn main:app --reload

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Build Frontend
npm run build

# Deploy با Docker
docker-compose up -d
```

برای جزئیات بیشتر: **[DEPLOYMENT_GUIDE.md](computer:///mnt/user-data/outputs/DEPLOYMENT_GUIDE.md)**

---

## 📚 مستندات

1. **[MODELS_GUIDE.md](computer:///mnt/user-data/outputs/MODELS_GUIDE.md)** - راهنمای کامل مدل‌های Hugging Face
2. **[DEPLOYMENT_GUIDE.md](computer:///mnt/user-data/outputs/DEPLOYMENT_GUIDE.md)** - راهنمای deployment روی VPS

---

## 🔧 Troubleshooting

### مشکل: Model not found
```bash
# دانلود مجدد مدل
python download_models.py --models parsbert
```

### مشکل: CUDA out of memory
```python
# کاهش batch size
training_args = TrainingArguments(
    per_device_train_batch_size=8,  # کاهش از 32 به 8
    gradient_accumulation_steps=4,   # جبران با accumulation
)
```

### مشکل: WebSocket connection failed
```bash
# چک کردن Backend
curl http://localhost:8000/health

# چک کردن .env
VITE_WS_URL=ws://localhost:8000/ws
```

---

## 📞 پشتیبانی

- **Hugging Face Hub**: https://huggingface.co/models
- **Transformers Docs**: https://huggingface.co/docs/transformers
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## ✅ Checklist نهایی

### قبل از شروع:
- [ ] Dependencies نصب شد (pip + npm)
- [ ] مدل‌ها از Hugging Face دانلود شد
- [ ] .env فایل تنظیم شد
- [ ] Backend روی port 8000 در حال اجراست
- [ ] Frontend روی port 5173 در حال اجراست

### برای Production:
- [ ] مدل‌ها روی VPS دانلود شدن
- [ ] Environment variables تنظیم شدن
- [ ] HTTPS فعال است
- [ ] WebSocket روی wss:// کار می‌کنه
- [ ] Monitoring و logging راه‌اندازی شده

---

## 🎉 نتیجه

الان داری:
- ✅ سیستم کامل با TypeScript
- ✅ API Client با WebSocket
- ✅ مدل‌های واقعی از Hugging Face
- ✅ Training pipeline کامل
- ✅ Dashboard با Real-time monitoring
- ✅ مستندات جامع

**همه چیز آماده برای کار با مدل‌های واقعی!** 🚀

---

**لینک‌های مهم**:
- 🤖 مدل‌ها: https://huggingface.co/models?language=fa
- 📊 دیتاست‌ها: https://huggingface.co/datasets?language=fa
- 📚 مستندات: https://huggingface.co/docs/transformers
