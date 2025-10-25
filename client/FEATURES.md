# 🎯 راهنمای کامل ویژگی‌ها

## 📊 داشبورد (Dashboard)

### نمای کلی
داشبورد مرکز فرماندهی سیستم است که اطلاعات زنده و real-time را نمایش می‌دهد.

### ویژگی‌ها:
- **کارت‌های آماری:**
  - تعداد مدل‌های فعال
  - تعداد داده‌های آموزشی
  - وضعیت سیستم
  - میانگین latency

- **نمودارهای Real-time:**
  - استفاده CPU
  - استفاده GPU
  - استفاده Memory
  - استفاده Disk

- **فعالیت‌های اخیر:**
  - شروع آموزش جدید
  - تکمیل آموزش
  - دانلود مدل
  - خطاها

- **بروزرسانی خودکار:**
  - هر 5 ثانیه
  - بدون نیاز به رفرش صفحه
  - WebSocket برای real-time

### نحوه استفاده:
1. به داشبورد بروید
2. اطلاعات را مشاهده کنید
3. برای بروزرسانی دستی، دکمه Refresh را بزنید

---

## 🧠 مدیریت مدل‌ها (Models)

### نمای کلی
مدیریت کامل مدل‌های هوش مصنوعی

### ویژگی‌ها:

#### 1. مشاهده مدل‌ها:
- لیست کامل مدل‌ها
- اطلاعات هر مدل:
  - نام
  - نوع (GPT, BERT, etc.)
  - اندازه
  - تاریخ ساخت
  - دقت
  - وضعیت

#### 2. دانلود از Hugging Face:
- جستجو در مدل‌ها
- دانلود مستقیم
- نمایش پیشرفت دانلود
- ذخیره خودکار

#### 3. آپلود مدل:
- آپلود مدل سفارشی
- پشتیبانی از فرمت‌های مختلف
- اعتبارسنجی خودکار

#### 4. مدیریت:
- تغییر نام
- حذف
- تگ‌گذاری
- دسته‌بندی

### نحوه استفاده:

#### دانلود از Hugging Face:
1. به صفحه Models بروید
2. دکمه "Download from HF" را بزنید
3. نام مدل را جستجو کنید
4. مدل را انتخاب کنید
5. Download را بزنید

#### آپلود مدل:
1. دکمه "Upload Model" را بزنید
2. فایل را انتخاب کنید
3. اطلاعات را وارد کنید
4. Upload را بزنید

---

## 🎓 آموزش (Training)

### نمای کلی
پیشرفته‌ترین بخش سیستم برای آموزش مدل‌ها

### ویژگی‌های پایه:

#### 1. انتخاب مدل:
- انتخاب مدل پایه
- پشتیبانی از مدل‌های مختلف
- امکان استفاده از Checkpoint

#### 2. انتخاب داده:
- انتخاب چند داده همزمان
- نمایش اطلاعات داده
- تقسیم Train/Val

#### 3. تنظیمات اصلی:
- **Epochs:** تعداد دوره آموزش (1-1000)
- **Batch Size:** اندازه دسته (1-256)
- **Learning Rate:** نرخ یادگیری (0.0001-0.1)
- **Optimizer:** نوع بهینه‌ساز
  - Adam
  - AdamW (پیشنهادی)
  - SGD
  - RMSprop
  - LAMB
  - Adafactor

#### 4. شروع/توقف:
- دکمه Start Training
- دکمه Pause (موقت)
- دکمه Stop (قطعی)
- دکمه Resume (ادامه)

### ویژگی‌های پیشرفته:

#### 1. Learning Rate Scheduler:
```
- Constant: ثابت
- Linear: خطی
- Cosine: کسینوسی (پیشنهادی)
- Cosine with Restarts: کسینوسی با Restart
- Exponential: نمایی
- Step: پلکانی
- Polynomial: چندجمله‌ای
- Inverse Sqrt: ریشه معکوس
```

