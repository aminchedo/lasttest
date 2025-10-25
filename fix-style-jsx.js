const fs = require('fs');
const path = require('path');

// فایل‌هایی که باید بررسی شوند
const filesToFix = [
    'client/src/pages/Kitchen.jsx',
    'client/src/components/PathInput.jsx',
    'client/src/components/Footer.jsx',
    'client/src/pages/Training.jsx',
    'client/src/pages/CheckpointManager.jsx',
    'client/src/pages/AutoTuner.jsx',
    'client/src/components/DashboardUnified.jsx',
    'client/src/pages/TrainingAdvanced.jsx',
    'client/src/pages/DashboardEnhanced.jsx',
    'client/src/pages/Dashboard.tsx',
    'client/src/pages/MonitoringStrip.jsx',
    'client/src/pages/DashboardImproved.jsx'
];

function fixFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  فایل وجود ندارد: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        const before = content;

        // حذف jsx attribute از تگ‌های style
        content = content.replace(/<style\s+jsx(\s+global)?(\s*=\s*\{?true\}?)?>/g, '<style>');

        if (content !== before) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ اصلاح شد: ${filePath}`);
        } else {
            console.log(`⚪ تغییری نیاز نبود: ${filePath}`);
        }
    } catch (error) {
        console.error(`❌ خطا در ${filePath}:`, error.message);
    }
}

console.log('🔧 شروع اصلاح فایل‌ها...\n');

filesToFix.forEach(fixFile);

console.log('\n✨ تمام فایل‌ها بررسی شدند!');

