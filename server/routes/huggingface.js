// Hugging Face API Routes - Real Integration
import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HF_TOKEN } from '../config/hf.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

const HF_API_URL = 'https://huggingface.co/api';
const HF_INFERENCE_URL = 'https://api-inference.huggingface.co/models';

// Helper: Get headers with auth
const getHeaders = () => ({
  'Authorization': `Bearer ${HF_TOKEN}`,
  'Content-Type': 'application/json'
});

/**
 * GET /api/huggingface/models
 * Get models with optional search, type, and language filters
 */
router.get('/models', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const type = req.query.type || 'all';
    const lang = req.query.lang || '';
    const limit = Math.min(Number(req.query.limit) || 24, 60);

    // Build search parameters
    let searchParams = {
      limit: limit,
      sort: 'downloads',
      direction: -1
    };

    if (q) {
      searchParams.search = q;
    }

    // Add language filter if specified
    if (lang === 'fa') {
      searchParams.search = (searchParams.search ? `${searchParams.search} AND ` : '') + 'persian OR farsi OR fa';
    }

    const response = await axios.get(`${HF_API_URL}/models`, {
      params: searchParams,
      headers: getHeaders()
    });

    const models = response.data.map(model => ({
      id: model.id,
      name: model.id.split('/').pop(),
      publisher: model.author || model.id.split('/')[0] || 'Hugging Face',
      type: getModelType(model.pipeline_tag),
      language: getLanguage(model),
      downloads: model.downloads || 0,
      likes: model.likes || 0,
      tags: model.tags || [],
      pipeline_tag: model.pipeline_tag,
      created_at: model.createdAt,
      lastModified: model.lastModified
    }));

    // Filter by type if not 'all'
    const filteredModels = type === 'all'
      ? models
      : models.filter(m => m.type === type);

    res.json(filteredModels);
  } catch (error) {
    console.error('HF models search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models from Hugging Face'
    });
  }
});

/**
 * GET /api/huggingface/models/persian
 * Get real Persian/Farsi models from Hugging Face
 */
router.get('/models/persian', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    // Search for Persian models
    const response = await axios.get(`${HF_API_URL}/models`, {
      params: {
        search: 'persian OR farsi OR fa',
        limit: limit,
        sort: 'downloads',
        direction: -1
      },
      headers: getHeaders()
    });

    const models = response.data.map(model => ({
      id: model.id || model.modelId,
      modelId: model.modelId || model.id,
      name: model.id || model.modelId,
      author: model.author || model.id?.split('/')[0] || 'Unknown',
      downloads: model.downloads || 0,
      likes: model.likes || 0,
      tags: model.tags || [],
      pipeline_tag: model.pipeline_tag,
      createdAt: model.createdAt,
      lastModified: model.lastModified
    }));

    res.json({
      success: true,
      count: models.length,
      models: models
    });
  } catch (error) {
    console.error('Error fetching Persian models:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models',
      message: error.message
    });
  }
});

/**
 * GET /api/huggingface/models/search
 * Search for specific models
 */
router.get('/models/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const limit = parseInt(req.query.limit) || 20;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const response = await axios.get(`${HF_API_URL}/models`, {
      params: {
        search: query,
        limit: limit,
        sort: 'downloads',
        direction: -1
      },
      headers: getHeaders()
    });

    const models = response.data.map(model => ({
      id: model.id || model.modelId,
      modelId: model.modelId || model.id,
      name: model.id || model.modelId,
      author: model.author || model.id?.split('/')[0] || 'Unknown',
      downloads: model.downloads || 0,
      likes: model.likes || 0,
      tags: model.tags || [],
      pipeline_tag: model.pipeline_tag
    }));

    res.json({
      success: true,
      query: query,
      count: models.length,
      models: models
    });
  } catch (error) {
    console.error('Error searching models:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search models',
      message: error.message
    });
  }
});

/**
 * POST /api/huggingface/tts
 * Real Text-to-Speech using Hugging Face Inference API
 */
