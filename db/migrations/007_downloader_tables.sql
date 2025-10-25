-- Migration 007: Add downloader tables for datasets, models, and TTS

-- Create tts_models table for TTS models
CREATE TABLE IF NOT EXISTS tts_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'voice',
  language TEXT DEFAULT 'fa',
  file_path TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  status TEXT DEFAULT 'downloading',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add download tracking to existing models table
ALTER TABLE models ADD COLUMN file_size INTEGER DEFAULT 0;
ALTER TABLE models ADD COLUMN download_url TEXT;
ALTER TABLE models ADD COLUMN download_status TEXT DEFAULT 'ready';

-- Add download tracking to existing assets table  
ALTER TABLE assets ADD COLUMN download_url TEXT;
ALTER TABLE assets ADD COLUMN download_status TEXT DEFAULT 'ready';

-- Create download_queue table for tracking downloads
CREATE TABLE IF NOT EXISTS download_queue (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'dataset', 'model', 'tts'
  source TEXT NOT NULL, -- source identifier
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'downloading', 'completed', 'failed'
  progress REAL DEFAULT 0,
  file_path TEXT,
  file_size INTEGER DEFAULT 0,
  error_message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tts_models_status ON tts_models(status);
CREATE INDEX IF NOT EXISTS idx_tts_models_language ON tts_models(language);
CREATE INDEX IF NOT EXISTS idx_tts_models_created_at ON tts_models(created_at);
CREATE INDEX IF NOT EXISTS idx_download_queue_type ON download_queue(type);
CREATE INDEX IF NOT EXISTS idx_download_queue_status ON download_queue(status);
CREATE INDEX IF NOT EXISTS idx_download_queue_created_at ON download_queue(created_at);
