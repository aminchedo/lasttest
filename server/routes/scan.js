import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { runAsync } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// اسکن کامل پوشه برای تمام فایل‌ها و پوشه‌ها
router.post('/', async (req, res) => {
  try {
    const { root, includeAll = true, maxDepth = 10 } = req.body;

    if (!root) {
      return res.status(400).json({ error: 'مسیر ریشه الزامی است' });
    }

    console.log(`🔍 شروع اسکن: ${root}`);
    console.log(`📋 تنظیمات: includeAll=${includeAll}, maxDepth=${maxDepth}`);
    const startTime = Date.now();

    const results = await scanDirectoryComplete(root, 0, maxDepth, includeAll);
    const endTime = Date.now();

    // فیلتر کردن فقط فایل‌ها (نه پوشه‌ها) برای نمایش به کاربر
    const filesOnly = results.filter(item => !item.isDirectory);

    console.log(`✅ اسکن کامل شد: ${results.length} مورد کل (${filesOnly.length} فایل، ${results.length - filesOnly.length} پوشه) در ${endTime - startTime}ms`);

    res.json({
      success: true,
      path: root,
      items: filesOnly, // فقط فایل‌ها را برمی‌گردانیم
      totalItems: filesOnly.length,
      totalScanned: results.length,
      scanTime: endTime - startTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ خطا در اسکن:', error);
    res.status(500).json({ error: error.message });
  }
});

// اسکن کامل با جزئیات بیشتر
router.post('/scan-complete', async (req, res) => {
  try {
    const { root, includeAll = true, maxDepth = 10, fileTypes = [] } = req.body;

    if (!root) {
      return res.status(400).json({ error: 'مسیر ریشه الزامی است' });
    }

    console.log(`🔍 شروع اسکن کامل: ${root}`);
    const startTime = Date.now();

    const results = await scanDirectoryComplete(root, 0, maxDepth, includeAll);

    // فیلتر کردن بر اساس نوع فایل
    let filteredResults = results;
    if (fileTypes.length > 0) {
      filteredResults = results.filter(item =>
        fileTypes.includes(item.kind) || fileTypes.includes(item.type)
      );
    }

    // آمار
    const stats = {
      totalItems: results.length,
      files: results.filter(r => !r.isDirectory).length,
      directories: results.filter(r => r.isDirectory).length,
      byKind: {},
      byExtension: {},
      totalSize: results.reduce((sum, r) => sum + (r.size || 0), 0),
      scanTime: Date.now() - startTime
    };

    // گروه‌بندی بر اساس نوع
    results.forEach(item => {
      if (!item.isDirectory) {
        stats.byKind[item.kind] = (stats.byKind[item.kind] || 0) + 1;
        if (item.extension) {
          stats.byExtension[item.extension] = (stats.byExtension[item.extension] || 0) + 1;
        }
      }
    });

    const endTime = Date.now();
    console.log(`✅ اسکن کامل شد: ${stats.totalItems} مورد در ${stats.scanTime}ms`);

    res.json({
      success: true,
      path: root,
      items: filteredResults,
      stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ خطا در اسکن کامل:', error);
    res.status(500).json({ error: error.message });
  }
});

// دریافت آمار فایل‌ها
router.get('/stats/:path(*)', async (req, res) => {
  try {
    const targetPath = decodeURIComponent(req.params.path);
    const stats = await getDirectoryStats(targetPath);

    res.json({
      success: true,
      path: targetPath,
      stats: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// واردات دارایی‌های اسکن‌شده
router.post('/import', async (req, res) => {
  try {
    const { items } = req.body;
    const { getAsync } = await import('../db.js');

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'موارد انتخاب‌شده وجود ندارند' });
    }

    const importedAssets = [];
    const importedModels = [];
    const importedTTS = [];
    const importedDatasets = [];
    const skippedItems = [];

    for (const item of items) {
      const itemId = uuidv4();

      // شناسایی نوع و اضافه کردن به جدول مناسب
      if (item.kind === 'tts-model') {
        // بررسی تکراری بودن
        const existing = await getAsync(
          'SELECT id FROM tts_models WHERE local_path = ? OR name = ?',
          [item.path, item.name.replace(/\.(zip|tar|gz|pth|pt|bin)$/i, '')]
        );
        
        if (existing) {
          console.log(`⏭️  TTS مدل تکراری نادیده گرفته شد: ${item.name}`);
          skippedItems.push({ ...item, reason: 'duplicate' });
          continue;
        }
        // اضافه کردن به جدول TTS
        const modelName = item.name.replace(/\.(zip|tar|gz|pth|pt|bin)$/i, '');
        const gender = item.name.toLowerCase().includes('female') ? 'female' :
          item.name.toLowerCase().includes('male') ? 'male' : 'neutral';

        await runAsync(
          `INSERT INTO tts_models (id, name, language, gender, size, status, local_path, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [
            itemId,
            modelName,
            'fa', // زبان فارسی
            gender,
            item.size || 0,
            'ready',
            item.path
          ]
        );

        importedTTS.push({
          id: itemId,
          name: modelName,
          type: 'tts',
          ...item
        });

      } else if (item.kind === 'chat-model' || item.kind === 'model') {
        // بررسی تکراری بودن
        const modelName = item.name.replace(/\.(zip|tar|gz|pth|pt|bin)$/i, '');
        const existing = await getAsync(
          'SELECT id FROM models WHERE local_path = ? OR name = ?',
          [item.path, modelName]
        );
        
        if (existing) {
          console.log(`⏭️  مدل تکراری نادیده گرفته شد: ${item.name}`);
          skippedItems.push({ ...item, reason: 'duplicate' });
          continue;
        }
        
        // اضافه کردن به جدول Models
        const modelId = item.path.includes('persian-chat') ? 'persian-chat-model' : modelName;

        await runAsync(
          `INSERT INTO models (id, name, repo_id, size, status, local_path, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            itemId,
            modelName,
            modelId,
            item.size || 0,
            'ready',
            item.path
          ]
        );

        importedModels.push({
          id: itemId,
          name: modelName,
          type: 'model',
          ...item
        });

      } else if (item.kind === 'dataset') {
        // بررسی تکراری بودن
        const datasetName = item.name.replace(/\.(zip|tar|gz)$/i, '');
        const existing = await getAsync(
          'SELECT id FROM datasets WHERE local_path = ? OR name = ?',
          [item.path, datasetName]
        );
        
        if (existing) {
          console.log(`⏭️  دیتاست تکراری نادیده گرفته شد: ${item.name}`);
          skippedItems.push({ ...item, reason: 'duplicate' });
          continue;
        }
        
        // اضافه کردن به جدول Datasets
        await runAsync(
          `INSERT INTO datasets (id, name, size, status, local_path, created_at)
           VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [
            itemId,
            datasetName,
            item.size || 0,
            'ready',
            item.path
          ]
        );

        importedDatasets.push({
          id: itemId,
          name: datasetName,
          type: 'dataset',
          ...item
        });

      } else {
        // سایر فایل‌ها به جدول assets
        await runAsync(
          `INSERT INTO assets (id, kind, model_id, file_name, source_url, local_path, status)
           VALUES (?, ?, ?, ?, ?, ?, 'ready')`,
          [
            itemId,
            item.kind,
            item.model_id || 'unknown',
            item.name,
            'local',
            item.path
          ]
        );
      }

      importedAssets.push({
        id: itemId,
        ...item
      });
    }

    const totalImported = importedModels.length + importedTTS.length + importedDatasets.length + importedAssets.length;
    console.log(`✅ واردات کامل شد: ${importedModels.length} مدل، ${importedTTS.length} TTS، ${importedDatasets.length} دیتاست، ${importedAssets.length} دارایی`);
    
    if (skippedItems.length > 0) {
      console.log(`⏭️  ${skippedItems.length} مورد تکراری نادیده گرفته شد`);
    }

    res.json({
      success: true,
      imported: totalImported,
      skipped: skippedItems.length,
      importedModels: importedModels,
      importedTTS: importedTTS,
      importedDatasets: importedDatasets,
      importedAssets: importedAssets,
      skippedItems: skippedItems,
      counts: {
        models: importedModels.length,
        tts: importedTTS.length,
        datasets: importedDatasets.length,
        assets: importedAssets.length,
        total: totalImported,
        skipped: skippedItems.length
      }
    });
  } catch (error) {
    console.error('❌ خطا در واردات:', error);
    res.status(500).json({ error: error.message });
  }
});

// تابع اسکن کامل تمام فایل‌ها و پوشه‌ها
async function scanDirectoryComplete(dir, depth = 0, maxDepth = 10, includeAll = true) {
  const results = [];

  if (depth > maxDepth) {
    console.log(`⚠️ حداکثر عمق رسیده: ${dir}`);
    return results;
  }

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    console.log(`📁 اسکن پوشه: ${dir} (${entries.length} مورد)`);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      try {
        const stats = await fs.stat(fullPath);

        if (entry.isDirectory()) {
          // اضافه کردن پوشه به نتایج (برای لاگ)
          results.push({
            name: entry.name,
            path: fullPath,
            size: 0,
            kind: 'directory',
            type: 'folder',
            isDirectory: true,
            depth: depth,
            modified: stats.mtime,
            created: stats.birthtime,
            permissions: stats.mode.toString(8)
          });

          // اسکن بازگشتی پوشه‌ها - همیشه اگر includeAll است یا shouldScanDirectory تأیید کند
          const shouldScan = includeAll || shouldScanDirectory(entry.name, depth);
          console.log(`📂 پوشه "${entry.name}" (عمق ${depth}): ${shouldScan ? 'اسکن می‌شود' : 'نادیده گرفته شد'}`);
          
          if (shouldScan) {
            console.log(`🔍 شروع اسکن بازگشتی: ${fullPath}`);
            const subResults = await scanDirectoryComplete(fullPath, depth + 1, maxDepth, includeAll);
            results.push(...subResults);
            console.log(`✅ ${subResults.length} مورد از "${entry.name}" اضافه شد (${subResults.filter(r => !r.isDirectory).length} فایل، ${subResults.filter(r => r.isDirectory).length} پوشه)`);
          }
        } else {
          // اضافه کردن فایل به نتایج
          const ext = path.extname(entry.name).toLowerCase();
          const kind = getFileKind(entry.name, ext, fullPath);

          results.push({
            name: entry.name,
            path: fullPath,
            size: stats.size,
            kind: kind,
            type: 'file',
            isDirectory: false,
            depth: depth,
            extension: ext,
            modified: stats.mtime,
            created: stats.birthtime,
            permissions: stats.mode.toString(8),
            readable: stats.size < 100 * 1024 * 1024 // کمتر از 100MB
          });
        }
      } catch (statError) {
        console.warn(`⚠️ خطا در خواندن ${fullPath}:`, statError.message);
        // اضافه کردن با اطلاعات محدود
        results.push({
          name: entry.name,
          path: fullPath,
          size: 0,
          kind: 'unknown',
          type: entry.isDirectory() ? 'folder' : 'file',
          isDirectory: entry.isDirectory(),
          depth: depth,
          error: statError.message
        });
      }
    }
  } catch (err) {
    console.error(`❌ خطا در خواندن دایرکتوری ${dir}:`, err.message);
    results.push({
      name: path.basename(dir),
      path: dir,
      size: 0,
      kind: 'error',
      type: 'error',
      isDirectory: true,
      depth: depth,
      error: err.message
    });
  }

  return results;
}

// تعیین نوع فایل بر اساس نام، مسیر و پسوند
function getFileKind(filename, ext, fullPath = '') {
  const name = filename.toLowerCase();
  const pathLower = fullPath.toLowerCase();

  // شناسایی مدل‌های TTS
  if (pathLower.includes('tts') || pathLower.includes('voice') || pathLower.includes('speech')) {
    if (['.pth', '.pt', '.ckpt', '.safetensors', '.bin', '.onnx'].includes(ext)) {
      return 'tts-model';
    }
    if (['.zip', '.tar', '.gz'].includes(ext)) {
      if (name.includes('female') || name.includes('male') || name.includes('voice') || name.includes('tts')) {
        return 'tts-model';
      }
    }
  }

  // شناسایی مدل‌های چت/NLP
  if (pathLower.includes('persian-chat') || pathLower.includes('chat') || pathLower.includes('nlp')) {
    if (['.pth', '.pt', '.ckpt', '.safetensors', '.bin', '.onnx'].includes(ext)) {
      return 'chat-model';
    }
  }

  // مدل‌های ماشین لرنینگ عمومی
  if (['.pth', '.pt', '.ckpt', '.safetensors', '.bin', '.onnx'].includes(ext)) {
    // بررسی سایز - مدل‌های بزرگ معمولاً مدل‌های اصلی هستند
    if (name.includes('model') || name.includes('pytorch_model')) {
      return 'model';
    }
    return 'model';
  }

  // فایل‌های فشرده که احتمالاً مدل هستند
  if (['.zip', '.tar', '.gz'].includes(ext)) {
    if (name.includes('model') || name.includes('checkpoint') || name.includes('weight')) {
      return 'model';
    }
    if (name.includes('female') || name.includes('male') || name.includes('tts') || name.includes('voice')) {
      return 'tts-model';
    }
    if (name.includes('transcript') || name.includes('speech_commands')) {
      return 'dataset';
    }
    return 'archive';
  }

  // فایل‌های پیکربندی
  if (['.json', '.yaml', '.yml', '.toml', '.ini', '.cfg'].includes(ext)) {
    if (name.includes('config') || name.includes('setting')) return 'config';
    return 'data';
  }

  // فایل‌های واژگان
  if (name.includes('vocab') || name.includes('tokenizer')) {
    return 'vocabulary';
  }

  // فایل‌های داده
  if (['.txt', '.csv', '.tsv', '.jsonl'].includes(ext)) {
    return 'dataset';
  }

  // فایل‌های صوتی
  if (['.wav', '.mp3', '.flac', '.ogg', '.m4a'].includes(ext)) {
    return 'audio';
  }

  // فایل‌های تصویری
  if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'].includes(ext)) {
    return 'image';
  }

  // فایل‌های کد
  if (['.py', '.js', '.ts', '.cpp', '.c', '.h', '.java'].includes(ext)) {
    return 'code';
  }

  // فایل‌های مستندات
  if (['.md', '.pdf', '.doc', '.docx'].includes(ext)) {
    return 'document';
  }

  return 'other';
}

// تعیین اینکه آیا پوشه باید اسکن شود یا نه
function shouldScanDirectory(dirName, depth) {
  const name = dirName.toLowerCase();

  // پوشه‌های سیستم را نادیده بگیر
  const systemDirs = [
    'node_modules', '__pycache__', '.git', '.vscode', 'venv', 'env',
    '.idea', '.vs', 'bin', 'obj', 'dist', 'build', '.next'
  ];
  if (systemDirs.includes(name)) {
    console.log(`⏭️  پوشه سیستمی نادیده گرفته شد: ${dirName}`);
    return false;
  }

  // پوشه‌های مخفی را نادیده بگیر
  if (name.startsWith('.')) {
    console.log(`⏭️  پوشه مخفی نادیده گرفته شد: ${dirName}`);
    return false;
  }

  // همه پوشه‌های دیگر را اسکن کن
  console.log(`✅ پوشه اسکن می‌شود: ${dirName} (عمق: ${depth})`);
  return true;
}

// دریافت آمار دایرکتوری
async function getDirectoryStats(dirPath) {
  try {
    const stats = await fs.stat(dirPath);
    if (!stats.isDirectory()) {
      return {
        isFile: true,
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime
      };
    }

    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const result = {
      isDirectory: true,
      totalItems: entries.length,
      files: 0,
      directories: 0,
      totalSize: 0,
      modified: stats.mtime,
      created: stats.birthtime,
      byExtension: {},
      byKind: {}
    };

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      try {
        const entryStats = await fs.stat(fullPath);

        if (entry.isDirectory()) {
          result.directories++;
        } else {
          result.files++;
          result.totalSize += entryStats.size;

          const ext = path.extname(entry.name).toLowerCase();
          const kind = getFileKind(entry.name, ext, fullPath);

          result.byExtension[ext] = (result.byExtension[ext] || 0) + 1;
          result.byKind[kind] = (result.byKind[kind] || 0) + 1;
        }
      } catch (err) {
        console.warn(`خطا در خواندن ${fullPath}:`, err.message);
      }
    }

    return result;
  } catch (error) {
    throw new Error(`خطا در خواندن آمار ${dirPath}: ${error.message}`);
  }
}

export default router;
