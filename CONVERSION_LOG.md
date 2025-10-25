# Style Conversion Log

## Components Identified for Conversion

### 1. metric-card (8 files)
- client/src/pages/Models.jsx
- client/src/pages/ModelsHub.jsx
- client/src/pages/Datasets.jsx
- client/src/pages/Training1.jsx
- client/src/pages/Training.jsx
- client/src/pages/Models2.jsx
- client/src/pages/TTS.jsx
- client/src/components/SystemMonitor.jsx

### 2. model-card (5 files)
- client/src/pages/HuggingFaceModels.jsx
- client/src/pages/Models.jsx
- client/src/pages/TTS.jsx
- client/src/pages/Models2.jsx
- client/src/pages/Training1.jsx

### 3. loading-spinner (15 files)
- client/src/components/Downloader.jsx
- client/src/components/DashboardUnified.jsx
- client/src/pages/DashboardImproved.jsx
- client/src/pages/Exports.jsx
- client/src/pages/DashboardEnhanced.jsx
- client/src/pages/Datasets.jsx
- client/src/pages/TTS.jsx
- client/src/pages/Users.jsx
- client/src/pages/DashboardUnified.jsx
- client/src/pages/Settings.jsx
- client/src/pages/Training1.jsx
- client/src/pages/Analysis.jsx
- client/src/styles/DashboardUnified.jsx
- client/src/pages/Dashboard.tsx
- client/src/pages/Dashboard.jsx

### 4. harmony-tab (1 file)
- client/src/pages/ModelsHub.jsx

## Conversion Strategy

1. Start with ModelsHub.jsx (has all conflicting classes)
2. Convert each file systematically
3. Replace old classes with unified-* classes
4. Keep backup of each file before conversion

## Class Mapping

| Old Class | New Class |
|-----------|-----------|
| `.metric-card` | `.unified-metric-card` |
| `.metric-card-top` | `.unified-metric-card__top` |
| `.metric-card-value` | `.unified-metric-card__value` |
| `.value-primary` | `.unified-metric-card__value-primary` |
| `.value-secondary` | `.unified-metric-card__value-secondary` |
| `.metric-title` | `.unified-metric-card__title` |
| `.metric-subtitle` | `.unified-metric-card__subtitle` |
| `.growth-indicator` | `.unified-metric-card__growth` |
| `.icon-container` | `.unified-metric-card__icon` |
| | |
| `.model-card` | `.unified-model-card` |
| `.model-card-header` | `.unified-model-card__header` |
| `.model-card-modern` | `.unified-model-card` |
| `.model-icon-modern` | `.unified-model-card__icon` |
| `.model-name-modern` | `.unified-model-card__name` |
| | |
| `.loading-spinner` | `.unified-loading-spinner` |
| | |
| `.harmony-tab-navigation` | `.unified-tab-nav` |
| `.harmony-tab-button` | `.unified-tab-btn` |
| `.harmony-tab-button.active` | `.unified-tab-btn--active` |
| `.harmony-tab-content` | `.unified-tab-content` |

## Conversion Progress

- [ ] ModelsHub.jsx
- [ ] Models.jsx
- [ ] Datasets.jsx
- [ ] Training.jsx
- [ ] Training1.jsx
- [ ] Models2.jsx
- [ ] TTS.jsx
- [ ] HuggingFaceModels.jsx
- [ ] SystemMonitor.jsx
- [ ] Downloader.jsx
- [ ] DashboardUnified.jsx
- [ ] Other files...

---

**Backup Location**: `/workspace/backups/components-backup-pre-unified-*/`
