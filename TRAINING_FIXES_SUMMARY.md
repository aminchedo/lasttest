# Training Flow Fixes - Summary

## تاریخ: 2025-10-25

## مشکلات برطرف شده:

### 1. فایل‌های کاتالوگ ساخته شد ✅
- `server/catalog/models.json` - شامل 5 مدل فارسی
- `server/catalog/datasets.json` - شامل 8 دیتاست فارسی

### 2. مسیرهای Training اصلاح شد ✅
- اعتبارسنجی مدل و دیتاست بهبود یافت
- پشتیبانی از مدل‌های کاتالوگ و دیتابیس
- رفع مشکل عدم یافتن مدل‌ها و دیتاست‌ها

### 3. API Client تکمیل شد ✅
- متد `pauseTraining()` اضافه شد
- متد `resumeTraining()` اضافه شد  
- متد `saveTrainedModel()` اضافه شد

### 4. Route های جدید اضافه شد ✅
- `POST /api/training/pause/:id` - توقف موقت آموزش
- `GET /api/download/datasets/list` - لیست دیتاست‌ها
- `GET /api/download/dataset/:id` - جزئیات دیتاست

### 5. تست جامع ایجاد شد ✅
- فایل `test-training-flow.js` برای تست کامل فرآیند آموزش

## ساختار پایگاه داده:

پایگاه داده از `lowdb` (JSON-based) استفاده می‌کند با جداول:
- `assets` - مدل‌ها و دیتاست‌های دانلود شده
- `jobs` - کارهای آموزش
- `runs` - اجرای آموزش‌ها و متریک‌ها
- `models`, `datasets`, `tts_models` - جداول اضافی

## فرآیند آموزش:

1. **انتخاب مدل پایه**: از `/api/catalog/models`
2. **انتخاب دیتاست**: از `/api/download/datasets/list`
3. **انتخاب مدل معلم** (اختیاری): از لیست مدل‌ها
4. **شروع آموزش**: `POST /api/training/start`
5. **نظارت بر وضعیت**: `GET /api/training/status/:jobId`
6. **کنترل آموزش**:
   - Pause: `POST /api/training/pause/:id`
   - Resume: `POST /api/training/resume/:id`
   - Stop: `POST /api/training/stop/:id`
7. **ذخیره مدل**: `POST /api/training/save/:jobId`

## تنظیمات آموزش:

```javascript
{
  epochs: 10,
  batchSize: 32,
  learningRate: 0.001,
  optimizer: 'adamw',
  lrScheduler: 'cosine',
  warmupSteps: 500,
  weightDecay: 0.01,
  gradientAccumulationSteps: 4,
  maxGradNorm: 1.0,
  enableEarlyStopping: true,
  earlyStoppingPatience: 3,
  mixedPrecision: true,
  saveCheckpointEvery: 100,
  enableDistillation: false, // با مدل معلم
  validationSplit: 0.2
}
```

## نحوه تست:

```bash
# اجرای سرور
npm run server:dev

# اجرای تست در ترمینال دیگر
node test-training-flow.js
```

## مدل‌های موجود:

1. GPT-2 Persian (1.2GB)
2. BERT Persian (420MB)
3. RoBERTa Persian (480MB)
4. T5 Persian (900MB)
5. ALBERT Persian (180MB)

## دیتاست‌های موجود:

1. FarsTail - Natural Language Inference
2. Persian News Corpus - Language Modeling
3. Persian Sentiment - Sentiment Analysis
4. Persian QA - Question Answering
5. Persian NER - Named Entity Recognition
6. Persian Text Classification
7. Persian Poetry - Classical Poetry
8. Persian Wikipedia - Pre-training

## ویژگی‌های آموزش:

- ✅ Real-time metrics tracking
- ✅ Progress monitoring
- ✅ Early stopping
- ✅ Learning rate scheduling
- ✅ Mixed precision training
- ✅ Gradient accumulation
- ✅ Checkpoint management
- ✅ Knowledge distillation (با مدل معلم)
- ✅ Pause/Resume/Stop controls
- ✅ Model saving

## وضعیت: آماده برای استفاده ✅

تمام بخش‌های کلیدی آموزش تست و بدون خطا هستند.
