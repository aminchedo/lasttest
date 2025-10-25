# 🚀 Persian Model Trainer - نسخه اصلاح شده و کامل

## ✅ تغییرات و بهبودها

### 🔧 اصلاحات روتینگ
- ✅ همه صفحات به درستی در App.jsx وصل شدند
- ✅ صفحه Kitchen حالا کاملاً کار می‌کند
- ✅ تمام عناوین صفحات در getPageTitle تکمیل شدند
- ✅ ناوبری بین صفحات به درستی عمل می‌کند

### 🗑️ حذف فایل‌های تکراری
فایل‌های زیر برای تمیز کردن پروژه حذف شدند:
- ❌ Dashboard.jsx, Dashboard.tsx (نسخه‌های قدیمی)
- ❌ DashboardEnhanced.jsx, DashboardImproved.jsx (نسخه‌های قبلی)
- ❌ Training1.jsx, TrainingAdvanced.jsx (تکراری)
- ❌ فایل‌های zip غیرضروری
- ❌ کامپوننت‌های تکراری

### 📦 فایل‌های نهایی

#### صفحات اصلی (12 صفحه)
```
✓ DashboardUnified.jsx  - داشبورد کامل با نمودارها
✓ Models.jsx            - مدیریت مدل‌ها
✓ Training.jsx          - آموزش کامل با فیچرهای پیشرفته
✓ Datasets.jsx          - مدیریت داده‌ها
✓ TTS.jsx               - تبدیل متن به گفتار
✓ Analysis.jsx          - آنالیز و گزارش‌گیری
✓ Exports.jsx           - خروجی‌ها
✓ Users.jsx             - مدیریت کاربران
✓ Kitchen.jsx           - آشپزخانه مدل‌سازی
✓ Settings.jsx          - تنظیمات
✓ HuggingFaceModels.jsx - مدل‌های Hugging Face
✓ AutoTuner.jsx         - تنظیم خودکار
✓ CheckpointManager.jsx - مدیریت چک‌پوینت
```

---

## 🎯 ویژگی‌های کلیدی

### 1. داشبورد (DashboardUnified)
- 📊 نمودارهای Real-time (CPU, GPU, Memory)
- 💹 متریک‌های سیستم لحظه‌ای
- 📈 تاریخچه منابع
- 🎯 آمار مدل‌ها و آموزش‌ها
- 🔄 بروزرسانی خودکار هر 5 ثانیه
- 🎨 طراحی Glassmorphism مدرن

### 2. آموزش (Training) - کامل‌ترین بخش
#### ویژگی‌های پایه:
- 🎓 آموزش مدل‌های زبانی
- 📊 نمایش پیشرفت Real-time
- ⏸️ Pause/Resume
- 💾 ذخیره خودکار چک‌پوینت

#### ویژگی‌های پیشرفته:
- 🔧 **AutoTuner**: تنظیم خودکار هایپرپارامترها
  - بهینه‌سازی Learning Rate
  - بهینه‌سازی Batch Size
  - Warmup Steps
  - Weight Decay
  
- 💾 **Checkpoint Manager**:
  - ذخیره خودکار
  - بازیابی از چک‌پوینت
  - نگهداری بهترین مدل‌ها
  - حذف چک‌پوینت‌های ضعیف

- ⚡ **Performance**:
  - Mixed Precision Training (FP16)
  - Gradient Accumulation
  - Multi-GPU Support
  - Gradient Checkpointing

- 🎯 **Optimization**:
  - Early Stopping
  - Learning Rate Schedulers (6 نوع)
  - Optimizers (6 نوع: Adam, AdamW, SGD, RMSprop, LAMB, Adafactor)
  - Gradient Clipping

- 📝 **Knowledge Distillation**:
  - آموزش با Teacher Model
  - Temperature Scaling
  - Alpha Blending

### 3. آشپزخانه (Kitchen) - ویژگی منحصر به فرد
- 👨‍🍳 استعاره آشپزخانه برای آموزش مدل
- 🔥 نمایش وضعیت به صورت حالت پخت:
  - Preheating (آماده‌سازی)
  - Simmering (آتش ملایم)
  - Boiling (جوشیدن)
  - Finishing (تکمیل)
  - Ready (آماده)
  - Burnt (سوخته - خطا)
- ⏱️ تایمر و زمان باقیمانده
- 🌡️ دمای استعاری (پیشرفت)
- 🎨 انیمیشن‌های جذاب

### 4. مدیریت مدل‌ها (Models)
- 📥 دانلود از Hugging Face
- 📤 آپلود مدل‌های سفارشی
- 🏷️ تگ‌گذاری و دسته‌بندی
- 📊 آمار استفاده و عملکرد
- 🔍 جستجو و فیلتر
- 🗑️ حذف و مدیریت

