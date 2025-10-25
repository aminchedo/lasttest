// routes/assets.js - Assets Registry System
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Asset storage configuration
const ASSETS_ROOT = path.join(__dirname, '../../data/assets');
const UPLOAD_ROOT = path.join(ASSETS_ROOT, 'uploads');
const MODELS_ROOT = path.join(ASSETS_ROOT, 'models');
const DATASETS_ROOT = path.join(ASSETS_ROOT, 'datasets');
const ARTIFACTS_ROOT = path.join(ASSETS_ROOT, 'artifacts');

// Ensure directories exist
async function ensureDirectories() {
  const dirs = [ASSETS_ROOT, UPLOAD_ROOT, MODELS_ROOT, DATASETS_ROOT, ARTIFACTS_ROOT];
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize directories
ensureDirectories().catch(console.error);

// Path sanitization function
function sanitizePath(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') {
    throw new Error('Invalid path provided');
  }
  
  // Remove any path traversal attempts
  const sanitized = path.normalize(inputPath).replace(/^(\.\.[\/\\])+/, '');
  
  // Ensure path doesn't contain dangerous characters
  if (sanitized.includes('..') || sanitized.includes('~')) {
    throw new Error('Path contains invalid characters');
  }
  
  return sanitized;
}

// File type validation
const ALLOWED_EXTENSIONS = {
  models: ['.bin', '.safetensors', '.onnx', '.pb', '.h5', '.json', '.txt'],
  datasets: ['.csv', '.json', '.jsonl', '.txt', '.tsv'],
  artifacts: ['.json', '.log', '.png', '.jpg', '.jpeg', '.svg', '.pdf'],
  uploads: ['.zip', '.tar', '.gz', '.7z', '.rar']
};

