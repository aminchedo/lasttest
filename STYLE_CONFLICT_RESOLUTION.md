# راهنمای رفع تداخل استایل‌ها

## مشکلات شناسایی شده

### 1. کلاس‌های تکراری
کلاس‌های زیر در چندین فایل CSS تعریف شده‌اند:

- `.metric-card` - در **10 فایل** مختلف
- `.model-card` - در **11 فایل** مختلف  
- `.loading-spinner` - در **15 فایل** مختلف
- `.harmony-tab-*` - در **5 فایل** مختلف

### 2. فایل‌های تکراری
- `rtl-harmonization.css` هم در `styles/` و هم در `pages/` وجود داشت (حذف شد ✅)

### 3. تداخلات استایل
هر فایل استایل‌های متفاوتی برای کلاس‌های یکسان تعریف می‌کرد که باعث رفتار غیرقابل پیش‌بینی می‌شد.

---

## راه‌حل پیاده‌سازی شده

### 1. فایل یکپارچه استایل
یک فایل جدید با نام `unified-styles.css` ایجاد شد که:

- از متغیرهای CSS استفاده می‌کند
- از نام‌گذاری BEM استفاده می‌کند تا تداخل جلوگیری شود
- تمام کلاس‌ها با پیشوند `unified-` شروع می‌شوند

### 2. نام‌گذاری BEM
برای جلوگیری از تداخل، همه کلاس‌ها با پیشوند `unified-` شروع می‌شوند:

**قبل:**
```css
.metric-card { ... }
.metric-card-top { ... }
.metric-card-value { ... }
```

**بعد:**
```css
.unified-metric-card { ... }
.unified-metric-card__top { ... }
.unified-metric-card__value { ... }
```

### 3. ساختار کلاس‌ها

#### Metric Cards
```jsx
<div className="unified-metric-card">
  <div className="unified-metric-card__top">
    <div className="unified-metric-card__growth">+12%</div>
    <div className="unified-metric-card__icon unified-metric-card__icon--primary">
      <Icon />
    </div>
  </div>
  <div className="unified-metric-card__value">
    <span className="unified-metric-card__value-primary">42</span>
    <span className="unified-metric-card__value-secondary">مدل</span>
  </div>
  <div className="unified-metric-card__content">
    <h3 className="unified-metric-card__title">عنوان</h3>
    <p className="unified-metric-card__subtitle">توضیحات</p>
  </div>
</div>
```

#### Model Cards
```jsx
<div className="unified-model-card">
  <div className="unified-model-card__header">
    <div className="unified-model-card__icon unified-model-card__icon--text">
      <Icon />
    </div>
    <div className="unified-model-card__info">
      <h3 className="unified-model-card__name">نام مدل</h3>
      <p className="unified-model-card__description">توضیحات</p>
    </div>
  </div>
  <div className="unified-model-card__actions">
    <button className="unified-btn unified-btn--primary">دانلود</button>
  </div>
</div>
```

#### Loading Spinner
```jsx
<div className="unified-loading-spinner"></div>
<div className="unified-loading-spinner unified-loading-spinner--small"></div>
<div className="unified-loading-spinner unified-loading-spinner--large"></div>
```

#### Tabs
```jsx
<div className="unified-tab-nav">
  <button className="unified-tab-btn unified-tab-btn--active">تب ۱</button>
  <button className="unified-tab-btn">تب ۲</button>
</div>
<div className="unified-tab-content">
  محتوا
</div>
```

#### Buttons
```jsx
<button className="unified-btn unified-btn--primary">دکمه اصلی</button>
<button className="unified-btn unified-btn--secondary">دکمه ثانویه</button>
<button className="unified-btn unified-btn--success">موفق</button>
<button className="unified-btn unified-btn--danger">خطر</button>
```

#### Grids
```jsx
<div className="unified-grid unified-grid--4-cols">
  {/* 4 ستون */}
</div>

<div className="unified-grid unified-grid--auto-fill">
  {/* استفاده خودکار از فضا */}
</div>
```

---

## مراحل بعدی

### 1. به‌روزرسانی `main.jsx`
فایل استایل جدید را import کنید:

```javascript
import './styles/unified-styles.css'
```

### 2. به‌روزرسانی کامپوننت‌ها
کلاس‌های قدیمی را با کلاس‌های جدید جایگزین کنید:

**قبل:**
```jsx
<div className="metric-card">
  <div className="metric-card-top">
```

**بعد:**
```jsx
<div className="unified-metric-card">
  <div className="unified-metric-card__top">
```

### 3. حذف فایل‌های قدیمی (اختیاری)
پس از مطمئن شدن از کارکرد صحیح، فایل‌های CSS قدیمی که دیگر استفاده نمی‌شوند را حذف کنید.

---

## مزایای این رویکرد

✅ **بدون تداخل**: هر کلاس منحصر به فرد است  
✅ **قابل نگهداری**: ساختار BEM واضح و منظم  
✅ **متغیرهای CSS**: تغییر آسان تم و رنگ‌ها  
✅ **ریسپانسیو**: پشتیبانی کامل از موبایل  
✅ **RTL**: پشتیبانی کامل از راست به چپ  
✅ **دسترسی‌پذیر**: Focus states و reduced motion  
✅ **چاپ**: استایل‌های بهینه برای چاپ

---

## نکات مهم

1. **استفاده از متغیرها**: همیشه از متغیرهای CSS استفاده کنید:
   ```css
   color: var(--color-primary);
   padding: var(--spacing-lg);
   ```

2. **نام‌گذاری BEM**: از این الگو پیروی کنید:
   - Block: `.unified-block`
   - Element: `.unified-block__element`
   - Modifier: `.unified-block--modifier`

3. **ریسپانسیو**: استایل‌ها برای تمام اندازه‌های صفحه بهینه شده‌اند

4. **تداخل استایل**: از `!important` استفاده نکنید مگر در موارد بسیار ضروری

---

## پشتیبانی

در صورت بروز مشکل یا سوال:
1. ابتدا Developer Tools مرورگر را بررسی کنید
2. مطمئن شوید از کلاس‌های صحیح استفاده می‌کنید
3. Import فایل `unified-styles.css` را چک کنید