### 5. مدیریت داده (Datasets)
- 📂 آپلود فایل (CSV, JSON, TXT)
- 🔍 پیش‌نمایش داده
- 📊 آمار و توزیع
- ✂️ تقسیم‌بندی Train/Val/Test
- 🔄 Shuffle و Preprocessing
- 💾 ذخیره و بارگذاری

### 6. Hugging Face Integration
- 🤗 دسترسی به هزاران مدل
- 📥 دانلود مستقیم
- 🔍 جستجو در مدل‌ها
- ⭐ مرتب‌سازی بر اساس محبوبیت
- 📖 نمایش اطلاعات مدل

---

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
```
Node.js >= 16.0.0
npm >= 8.0.0
یا yarn >= 1.22.0
```

### مراحل نصب

#### 1. استخراج فایل
```bash
unzip farsi-model-trainer-fixed.zip
cd farsi-model-trainer-fixed
```

#### 2. نصب وابستگی‌ها
```bash
npm install
```

یا با yarn:
```bash
yarn install
```

#### 3. اجرای برنامه (Development)
```bash
npm run dev
```

یا:
```bash
yarn dev
```

#### 4. Build برای Production
```bash
npm run build
```

پوشه `dist` ساخته می‌شود که شامل فایل‌های آماده استقرار است.

#### 5. پیش‌نمایش Production Build
```bash
npm run preview
```

---

## 📂 ساختار کامل پروژه

```
farsi-model-trainer-fixed/
│
├── src/
│   ├── App.jsx                      # اصلی - روتینگ کامل
│   ├── main.jsx                     # نقطه ورود
│   ├── config.js                    # تنظیمات
│   │
│   ├── pages/                       # 13 صفحه
│   │   ├── DashboardUnified.jsx     # داشبورد اصلی (39K)
│   │   ├── Training.jsx             # آموزش کامل (56K)
│   │   ├── Models.jsx               # مدل‌ها (21K)
│   │   ├── Datasets.jsx             # داده‌ها (22K)
│   │   ├── Kitchen.jsx              # آشپزخانه (20K)
│   │   ├── Analysis.jsx             # آنالیز (16K)
│   │   ├── TTS.jsx                  # متن به گفتار (15K)
│   │   ├── Exports.jsx              # خروجی (14K)
│   │   ├── Users.jsx                # کاربران (14K)
│   │   ├── Settings.jsx             # تنظیمات (22K)
│   │   ├── HuggingFaceModels.jsx    # HF (6.6K)
│   │   ├── AutoTuner.jsx            # Auto-tuner (28K)
│   │   └── CheckpointManager.jsx    # Checkpoints (15K)
│   │
│   ├── components/                  # کامپوننت‌ها
│   │   ├── Navigation.jsx           # منوی کناری
│   │   ├── MonitoringStrip.jsx      # نوار مانیتورینگ
│   │   ├── NetworkMonitor.jsx       # مانیتور شبکه
│   │   ├── Downloader.jsx           # دانلودر
│   │   ├── ErrorBoundary.jsx        # مدیریت خطا
│   │   ├── Header.jsx               # هدر
│   │   ├── Footer.jsx               # فوتر
│   │   ├── HealthBadge.jsx          # نشانگر سلامت
│   │   ├── SystemMonitor.jsx        # مانیتور سیستم
│   │   ├── PathInput.jsx            # ورودی مسیر
│   │   ├── FileScanner.jsx          # اسکنر فایل
│   │   └── CatalogPicker.jsx        # انتخابگر کاتالوگ
│   │
│   ├── api/                         # API
│   │   ├── client.js                # کلاینت اصلی
│   │   ├── endpoints.js             # تمام اندپوینت‌ها
│   │   ├── types.ts                 # تایپ‌های TypeScript
│   │   └── mockData.ts              # داده‌های تستی
│   │
│   └── styles/                      # استایل‌ها
│       ├── main.css                 # اصلی
│       ├── rtl.css                  # راست به چپ
│       ├── modern-design.css        # طراحی مدرن
│       ├── glassmorphism.css        # افکت شیشه‌ای
│       ├── animations.css           # انیمیشن‌ها
│       ├── datasets.css             # داده‌ها
│       ├── analysis.css             # آنالیز
│       ├── exports.css              # خروجی
│       ├── settings.css             # تنظیمات
│       ├── tts.css                  # TTS
│       └── real-design.css          # طراحی واقعی
│
├── README.md                        # این فایل
├── package.json                     # وابستگی‌ها
├── vite.config.js                   # تنظیمات Vite
├── index.html                       # HTML اصلی
└── .gitignore                       # Git ignore

```

---

## 🎨 تکنولوژی‌های استفاده شده