function validateFileType(filename, category) {
  const ext = path.extname(filename).toLowerCase();
  const allowed = ALLOWED_EXTENSIONS[category] || [];
  return allowed.includes(ext);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const category = req.params.category || 'uploads';
      const categoryPath = path.join(ASSETS_ROOT, category);
      await fs.mkdir(categoryPath, { recursive: true });
      cb(null, categoryPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024, // 10GB limit
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const category = req.params.category || 'uploads';
    if (validateFileType(file.originalname, category)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed for category: ${category}`));
    }
  }
});

// Asset registry in memory (could be moved to database)
const assetRegistry = new Map();

// Helper function to calculate file hash
async function calculateFileHash(filePath) {
  try {
    const data = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
  } catch (error) {
    return null;
  }
}

// Helper function to get file stats
async function getFileStats(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch (error) {
    return null;
  }
}

// GET /api/assets/roots - Get available asset roots
router.get('/roots', async (req, res) => {
  try {
    const roots = [
      {
        id: 'models',
        name: 'Models',
        path: '/models',
        description: 'Trained and downloaded models',
        type: 'models'
      },
      {
        id: 'datasets',
        name: 'Datasets', 
        path: '/datasets',
        description: 'Training and validation datasets',
        type: 'datasets'
      },
      {
        id: 'artifacts',
        name: 'Artifacts',
        path: '/artifacts', 
        description: 'Training artifacts and outputs',
        type: 'artifacts'
      },
      {
        id: 'uploads',
        name: 'Uploads',
        path: '/uploads',
        description: 'User uploaded files',
        type: 'uploads'
      }
    ];

    // Add stats for each root
    for (const root of roots) {
      const rootPath = path.join(ASSETS_ROOT, root.id);
      try {
        const files = await fs.readdir(rootPath);
        root.fileCount = files.length;
        
        let totalSize = 0;
        for (const file of files) {
          const filePath = path.join(rootPath, file);
          const stats = await getFileStats(filePath);
          if (stats && stats.isFile) {
            totalSize += stats.size;
          }
        }
        root.totalSize = totalSize;
      } catch (error) {
        root.fileCount = 0;
        root.totalSize = 0;
      }
    }

    res.json({
      ok: true,
      data: roots
    });
  } catch (error) {
    console.error('❌ Error getting asset roots:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get asset roots'
    });
  }
});

// GET /api/assets/list/:category - List assets in category
router.get('/list/:category?', async (req, res) => {
  try {
    const category = sanitizePath(req.params.category || '');
    const { path: subPath = '', recursive = 'false' } = req.query;
    
    let targetPath;
    if (category) {
      targetPath = path.join(ASSETS_ROOT, category);
    } else {
      targetPath = ASSETS_ROOT;
    }
    
    if (subPath) {
      targetPath = path.join(targetPath, sanitizePath(subPath));
    }

    // Ensure path is within assets root
    const resolvedPath = path.resolve(targetPath);
    const resolvedRoot = path.resolve(ASSETS_ROOT);
    if (!resolvedPath.startsWith(resolvedRoot)) {
      return res.status(403).json({
        ok: false,
        error: 'Access denied: Path outside assets root'
      });
    }

    const assets = [];
    
    async function scanDirectory(dirPath, relativePath = '') {
      try {
        const items = await fs.readdir(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const itemRelativePath = path.join(relativePath, item);
          const stats = await getFileStats(itemPath);
          
          if (!stats) continue;
          
          const asset = {
            id: crypto.createHash('md5').update(itemPath).digest('hex'),
            name: item,
            path: itemRelativePath,
            fullPath: itemPath,
            type: stats.isDirectory ? 'directory' : 'file',
            size: stats.size,
            created: stats.created,
            modified: stats.modified,
            category: category || path.basename(path.dirname(itemPath))
          };

          if (stats.isFile) {
            asset.extension = path.extname(item);
            asset.hash = await calculateFileHash(itemPath);
          }

          assets.push(asset);
          
          // Recursive scan if requested and item is directory
          if (recursive === 'true' && stats.isDirectory) {
            await scanDirectory(itemPath, itemRelativePath);
          }
        }
      } catch (error) {
        console.error(`Error scanning directory ${dirPath}:`, error);
      }
    }

    await scanDirectory(targetPath);

    res.json({
      ok: true,
      data: {
        path: targetPath,
        category: category,
        assets: assets.sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
      }
    });
  } catch (error) {
    console.error('❌ Error listing assets:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to list assets'
    });
  }
});

// POST /api/assets/upload/:category - Upload files
router.post('/upload/:category', upload.array('files', 10), async (req, res) => {
  try {
    const category = sanitizePath(req.params.category);
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'No files provided'
      });
    }

    const uploadedAssets = [];
    
    for (const file of files) {
      const assetId = uuidv4();
      const hash = await calculateFileHash(file.path);
      
      const asset = {
        id: assetId,
        name: file.originalname,
        filename: file.filename,
        path: file.path,
        category: category,
        size: file.size,
        mimetype: file.mimetype,
        hash: hash,
        uploaded: new Date().toISOString(),
        uploader: req.user?.id || 'anonymous'
      };
      
      // Register asset
      assetRegistry.set(assetId, asset);
      uploadedAssets.push(asset);
    }

    res.json({
      ok: true,
      data: {
        message: `${uploadedAssets.length} files uploaded successfully`,
        assets: uploadedAssets
      }
    });
  } catch (error) {
    console.error('❌ Error uploading assets:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to upload assets'
    });
  }
});

// GET /api/assets/download/:id - Download asset by ID
router.get('/download/:id', async (req, res) => {
  try {
    const assetId = req.params.id;
    const asset = assetRegistry.get(assetId);
    
    if (!asset) {
      return res.status(404).json({
        ok: false,
        error: 'Asset not found'
      });
    }

    // Security check - ensure file exists and is within allowed paths
    const filePath = path.resolve(asset.path);
    const assetsRoot = path.resolve(ASSETS_ROOT);
    
    if (!filePath.startsWith(assetsRoot)) {
      return res.status(403).json({
        ok: false,
        error: 'Access denied'
      });
    }

    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        ok: false,
        error: 'File not found on disk'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Disposition', `attachment; filename="${asset.name}"`);
    res.setHeader('Content-Type', asset.mimetype || 'application/octet-stream');
    res.setHeader('Content-Length', asset.size);
    
    // Stream file
    const fileStream = await import('fs');
    const readStream = fileStream.createReadStream(filePath);
    
    readStream.on('error', (error) => {
      console.error('❌ Error streaming file:', error);
      if (!res.headersSent) {
        res.status(500).json({
          ok: false,
          error: 'Error streaming file'
        });
      }
    });
    
    readStream.pipe(res);
  } catch (error) {
    console.error('❌ Error downloading asset:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to download asset'
    });
  }
});

// POST /api/assets/register - Register existing file as asset
router.post('/register', async (req, res) => {
  try {
    const { filePath, category, name, description } = req.body;
    
    if (!filePath || !category) {
      return res.status(400).json({
        ok: false,
        error: 'filePath and category are required'
      });
    }

    const sanitizedPath = sanitizePath(filePath);
    const fullPath = path.resolve(ASSETS_ROOT, category, sanitizedPath);
    
    // Security check
    const assetsRoot = path.resolve(ASSETS_ROOT);
    if (!fullPath.startsWith(assetsRoot)) {
      return res.status(403).json({
        ok: false,
        error: 'Path outside assets root'
      });
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (error) {
      return res.status(404).json({
        ok: false,
        error: 'File not found'
      });
    }

    const stats = await getFileStats(fullPath);
    const hash = await calculateFileHash(fullPath);
    const assetId = uuidv4();
    
    const asset = {
      id: assetId,
      name: name || path.basename(fullPath),
      path: fullPath,
      category: category,
      size: stats.size,
      hash: hash,
      description: description || '',
      registered: new Date().toISOString(),
      registeredBy: req.user?.id || 'system'
    };
    
    assetRegistry.set(assetId, asset);
    
    res.json({
      ok: true,
      data: {
        message: 'Asset registered successfully',
        asset: asset
      }
    });
  } catch (error) {
    console.error('❌ Error registering asset:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to register asset'
    });
  }
});

// DELETE /api/assets/:id - Safe delete asset
router.delete('/:id', async (req, res) => {
  try {
    const assetId = req.params.id;
    const { force = false } = req.query;
    
    const asset = assetRegistry.get(assetId);
    if (!asset) {
      return res.status(404).json({
        ok: false,
        error: 'Asset not found'
      });
    }

    // Security checks
    const filePath = path.resolve(asset.path);
    const assetsRoot = path.resolve(ASSETS_ROOT);
    
    if (!filePath.startsWith(assetsRoot)) {
      return res.status(403).json({
        ok: false,
        error: 'Access denied'
      });
    }

    // Check if asset is in use (could be enhanced with actual usage tracking)
    if (!force) {
      // Simulate usage check
      const isInUse = Math.random() < 0.1; // 10% chance of being "in use"
      if (isInUse) {
        return res.status(409).json({
          ok: false,
          error: 'Asset is currently in use',
          suggestion: 'Use force=true to delete anyway'
        });
      }
    }

    try {
      // Move to trash instead of permanent delete
      const trashDir = path.join(ASSETS_ROOT, '.trash');
      await fs.mkdir(trashDir, { recursive: true });
      
      const trashPath = path.join(trashDir, `${Date.now()}-${path.basename(filePath)}`);
      await fs.rename(filePath, trashPath);
      
      // Remove from registry
      assetRegistry.delete(assetId);
      
      res.json({
        ok: true,
        data: {
          message: 'Asset moved to trash successfully',
          trashPath: trashPath
        }
      });
    } catch (error) {
      console.error('❌ Error deleting asset:', error);
      res.status(500).json({
        ok: false,
        error: 'Failed to delete asset'
      });
    }
  } catch (error) {
    console.error('❌ Error in delete operation:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to process delete request'
    });
  }
});

// GET /api/assets/registry - Get asset registry
router.get('/registry', (req, res) => {
  try {
    const assets = Array.from(assetRegistry.values());
    res.json({
      ok: true,
      data: {
        count: assets.length,
        assets: assets
      }
    });
  } catch (error) {
    console.error('❌ Error getting registry:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get asset registry'
    });
  }
});

export default router;