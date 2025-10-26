import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../data/app.json');

let db = null;

export async function initializeDatabase() {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

    // Initialize lowdb
    const adapter = new JSONFile(DB_PATH);
    db = new Low(adapter, {});

    // Load existing data or initialize with defaults
    await db.read();

    if (!db.data || Object.keys(db.data).length === 0) {
      db.data = {
        settings: [],
        assets: [],
        models: [],
        tts_models: [],
        datasets: [],
        jobs: [],
        runs: [],
        training_metrics: [],
        training_logs: [],
        download_queue: [],
        cached_models: [],
        api_requests: []
      };
      await db.write();
    }

    // Initialize default models if assets table is empty
    await initializeDefaultModels();

    console.log('✓ دیتابیس متصل شد');
  } catch (err) {
    console.error('خطا در اتصال به دیتابیس:', err);
    throw err;
  }
}

async function initializeDefaultModels() {
  try {
    await db.read();

    if (!db.data.assets || db.data.assets.length === 0) {
      console.log('🔄 در حال اضافه کردن مدل‌های پیش‌فرض...');

      const defaultModels = [
        {
          id: generateId(),
          model_id: 'gpt2-persian',
          kind: 'model',
          file_name: 'GPT-2 Persian',
          source_url: 'https://huggingface.co/HooshvareLab/gpt2-fa/resolve/main/pytorch_model.bin',
          status: 'ready',
          bytes_total: 1200000000, // 1.2GB
          local_path: '/models/gpt2-persian',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'bert-fa',
          kind: 'model',
          file_name: 'BERT Persian',
          source_url: 'https://huggingface.co/HooshvareLab/bert-fa-base-uncased/resolve/main/pytorch_model.bin',
          status: 'ready',
          bytes_total: 420000000, // 420MB
          local_path: '/models/bert-fa',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'roberta-fa',
          kind: 'model',
          file_name: 'RoBERTa Persian',
          source_url: 'https://huggingface.co/HooshvareLab/roberta-fa-base-uncased/resolve/main/pytorch_model.bin',
          status: 'ready',
          bytes_total: 480000000, // 480MB
          local_path: '/models/roberta-fa',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 't5-fa',
          kind: 'model',
          file_name: 'T5 Persian',
          source_url: 'https://huggingface.co/HooshvareLab/t5-fa-base/resolve/main/pytorch_model.bin',
          status: 'ready',
          bytes_total: 900000000, // 900MB
          local_path: '/models/t5-fa',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        }
      ];

      const defaultDatasets = [
        {
          id: generateId(),
          model_id: 'fartail',
          kind: 'dataset',
          file_name: 'FarsTail Dataset',
          description: 'مجموعه داده استنتاج زبان طبیعی فارسی با ۱۰,۳۶۷ نمونه',
          source_url: 'https://huggingface.co/datasets/HooshvareLab/fartail/resolve/main/train.json',
          status: 'ready',
          bytes_total: 25000000, // 25MB
          local_path: '/datasets/fartail',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'persian-news',
          kind: 'dataset',
          file_name: 'Persian News Dataset',
          description: 'مجموعه داده اخبار فارسی برای آموزش مدل‌های زبانی',
          source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-news/resolve/main/train.json',
          status: 'ready',
          bytes_total: 150000000, // 150MB
          local_path: '/datasets/persian-news',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'persian-sentiment',
          kind: 'dataset',
          file_name: 'Persian Sentiment Dataset',
          description: 'مجموعه داده تحلیل احساسات فارسی',
          source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-sentiment/resolve/main/train.json',
          status: 'ready',
          bytes_total: 50000000, // 50MB
          local_path: '/datasets/persian-sentiment',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'persian-qa',
          kind: 'dataset',
          file_name: 'Persian Question Answering',
          description: 'مجموعه داده پرسش و پاسخ فارسی',
          source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-qa/resolve/main/train.json',
          status: 'ready',
          bytes_total: 80000000, // 80MB
          local_path: '/datasets/persian-qa',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'persian-text-classification',
          kind: 'dataset',
          file_name: 'Persian Text Classification',
          description: 'مجموعه داده طبقه‌بندی متن فارسی',
          source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-text-classification/resolve/main/train.json',
          status: 'ready',
          bytes_total: 120000000, // 120MB
          local_path: '/datasets/persian-text-classification',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        },
        {
          id: generateId(),
          model_id: 'persian-named-entity',
          kind: 'dataset',
          file_name: 'Persian Named Entity Recognition',
          description: 'مجموعه داده شناسایی موجودیت‌های نام‌دار فارسی',
          source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-ner/resolve/main/train.json',
          status: 'ready',
          bytes_total: 60000000, // 60MB
          local_path: '/datasets/persian-ner',
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        }
      ];

      db.data.assets = [...defaultModels, ...defaultDatasets];
      await db.write();
      console.log('✅ مدل‌های پیش‌فرض و دیتاست‌ها اضافه شدند');
    }
  } catch (error) {
    console.error('خطا در اضافه کردن مدل‌های پیش‌فرض:', error);
  }
}

// Tables are automatically created with lowdb - no need for createTables function

export function getDatabase() {
  return db;
}

// Helper function to generate ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to get current timestamp
function getCurrentTimestamp() {
  return new Date().toISOString();
}

export async function runAsync(tableName, operation, data = {}) {
  try {
    await db.read();

    if (!db.data[tableName]) {
      db.data[tableName] = [];
    }

    let result;
    switch (operation) {
      case 'INSERT':
        const newItem = {
          id: data.id || generateId(),
          ...data,
          created_at: getCurrentTimestamp(),
          updated_at: getCurrentTimestamp()
        };
        db.data[tableName].push(newItem);
        result = { id: newItem.id, changes: 1 };
        break;
      case 'UPDATE':
        const index = db.data[tableName].findIndex(item => item.id === data.id);
        if (index !== -1) {
          db.data[tableName][index] = {
            ...db.data[tableName][index],
            ...data,
            updated_at: getCurrentTimestamp()
          };
          result = { id: data.id, changes: 1 };
        } else {
          result = { id: null, changes: 0 };
        }
        break;
      case 'DELETE':
        const deleteIndex = db.data[tableName].findIndex(item => item.id === data.id);
        if (deleteIndex !== -1) {
          db.data[tableName].splice(deleteIndex, 1);
          result = { id: data.id, changes: 1 };
        } else {
          result = { id: null, changes: 0 };
        }
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    await db.write();
    return result;
  } catch (err) {
    throw err;
  }
}

export async function getAsync(tableName, conditions = {}) {
  try {
    await db.read();

    if (!db.data[tableName]) {
      return null;
    }

    const items = db.data[tableName];
    return items.find(item => {
      return Object.keys(conditions).every(key => item[key] === conditions[key]);
    }) || null;
  } catch (err) {
    throw err;
  }
}

export async function allAsync(tableName, conditions = {}) {
  try {
    await db.read();

    if (!db.data[tableName]) {
      return [];
    }

    let items = db.data[tableName];

    if (Object.keys(conditions).length > 0) {
      items = items.filter(item => {
        return Object.keys(conditions).every(key => item[key] === conditions[key]);
      });
    }

    return items || [];
  } catch (err) {
    throw err;
  }
}

export async function closeDatabase() {
  try {
    if (db) {
      await db.write();
      console.log('✓ دیتابیس بسته شد');
    }
  } catch (err) {
    console.error('خطا در بستن دیتابیس:', err);
    throw err;
  }
}
