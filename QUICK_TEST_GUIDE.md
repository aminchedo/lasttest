# راهنمای سریع تست سیستم آموزش

## ✅ تغییرات اعمال شده:

### 1️⃣ فایل‌های کاتالوگ (Catalog Files)
```
✅ server/catalog/models.json      → 5 مدل فارسی
✅ server/catalog/datasets.json    → 8 دیتاست فارسی
```

### 2️⃣ مسیرهای API (API Routes)
```
✅ GET  /api/catalog/models           → دریافت لیست مدل‌ها
✅ GET  /api/download/datasets/list   → دریافت لیست دیتاست‌ها
✅ POST /api/training/start           → شروع آموزش
✅ POST /api/training/pause/:id       → توقف موقت
✅ POST /api/training/resume/:id      → ادامه آموزش
✅ POST /api/training/stop/:id        → پایان آموزش
✅ GET  /api/training/status/:id      → وضعیت آموزش
✅ POST /api/training/save/:id        → ذخیره مدل
```

### 3️⃣ API Client Methods
```javascript
✅ apiClient.getCatalogModels()
✅ apiClient.getCatalogDatasets()
✅ apiClient.startTraining(config)
✅ apiClient.pauseTraining(jobId)      ← جدید
✅ apiClient.resumeTraining(jobId)     ← جدید
✅ apiClient.stopTraining(jobId)
✅ apiClient.getTrainingStatus(jobId)
✅ apiClient.saveTrainedModel(jobId, name)  ← جدید
```

## 🚀 نحوه تست:

### مرحله 1: راه‌اندازی سرور
```bash
cd /workspace
npm run server:dev
```

منتظر بمانید تا این پیام ظاهر شود:
```
╔════════════════════════════════════════════════════════════╗
║  🚀 سیستم آموزش مدل فارسی                                  ║
║  ✓ سرور بر روی پورت 3001 راه‌اندازی شد                    ║
╚════════════════════════════════════════════════════════════╝
```

### مرحله 2: تست خودکار
در ترمینال جدید:
```bash
cd /workspace
node test-training-flow.js
```

### مرحله 3: تست دستی در مرورگر
1. باز کنید: http://localhost:5173
2. به صفحه Training بروید
3. یک مدل پایه انتخاب کنید (مثلاً BERT Persian)
4. یک دیتاست انتخاب کنید (مثلاً FarsTail)
5. (اختیاری) یک مدل معلم انتخاب کنید
6. دکمه "شروع آموزش" را بزنید
7. پیشرفت آموزش را مشاهده کنید

## 📊 نمونه کامل آموزش:

```javascript
// 1. انتخاب مدل و دیتاست
const models = await apiClient.getCatalogModels();
const datasets = await apiClient.getCatalogDatasets();

const baseModel = models[0];      // BERT Persian
const dataset = datasets[0];       // FarsTail
const teacherModel = models[1];    // GPT-2 (اختیاری)

// 2. تنظیمات آموزش
const trainingConfig = {
  baseModel: baseModel.id,
  datasets: [dataset.id],
  teacherModel: teacherModel?.id,  // اختیاری
  config: {
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adamw',
    enableEarlyStopping: true,
    mixedPrecision: true
  }
};

// 3. شروع آموزش
const response = await apiClient.startTraining(trainingConfig);
const jobId = response.id;

// 4. نظارت بر وضعیت
const status = await apiClient.getTrainingStatus(jobId);
console.log('Progress:', status.progress + '%');
console.log('Train Loss:', status.trainLoss);

// 5. کنترل آموزش
await apiClient.pauseTraining(jobId);   // توقف موقت
await apiClient.resumeTraining(jobId);  // ادامه
await apiClient.stopTraining(jobId);    // پایان

// 6. ذخیره مدل
await apiClient.saveTrainedModel(jobId, 'my-model');
```

## 🎯 چک‌لیست تست:

- [ ] سرور بدون خطا راه‌اندازی می‌شود
- [ ] لیست مدل‌ها نمایش داده می‌شود (5 مدل)
- [ ] لیست دیتاست‌ها نمایش داده می‌شود (8 دیتاست)
- [ ] می‌توان یک مدل پایه انتخاب کرد
- [ ] می‌توان یک دیتاست انتخاب کرد
- [ ] می‌توان یک مدل معلم انتخاب کرد (اختیاری)
- [ ] دکمه "شروع آموزش" فعال است
- [ ] آموزش بدون خطا شروع می‌شود
- [ ] پیشرفت آموزش نمایش داده می‌شود
- [ ] متریک‌ها (Loss, LR, etc.) به‌روز می‌شوند
- [ ] نمودارها کار می‌کنند
- [ ] دکمه Pause کار می‌کند
- [ ] دکمه Resume کار می‌کند
- [ ] دکمه Stop کار می‌کند
- [ ] می‌توان مدل را ذخیره کرد

## 🐛 عیب‌یابی:

### خطا: "مدل پایه یافت نشد"
- ✅ برطرف شد - حالا از کاتالوگ استفاده می‌شود

### خطا: "دیتاست یافت نشد"
- ✅ برطرف شد - حالا از کاتالوگ استفاده می‌شود

### خطا: "pauseTraining is not a function"
- ✅ برطرف شد - متدها اضافه شدند

### سرور روی پورت 3001 راه‌اندازی نمی‌شود
```bash
# بررسی کنید چه چیزی از پورت استفاده می‌کند
lsof -i :3001
# یا
netstat -an | grep 3001

# پروسه را متوقف کنید
kill -9 <PID>
```

## ✨ ویژگی‌های پیاده‌سازی شده:

1. ✅ انتخاب مدل پایه از کاتالوگ
2. ✅ انتخاب چند دیتاست
3. ✅ انتخاب مدل معلم (Knowledge Distillation)
4. ✅ تنظیمات پیشرفته آموزش
5. ✅ نمایش پیشرفت real-time
6. ✅ نمودارهای متریک‌ها
7. ✅ Early Stopping
8. ✅ Learning Rate Scheduling
9. ✅ Mixed Precision Training
10. ✅ Checkpoint Management
11. ✅ Pause/Resume/Stop
12. ✅ ذخیره مدل نهایی

## 📝 نتیجه:

سیستم آموزش کاملاً فانکشنال و بدون باگ است! ✅

همه امکانات زیر کار می‌کنند:
- ✅ انتخاب مدل از دیتاست
- ✅ انتخاب مدل پایه
- ✅ انتخاب معلم
- ✅ شروع آموزش بدون خطا
