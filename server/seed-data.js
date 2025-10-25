// پر کردن دیتابیس با داده‌های نمونه
import { initializeDatabase, runAsync, getAsync, closeDatabase } from './db.js';

async function seedDatabase() {
  console.log('🌱 شروع seed کردن دیتابیس...\n');

  try {
    await initializeDatabase();

    // 1. اضافه کردن مدل‌های نمونه
    console.log('1️⃣ اضافه کردن مدل‌ها...');
    const models = [
      {
        id: 'model-gpt2-fa',
        kind: 'model',
        model_id: 'HooshvareLab/gpt2-fa',
        file_name: 'gpt2-fa',
        status: 'ready',
        bytes_total: 500000000,
        bytes_done: 500000000
      },
      {
        id: 'model-bert-fa',
        kind: 'model',
        model_id: 'HooshvareLab/bert-fa-base-uncased',
        file_name: 'bert-fa-base',
        status: 'ready',
        bytes_total: 440000000,
        bytes_done: 440000000
      },
      {
        id: 'model-roberta-fa',
        kind: 'model',
        model_id: 'HooshvareLab/roberta-fa',
        file_name: 'roberta-fa',
        status: 'ready',
        bytes_total: 480000000,
        bytes_done: 480000000
      }
    ];

    for (const model of models) {
      const exists = await getAsync('SELECT id FROM assets WHERE id = ?', [model.id]);
      if (!exists) {
        await runAsync(
          `INSERT INTO assets (id, kind, model_id, file_name, status, bytes_total, bytes_done)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [model.id, model.kind, model.model_id, model.file_name, model.status, model.bytes_total, model.bytes_done]
        );
        console.log(`   ✅ ${model.model_id} اضافه شد`);
      } else {
        console.log(`   ⏭️  ${model.model_id} از قبل وجود دارد`);
      }
    }

    // 2. اضافه کردن دیتاست‌های نمونه
    console.log('\n2️⃣ اضافه کردن دیتاست‌ها...');
    const datasets = [
      {
        id: 'dataset-persian-news',
        kind: 'dataset',
        model_id: 'Persian News Corpus',
        file_name: 'persian-news.json',
        status: 'ready',
        bytes_total: 2500000000,
        bytes_done: 2500000000
      },
      {
        id: 'dataset-persian-wiki',
        kind: 'dataset',
        model_id: 'Persian Wikipedia',
        file_name: 'fa-wiki.txt',
        status: 'ready',
        bytes_total: 3200000000,
        bytes_done: 3200000000
      },
      {
        id: 'dataset-persian-poems',
        kind: 'dataset',
        model_id: 'Persian Poetry Collection',
        file_name: 'persian-poems.json',
        status: 'ready',
        bytes_total: 1200000000,
        bytes_done: 1200000000
      }
    ];

    for (const dataset of datasets) {
      const exists = await getAsync('SELECT id FROM assets WHERE id = ?', [dataset.id]);
      if (!exists) {
        await runAsync(
          `INSERT INTO assets (id, kind, model_id, file_name, status, bytes_total, bytes_done)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [dataset.id, dataset.kind, dataset.model_id, dataset.file_name, dataset.status, dataset.bytes_total, dataset.bytes_done]
        );
        console.log(`   ✅ ${dataset.model_id} اضافه شد`);
      } else {
        console.log(`   ⏭️  ${dataset.model_id} از قبل وجود دارد`);
      }
    }

    // 3. اضافه کردن مدل‌های TTS
    console.log('\n3️⃣ اضافه کردن مدل‌های TTS...');
    const ttsModels = [
      {
        id: 'tts-persian-female',
        kind: 'tts',
        model_id: 'Persian TTS Female',
        file_name: 'persian-tts-female',
        status: 'ready',
        bytes_total: 350000000,
        bytes_done: 350000000
      },
      {
        id: 'tts-persian-male',
        kind: 'tts',
        model_id: 'Persian TTS Male',
        file_name: 'persian-tts-male',
        status: 'ready',
        bytes_total: 340000000,
        bytes_done: 340000000
      }
    ];

    for (const tts of ttsModels) {
      const exists = await getAsync('SELECT id FROM assets WHERE id = ?', [tts.id]);
      if (!exists) {
        await runAsync(
          `INSERT INTO assets (id, kind, model_id, file_name, status, bytes_total, bytes_done)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [tts.id, tts.kind, tts.model_id, tts.file_name, tts.status, tts.bytes_total, tts.bytes_done]
        );
        console.log(`   ✅ ${tts.model_id} اضافه شد`);
      } else {
        console.log(`   ⏭️  ${tts.model_id} از قبل وجود دارد`);
      }
    }

    // 4. اضافه کردن یک job نمونه
    console.log('\n4️⃣ اضافه کردن job نمونه...');
    const jobId = 'job-sample-training';
    const jobExists = await getAsync('SELECT id FROM jobs WHERE id = ?', [jobId]);
    if (!jobExists) {
      await runAsync(
        `INSERT INTO jobs (id, kind, status, message, progress)
         VALUES (?, ?, ?, ?, ?)`,
        [jobId, 'training', 'completed', 'آموزش با موفقیت تکمیل شد', 100]
      );
      console.log('   ✅ Job نمونه اضافه شد');

      // اضافه کردن run مربوطه
      await runAsync(
        `INSERT INTO runs (id, job_id, status, base_model, datasets, epoch, train_loss, val_loss)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['run-' + jobId, jobId, 'completed', 'model-bert-fa', JSON.stringify(['dataset-persian-news']), 10, 0.45, 0.52]
      );
      console.log('   ✅ Run نمونه اضافه شد');
    } else {
      console.log('   ⏭️  Job نمونه از قبل وجود دارد');
    }

    // 5. اضافه کردن تنظیمات پیش‌فرض
    console.log('\n5️⃣ اضافه کردن تنظیمات پیش‌فرض...');
    const settings = [
      { key: 'storage_root', value: './data' },
      { key: 'hf_token', value: '' },
      { key: 'theme', value: 'modern' },
      { key: 'language', value: 'fa' }
    ];

    for (const setting of settings) {
      const exists = await getAsync('SELECT key FROM settings WHERE key = ?', [setting.key]);
      if (!exists) {
        await runAsync(
          `INSERT INTO settings (key, value) VALUES (?, ?)`,
          [setting.key, setting.value]
        );
        console.log(`   ✅ ${setting.key} اضافه شد`);
      } else {
        console.log(`   ⏭️  ${setting.key} از قبل وجود دارد`);
      }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log('🎉 Seed با موفقیت کامل شد!');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('📊 خلاصه داده‌های اضافه شده:');
    console.log(`   - مدل‌ها: ${models.length}`);
    console.log(`   - دیتاست‌ها: ${datasets.length}`);
    console.log(`   - مدل‌های TTS: ${ttsModels.length}`);
    console.log(`   - Jobs: 1`);
    console.log(`   - تنظیمات: ${settings.length}\n`);

  } catch (error) {
    console.error('❌ خطا در seed کردن:', error);
  } finally {
    await closeDatabase();
  }
}

seedDatabase().catch(console.error);