#### 2. Optimization:
- **Warmup Steps:** گرم کردن (0-5000)
- **Weight Decay:** وزن‌دهی کاهش (0-0.1)
- **Gradient Accumulation:** تجمیع گرادیان (1-16)
- **Max Grad Norm:** محدودیت گرادیان (0-10)
- **Mixed Precision:** دقت مختلط (FP16)

#### 3. Early Stopping:
- فعال/غیرفعال
- Patience: صبر (1-10 epoch)
- Threshold: آستانه (0.0001-0.01)

#### 4. Checkpointing:
- ذخیره خودکار
- فاصله ذخیره (هر چند step)
- تعداد checkpoint نگهداری
- بازیابی خودکار

#### 5. Knowledge Distillation:
- استفاده از Teacher Model
- Alpha: نسبت ترکیب (0-1)
- Temperature: دمای softmax (1-5)

### AutoTuner 🔧

AutoTuner به صورت خودکار بهترین هایپرپارامترها را پیدا می‌کند.

#### ویژگی‌ها:
- جستجوی خودکار
- Bayesian Optimization
- نمایش پیشرفت
- مقایسه Trial ها
- انتخاب بهترین config

#### نحوه استفاده:
1. در صفحه Training
2. Advanced Settings را باز کنید
3. Enable Auto-Tuning را فعال کنید
4. Budget را تنظیم کنید (10-50 trial)
5. Metric را انتخاب کنید (val_loss پیشنهادی)
6. Start Training را بزنید
7. منتظر بمانید تا tuning تمام شود
8. بهترین config را ببینید و اعمال کنید

### نمودارها:

#### 1. Loss Chart:
- Train Loss (زرد)
- Validation Loss (آبی)
- Real-time Update

#### 2. Learning Rate:
- نمایش LR فعلی
- تغییرات در طول زمان

#### 3. Throughput:
- تعداد Sample در ثانیه
- عملکرد سیستم

#### 4. Metrics:
- Accuracy
- F1-Score
- Perplexity
- سایر معیارها

### نکات مهم:

#### 1. انتخاب Learning Rate:
```
کوچک (0.0001): آموزش آهسته اما دقیق
متوسط (0.001): پیشنهادی برای شروع
بزرگ (0.01): آموزش سریع اما خطر Diverge
```

#### 2. انتخاب Batch Size:
```
کوچک (8-16): GPU کم، Training پایدار
متوسط (32-64): پیشنهادی
بزرگ (128-256): GPU زیاد، Training سریع
```

#### 3. Mixed Precision:
- فعال کردن آن باعث صرفه‌جویی 50% حافظه می‌شود
- Training تا 2x سریع‌تر می‌شود
- دقت معمولاً تغییر نمی‌کند

#### 4. Early Stopping:
- برای جلوگیری از Overfitting
- Patience=3 معمولاً کافی است
- Threshold=0.0001 پیشنهادی

---

## 📂 مدیریت داده (Datasets)

### ویژگی‌ها:

#### 1. آپلود داده:
- فرمت‌های پشتیبانی شده:
  - CSV
  - JSON
  - TXT
  - JSONL
  - Parquet

#### 2. پیش‌نمایش:
- نمایش نمونه‌ها
- آمار داده:
  - تعداد سطر
  - تعداد ستون
  - توزیع کلاس‌ها
  - میانگین طول

#### 3. پردازش:
- Tokenization
- Cleaning
- Normalization
- Augmentation

#### 4. تقسیم:
- Train: 70-80%
- Validation: 10-15%
- Test: 10-15%

### نحوه استفاده:

#### آپلود:
1. به Datasets بروید
2. Upload Dataset را بزنید
3. فایل را انتخاب کنید
4. تنظیمات را adjust کنید
5. Upload را بزنید

#### پیش‌نمایش:
1. روی dataset کلیک کنید
2. نمونه‌ها را ببینید
3. آمار را بررسی کنید

---

