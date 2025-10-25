-- Migration 006: Add real training support with logs and jobs tables

-- Create jobs table for tracking training jobs
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  base_model TEXT NOT NULL,
  dataset_path TEXT NOT NULL,
  params TEXT,
  output_dir TEXT,
  progress REAL DEFAULT 0,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create logs table for training logs
CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  level TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add training-related columns to existing training_sessions table
ALTER TABLE training_sessions ADD COLUMN run_id TEXT;
ALTER TABLE training_sessions ADD COLUMN base_model TEXT;
ALTER TABLE training_sessions ADD COLUMN dataset_path TEXT;
ALTER TABLE training_sessions ADD COLUMN output_dir TEXT;
ALTER TABLE training_sessions ADD COLUMN message TEXT;
ALTER TABLE training_sessions ADD COLUMN completed_at DATETIME;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_run_id ON logs(run_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON logs(level);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
