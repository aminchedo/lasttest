#!/usr/bin/env python3
"""
اسکریپت دانلود خودکار مدل‌های Hugging Face
Usage: python download_models.py [--models MODEL1,MODEL2,...]
"""

import os
import sys
import argparse
from pathlib import Path
from typing import Dict, List
from transformers import (
    AutoModel,
    AutoTokenizer,
    GPT2LMHeadModel,
    AutoModelForSequenceClassification,
    AutoModelForTokenClassification,
    MT5ForConditionalGeneration,
    MT5Tokenizer
)

# تعریف مدل‌های موجود
AVAILABLE_MODELS = {
    # مدل‌های پایه
    "parsbert": {
        "id": "HooshvareLab/bert-fa-base-uncased",
        "type": "base",
        "size": "440MB",
        "params": "118M"
    },
    "mt5-base": {
        "id": "google/mt5-base",
        "type": "mt5",
        "size": "2.3GB",
        "params": "580M"
    },
    "xlm-roberta-base": {
        "id": "xlm-roberta-base",
        "type": "base",
        "size": "1.1GB",
        "params": "270M"
    },
    "gpt2-persian": {
        "id": "flax-community/gpt2-persian",
        "type": "gpt2",
        "size": "500MB",
        "params": "124M"
    },
    
    # مدل‌های Fine-tuned
    "parsbert-sentiment": {
        "id": "HooshvareLab/bert-fa-base-uncased-sentiment-digikala",
        "type": "sequence-classification",
        "size": "440MB",
        "params": "118M"
    },
    "parsbert-ner": {
        "id": "HooshvareLab/bert-fa-base-uncased-ner-peyma",
        "type": "token-classification",
        "size": "440MB",
        "params": "118M"
    }
}


class ModelDownloader:
    """دانلودر مدل‌های Hugging Face"""
    
    def __init__(self, base_path: str = "./models"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        
    def download_model(self, name: str, model_info: Dict) -> bool:
        """دانلود یک مدل از Hugging Face"""
        model_id = model_info["id"]
        model_type = model_info["type"]
        model_path = self.base_path / name
        
        print(f"\n{'='*60}")
        print(f"📦 دانلود {name}")
        print(f"   ID: {model_id}")
        print(f"   Size: {model_info['size']}")
        print(f"{'='*60}")
        
        try:
            print(f"⏳ در حال دانلود مدل...")
            
            if model_type == "gpt2":
                model = GPT2LMHeadModel.from_pretrained(model_id)
            elif model_type == "mt5":
                model = MT5ForConditionalGeneration.from_pretrained(model_id)
            elif model_type == "sequence-classification":
                model = AutoModelForSequenceClassification.from_pretrained(model_id)
            elif model_type == "token-classification":
                model = AutoModelForTokenClassification.from_pretrained(model_id)
            else:
                model = AutoModel.from_pretrained(model_id)
            
            print(f"⏳ در حال دانلود tokenizer...")
            if model_type == "mt5":
                tokenizer = MT5Tokenizer.from_pretrained(model_id)
            else:
                tokenizer = AutoTokenizer.from_pretrained(model_id)
            
            print(f"💾 در حال ذخیره...")
            model.save_pretrained(model_path)
            tokenizer.save_pretrained(model_path)
            
            print(f"✅ {name} با موفقیت دانلود شد!")
            return True
                
        except Exception as e:
            print(f"❌ خطا در دانلود {name}: {str(e)}")
            return False
    
    def download_all(self, model_names: List[str] = None) -> Dict[str, bool]:
        """دانلود چند مدل"""
        if model_names is None:
            model_names = ["parsbert", "gpt2-persian"]  # فقط مدل‌های اصلی
        
        results = {}
        for name in model_names:
            if name not in AVAILABLE_MODELS:
                print(f"⚠️  مدل '{name}' یافت نشد.")
                results[name] = False
                continue
            
            results[name] = self.download_model(name, AVAILABLE_MODELS[name])
        
        return results


def main():
    """تابع اصلی"""
    parser = argparse.ArgumentParser(description="دانلود مدل‌های Hugging Face")
    parser.add_argument("--models", type=str, help="لیست مدل‌ها")
    parser.add_argument("--list", action="store_true", help="نمایش لیست")
    parser.add_argument("--path", type=str, default="./models", help="مسیر ذخیره")
    
    args = parser.parse_args()
    
    if args.list:
        print("\n📦 مدل‌های موجود:\n")
        for name, info in AVAILABLE_MODELS.items():
            print(f"  • {name:20} - {info['size']}")
            print(f"    {info['id']}\n")
        return
    
    downloader = ModelDownloader(base_path=args.path)
    model_names = [m.strip() for m in args.models.split(",")] if args.models else None
    results = downloader.download_all(model_names)
    
    print(f"\n{'='*60}")
    print(f"✅ موفق: {sum(1 for v in results.values() if v)}")
    print(f"❌ ناموفق: {sum(1 for v in results.values() if not v)}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