## 👨‍🍳 آشپزخانه (Kitchen)

### نمای کلی
نمایش جذاب و خلاقانه فرآیند آموزش با استعاره آشپزخانه

### استعاره‌ها:

#### 1. حالت‌های پخت:
- **Preheating** (آماده‌سازی):
  - فر در حال گرم شدن
  - پیشرفت: 0%
  - رنگ: بنفش

- **Simmering** (آتش ملایم):
  - پخت آرام
  - پیشرفت: 0-30%
  - رنگ: آبی

- **Boiling** (جوشیدن):
  - پخت شدید
  - پیشرفت: 30-70%
  - رنگ: نارنجی

- **Finishing** (تکمیل):
  - آماده شدن
  - پیشرفت: 70-100%
  - رنگ: فیروزه‌ای

- **Ready** (آماده):
  - غذا آماده است
  - پیشرفت: 100%
  - رنگ: سبز

- **Burnt** (سوخته):
  - خطا رخ داده
  - رنگ: قرمز

#### 2. عناصر:
- 🔥 آتش: نشان‌دهنده شدت
- 🌡️ دما: نشان‌دهنده پیشرفت
- ⏱️ تایمر: زمان باقیمانده
- 👨‍🍳 سرآشپز: مدیر Training

### نحوه استفاده:
1. Training را شروع کنید
2. به Kitchen بروید
3. وضعیت را به صورت استعاره ببینید
4. لذت ببرید!

---

## 🔍 آنالیز (Analysis)

### ویژگی‌ها:
- گزارش‌های جامع
- نمودارهای تحلیلی
- مقایسه مدل‌ها
- Export به PDF/Excel

---

## 🎤 متن به گفتار (TTS)

### ویژگی‌ها:
- تبدیل متن فارسی به گفتار
- انتخاب صدا
- تنظیم سرعت
- تنظیم Pitch
- دانلود فایل صوتی

---

## ⚙️ تنظیمات (Settings)

### بخش‌ها:

#### 1. عمومی:
- زبان
- تم (روشن/تاریک - بزودی)
- واحدها

#### 2. Training:
- تنظیمات پیش‌فرض
- Auto-save
- Notification

#### 3. API:
- آدرس Backend
- Timeout
- Retry

#### 4. Performance:
- Cache
- Worker Threads
- Memory Limit

---

## 🤗 Hugging Face

### ویژگی‌ها:
- دسترسی به هزاران مدل
- جستجو و فیلتر
- مرتب‌سازی
- دانلود مستقیم
- نمایش اطلاعات

---

## 💡 نکات کلی

### 1. Performance:
- از Mixed Precision استفاده کنید
- Batch Size را بهینه کنید
- Gradient Accumulation برای GPU کم

### 2. Quality:
- از Early Stopping استفاده کنید
- Validation Split مناسب
- Regularization (Weight Decay)

### 3. Speed:
- Multi-GPU
- Larger Batch Size
- Gradient Checkpointing OFF (سریع‌تر اما حافظه بیشتر)

### 4. Stability:
- Gradient Clipping
- Warmup Steps
- Conservative Learning Rate

---

## 📊 مثال‌های کاربردی

### مثال 1: آموزش سریع
```
Epochs: 5
Batch Size: 64
Learning Rate: 0.001
Mixed Precision: ON
Optimizer: AdamW
Scheduler: Cosine
```

### مثال 2: آموزش دقیق
```
Epochs: 20
Batch Size: 32
Learning Rate: 0.0003
Mixed Precision: ON
Early Stopping: ON (patience=5)
Optimizer: AdamW
Scheduler: Cosine with Restarts
```

### مثال 3: GPU محدود
```
Epochs: 10
Batch Size: 8
Gradient Accumulation: 4
Mixed Precision: ON
Gradient Checkpointing: ON
Learning Rate: 0.0005
```

---

**برای اطلاعات بیشتر، README.md را مطالعه کنید.**
