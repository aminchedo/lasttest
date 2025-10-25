import express from 'express';
import { runAsync, getAsync, allAsync } from '../db.js';

const router = express.Router();

// دریافت تمام تنظیمات
router.get('/', async (req, res) => {
  try {
    const settings = await allAsync('settings');
    const result = {};
    settings.forEach(s => {
      result[s.key] = s.value;
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ذخیره تنظیمات
router.post('/', async (req, res) => {
  try {
    const { hf_token, storage_root } = req.body;

    if (!storage_root) {
      return res.status(400).json({ error: 'storage_root الزامی است' });
    }

    // ذخیره تنظیمات
    if (hf_token) {
      // Check if hf_token already exists
      const existingToken = await getAsync('settings', { key: 'hf_token' });
      if (existingToken) {
        await runAsync('settings', 'UPDATE', {
          id: existingToken.id,
          key: 'hf_token',
          value: hf_token
        });
      } else {
        await runAsync('settings', 'INSERT', {
          key: 'hf_token',
          value: hf_token
        });
      }
    }

    // Check if storage_root already exists
    const existingStorage = await getAsync('settings', { key: 'storage_root' });
    if (existingStorage) {
      await runAsync('settings', 'UPDATE', {
        id: existingStorage.id,
        key: 'storage_root',
        value: storage_root
      });
    } else {
      await runAsync('settings', 'INSERT', {
        key: 'storage_root',
        value: storage_root
      });
    }

    res.json({
      success: true,
      message: 'تنظیمات ذخیره شدند ✓'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دریافت تنظیم خاص
router.get('/:key', async (req, res) => {
  try {
    const setting = await getAsync('settings', { key: req.params.key });
    if (setting) {
      res.json({ value: setting.value });
    } else {
      res.status(404).json({ error: 'تنظیم پیدا نشد' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
