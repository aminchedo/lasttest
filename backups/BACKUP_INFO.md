# اطلاعات بکاپ استایل‌ها

## تاریخ و زمان بکاپ
2025-10-25

## محتویات بکاپ

### 1. پوشه `styles-backup-20251025/`
- **محتوا**: تمام فایل‌های CSS از `/workspace/client/src/styles/`
- **تعداد فایل‌ها**: ~29 فایل CSS
- **شامل**:
  - `main.css`
  - `rtl-harmonization.css`
  - `models.css`
  - `datasets.css`
  - `animations.css`
  - `glassmorphism.css`
  - و سایر فایل‌های استایل

### 2. پوشه `pages-css-backup-20251025/`
- **محتوا**: تمام فایل‌های CSS از `/workspace/client/src/pages/`
- **شامل**:
  - `Models.css`
  - `ModelsHub.css`
  - `ModelsHub.layout.css`
  - `Training.css`
  - `metric.css`
  - `DashboardUnified.css`
  - `ModelsHub.fix.css`

### 3. پوشه `component-css-backup-20251025/`
- **محتوا**: تمام فایل‌های CSS از `/workspace/client/src/components/`
- **شامل**:
  - `Downloader.css`

### 4. پوشه `main-files-backup-20251025/`
- **محتوا**: فایل‌های اصلی پروژه
- **شامل**:
  - `main.jsx.backup`
  - `App.jsx.backup`
  - `index.css.backup`

## دلیل بکاپ

قبل از اعمال تغییرات برای رفع تداخل استایل‌ها و ایجاد سیستم استایل یکپارچه، از تمام فایل‌های مرتبط بکاپ گرفته شد.

## مشکلات شناسایی شده (قبل از رفع)

1. کلاس `.metric-card` در 10 فایل مختلف
2. کلاس `.model-card` در 11 فایل مختلف
3. کلاس `.loading-spinner` در 15 فایل مختلف
4. کلاس‌های `.harmony-tab-*` در 5 فایل مختلف
5. فایل تکراری `rtl-harmonization.css` در دو مکان

## راه‌حل پیاده‌سازی شده

- ایجاد فایل `unified-styles.css` با نام‌گذاری BEM
- استفاده از متغیرهای CSS
- حذف فایل تکراری `rtl-harmonization.css` از pages

## نحوه بازگشت به حالت قبل

در صورت نیاز به بازگشت:

```bash
# بازگردانی پوشه styles
cp -r /workspace/backups/styles-backup-20251025/* /workspace/client/src/styles/

# بازگردانی فایل‌های CSS از pages
cp /workspace/backups/pages-css-backup-20251025/* /workspace/client/src/pages/

# بازگردانی فایل‌های CSS از components
cp /workspace/backups/component-css-backup-20251025/* /workspace/client/src/components/

# بازگردانی فایل‌های اصلی
cp /workspace/backups/main-files-backup-20251025/main.jsx.backup /workspace/client/src/main.jsx
cp /workspace/backups/main-files-backup-20251025/App.jsx.backup /workspace/client/src/App.jsx
cp /workspace/backups/main-files-backup-20251025/index.css.backup /workspace/client/src/index.css
```

## توصیه‌ها

1. این بکاپ را نگه دارید تا اطمینان حاصل شود که تغییرات جدید به درستی کار می‌کنند
2. پس از اطمینان از عملکرد صحیح (حدود 1-2 هفته)، می‌توانید بکاپ را حذف کنید
3. در صورت بروز مشکل، بلافاصله از دستورات بالا برای بازگشت استفاده کنید

---

**نکته**: تمام بکاپ‌ها با موفقیت ایجاد شدند ✅