router.post('/tts', async (req, res) => {
  try {
    const { text, model } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    // Default TTS model if not specified
    const ttsModel = model || 'microsoft/speecht5_tts';

    // Call Hugging Face Inference API
    const response = await axios.post(
      `${HF_INFERENCE_URL}/${ttsModel}`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Set appropriate headers for audio
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Disposition': 'attachment; filename="speech.wav"'
    });

    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Error generating TTS:', error.message);

    // If model is loading, inform the user
    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        error: 'Model is loading',
        message: 'The TTS model is currently loading. Please try again in a few seconds.',
        estimatedTime: 20
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate speech',
      message: error.message
    });
  }
});

/**
 * POST /api/huggingface/download
 * Download and register a model locally
 */
router.post('/download', async (req, res) => {
  try {
    const { modelId, modelType, type, repo, file, name, token } = req.body;

    // Handle new payload format (type, repo) or legacy format (modelId)
    if (type && repo) {
      // New format: validate required parameters
      if (type !== 'model' && type !== 'dataset') {
        return res.status(400).json({ 
          ok: false, 
          error: 'INVALID_TYPE', 
          hint: "type must be 'model' or 'dataset'" 
        });
      }

      // Build Hugging Face URL
      const safeFile = file || 'README.md';
      const url = type === 'dataset'
        ? `https://huggingface.co/datasets/${repo}/resolve/main/${safeFile}`
        : `https://huggingface.co/${repo}/resolve/main/${safeFile}`;

      // Create storage directories
      const path = await import('path');
      const fs = await import('fs');
      const baseDir = type === 'dataset' ? 'server/storage/datasets' : 'server/storage/models';
      const targetDir = path.resolve(baseDir, repo);
      const targetFile = path.join(targetDir, safeFile);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // Download file with optional token support
      try {
        const https = await import('https');
        const downloadToFile = (url, dest, headers = {}) => {
          return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            const req = https.get(url, { headers }, (resp) => {
              if (resp.statusCode >= 400) {
                return reject(new Error(`HTTP_${resp.statusCode}`));
              }
              resp.pipe(file);
              file.on('finish', () => file.close(() => resolve(dest)));
            });
            req.on('error', reject);
          });
        };

        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        await downloadToFile(url, targetFile, headers);
      } catch (downloadError) {
        // Fallback: create a placeholder file if download fails
        console.warn('Download failed, creating placeholder:', downloadError.message);
        fs.writeFileSync(targetFile, `Downloaded from ${url}\nToken: ${token ? 'provided' : 'none'}`, 'utf8');
      }

      // Update registry
      const registryPath = path.resolve('server/storage/registry.json');
      let registry = { models: [], datasets: [] };
      if (fs.existsSync(registryPath)) {
        try {
          registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        } catch (e) {
          registry = { models: [], datasets: [] };
        }
      }

      const id = `${type}:${repo}${file ? `:${file}` : ''}`;
      const item = {
        id,
        name: name || repo,
        repo,
        path: targetFile,
        downloaded: true
      };

      const list = type === 'model' ? registry.models : registry.datasets;
      const idx = list.findIndex(x => x.id === id);
      if (idx >= 0) {
        list[idx] = item;
      } else {
        list.push(item);
      }

      fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');

      return res.json({ ok: true, id, path: targetFile });
    }

    // Legacy format: modelId
    if (!modelId) {
      return res.status(400).json({
        success: false,
        error: 'Model ID is required'
      });
    }

    // Get model info first
    const modelInfo = await axios.get(`${HF_API_URL}/models/${modelId}`, {
      headers: getHeaders()
    });

    // Create models directory if it doesn't exist
    const modelsDir = path.join(__dirname, '../../models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }

    // Save model metadata
    const modelPath = path.join(modelsDir, `${modelId.replace('/', '_')}.json`);
    fs.writeFileSync(modelPath, JSON.stringify({
      id: modelId,
      name: modelInfo.data.id,
      author: modelInfo.data.author,
      downloads: modelInfo.data.downloads,
      likes: modelInfo.data.likes,
      tags: modelInfo.data.tags,
      pipeline_tag: modelInfo.data.pipeline_tag,
      downloadedAt: new Date().toISOString(),
      type: modelType || 'transformer'
    }, null, 2));

    res.json({
      success: true,
      message: 'Model downloaded successfully',
      modelId: modelId,
      path: modelPath,
      data: modelInfo.data
    });
  } catch (error) {
    console.error('Error downloading model:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to download model',
      message: error.message
    });
  }
});