### Frontend Framework
- ⚛️ React 18
- 🎨 Framer Motion (انیمیشن)
- 📊 Recharts (نمودارها)
- 🎯 Lucide React (آیکون‌ها)

### Build Tools
- ⚡ Vite
- 🎨 PostCSS
- 🔧 ESLint

### Styling
- 🎨 CSS Modules
- 💎 Glassmorphism
- 🌈 CSS Variables
- 📱 Responsive Design

### State Management
- 🔄 React Hooks (useState, useEffect, useRef)
- 🎯 Context API (برای تنظیمات گلوبال)

### API Communication
- 🌐 Fetch API
- 🔌 WebSocket (برای Real-time)
- 🔄 Auto-retry mechanism

---

## 🔑 ویژگی‌های نسخه 2.5.0

### ✨ جدید
- ✅ روتینگ کامل و بدون خطا
- ✅ صفحه Kitchen کاملاً functional
- ✅ AutoTuner برای بهینه‌سازی خودکار
- ✅ CheckpointManager پیشرفته
- ✅ Knowledge Distillation
- ✅ Multi-GPU Support

### 🔧 بهبودها
- ⚡ بهبود Performance
- 🎨 بهبود UI/UX
- 📱 بهبود Responsive Design
- 🔄 بهبود Real-time Updates
- 💾 بهبود مدیریت حافظه

### 🐛 رفع باگ‌ها
- ✅ مشکل روتینگ Kitchen
- ✅ مشکل نمایش Dashboard
- ✅ مشکل فایل‌های تکراری
- ✅ مشکل بروزرسانی Metrics

---

## 📖 راهنمای استفاده

### 1. شروع آموزش
1. به صفحه Training بروید
2. مدل پایه را انتخاب کنید
3. داده‌ها را انتخاب کنید
4. تنظیمات را adjust کنید
5. Start Training را بزنید

### 2. استفاده از AutoTuner
1. در صفحه Training
2. Advanced Settings را باز کنید
3. Enable Auto-Tuning را فعال کنید
4. Budget (تعداد آزمایش) را تنظیم کنید
5. شروع کنید

### 3. مدیریت Checkpoints
1. در طول Training
2. Checkpoints خودکار ذخیره می‌شوند
3. CheckpointManager را باز کنید
4. بهترین checkpoint را انتخاب کنید
5. Resume یا Export کنید

### 4. استفاده از Kitchen
1. به Kitchen بروید
2. Training جاری را مشاهده کنید
3. به صورت استعاره آشپزخانه نمایش داده می‌شود
4. پیشرفت را به صورت دمای پخت ببینید

---

## 🔧 تنظیمات پیشرفته

### Training Config
```javascript
{
  // اصلی
  epochs: 10,
  batchSize: 32,
  learningRate: 0.001,
  optimizer: 'adamw',
  
  // پیشرفته
  lrScheduler: 'cosine',
  warmupSteps: 500,
  warmupRatio: 0.1,
  weightDecay: 0.01,
  gradientAccumulationSteps: 4,
  maxGradNorm: 1.0,
  
  // Performance
  mixedPrecision: true,
  gradientCheckpointing: true,
  multiGPU: true,
  
  // Early Stopping
  enableEarlyStopping: true,
  earlyStoppingPatience: 3,
  
  // Checkpointing
  saveCheckpointEvery: 100,
  keepTopCheckpoints: 3
}
```

---

## 🚨 رفع مشکلات رایج

### مشکل 1: صفحه سفید
**راه حل:**
```bash
npm install
npm run dev
```

### مشکل 2: خطای Import
**راه حل:** مطمئن شوید همه فایل‌ها در مسیر صحیح هستند

### مشکل 3: نمایش نادرست
**راه حل:** Cache مرورگر را پاک کنید (Ctrl+Shift+R)

### مشکل 4: کندی
**راه حل:** 
- Real-time updates را کاهش دهید
- تعداد datapoints در نمودارها را محدود کنید

---

## 📞 پشتیبانی و کمک

اگر مشکلی دارید:
1. ✅ README را دوباره مطالعه کنید
2. ✅ Console را برای خطاها چک کنید
3. ✅ Network tab را بررسی کنید
4. ✅ از نسخه‌های درست Node/npm استفاده کنید

---

## 🎉 نتیجه‌گیری

این نسخه شامل:
- ✅ **صفحات کامل و functional**
- ✅ **بدون فایل تکراری**
- ✅ **روتینگ صحیح 100%**
- ✅ **UI/UX مدرن و زیبا**
- ✅ **Performance بهینه**
- ✅ **کد تمیز و منظم**

**آماده استفاده و توسعه است! 🚀**

---

© 1404 - Persian Model Trainer v2.5.0