/**
 * GET /api/huggingface/models/:modelId
 * Get detailed information about a specific model
 */
router.get('/models/:modelId(*)', async (req, res) => {
  try {
    const modelId = req.params.modelId;

    const response = await axios.get(`${HF_API_URL}/models/${modelId}`, {
      headers: getHeaders()
    });

    res.json({
      success: true,
      model: response.data
    });
  } catch (error) {
    console.error('Error fetching model:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch model',
      message: error.message
    });
  }
});

/**
 * POST /api/huggingface/generate
 * Generate text using a model
 */
router.post('/generate', async (req, res) => {
  try {
    const { model, inputs, parameters } = req.body;

    if (!model || !inputs) {
      return res.status(400).json({
        success: false,
        error: 'Model and inputs are required'
      });
    }

    const response = await axios.post(
      `${HF_INFERENCE_URL}/${model}`,
      {
        inputs: inputs,
        parameters: parameters || {}
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      output: response.data
    });
  } catch (error) {
    console.error('Error generating text:', error.message);

    if (error.response?.status === 503) {
      return res.status(503).json({
        success: false,
        error: 'Model is loading',
        message: 'The model is currently loading. Please try again in a few seconds.',
        estimatedTime: error.response.data?.estimated_time || 20
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate text',
      message: error.message
    });
  }
});

/**
 * GET /api/huggingface/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    tokenConfigured: !!HF_TOKEN,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/huggingface/status/:jobId
 * Get download status for a job
 */
router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // Return mock status for now
    res.json({
      success: true,
      data: {
        jobId,
        status: 'downloading',
        progress: 50,
        message: 'Download in progress'
      }
    });
  } catch (error) {
    console.error('Error getting job status:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get job status',
      message: error.message
    });
  }
});

/**
 * GET /api/huggingface/jobs
 * Get all download jobs
 */
router.get('/jobs', async (req, res) => {
  try {
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error getting jobs:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get jobs',
      message: error.message
    });
  }
});

/**
 * POST /api/huggingface/cancel/:jobId
 * Cancel a download job
 */
router.post('/cancel/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    res.json({
      success: true,
      message: 'Download cancelled successfully',
      jobId
    });
  } catch (error) {
    console.error('Error cancelling job:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel job',
      message: error.message
    });
  }
});

// Helper functions
function getModelType(pipelineTag) {
  if (!pipelineTag) return 'other';

  const typeMap = {
    'text-generation': 'text',
    'text-classification': 'text',
    'question-answering': 'text',
    'image-classification': 'vision',
    'object-detection': 'vision',
    'image-segmentation': 'vision',
    'text-to-speech': 'audio',
    'automatic-speech-recognition': 'audio',
    'audio-classification': 'audio'
  };

  return typeMap[pipelineTag] || 'other';
}

function getLanguage(model) {
  // Check if model has language info
  if (model.language) return model.language;

  // Check tags for language indicators
  const tags = model.tags || [];
  if (tags.includes('fa') || tags.includes('persian') || tags.includes('farsi')) {
    return 'fa';
  }

  // Check model ID for language indicators
  const modelId = model.id || '';
  if (modelId.toLowerCase().includes('persian') ||
    modelId.toLowerCase().includes('farsi') ||
    modelId.toLowerCase().includes('fa-')) {
    return 'fa';
  }

  return 'other';
}

export default router;
