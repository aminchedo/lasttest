// setup-database.js - Initialize Real ML Database with Sample Data
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'ml_system.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Setting up real ML database...');

// Initialize database with comprehensive schema
function setupDatabase() {
    db.serialize(() => {
        console.log('📊 Creating database tables...');

        // Training Jobs Table
        db.run(`
      CREATE TABLE IF NOT EXISTS training_jobs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        model_type TEXT NOT NULL,
        dataset_path TEXT,
        base_model TEXT,
        status TEXT DEFAULT 'pending',
        progress REAL DEFAULT 0,
        current_epoch INTEGER DEFAULT 0,
        total_epochs INTEGER DEFAULT 10,
        accuracy REAL DEFAULT 0,
        loss REAL DEFAULT 0,
        learning_rate REAL DEFAULT 0.001,
        batch_size INTEGER DEFAULT 32,
        validation_split REAL DEFAULT 0.2,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        started_at DATETIME,
        completed_at DATETIME,
        error_message TEXT,
        config_json TEXT,
        metrics_json TEXT
      )
    `);

        // Models Table
        db.run(`
      CREATE TABLE IF NOT EXISTS models (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        version TEXT DEFAULT '1.0.0',
        size_mb REAL,
        accuracy REAL,
        precision_score REAL,
        recall_score REAL,
        f1_score REAL,
        status TEXT DEFAULT 'ready',
        file_path TEXT,
        config_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_used DATETIME,
        download_count INTEGER DEFAULT 0,
        training_job_id TEXT,
        FOREIGN KEY (training_job_id) REFERENCES training_jobs(id)
      )
    `);

        // Datasets Table
        db.run(`
      CREATE TABLE IF NOT EXISTS datasets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        language TEXT DEFAULT 'fa',
        size_mb REAL,
        samples_count INTEGER,
        file_path TEXT,
        status TEXT DEFAULT 'ready',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        description TEXT,
        tags TEXT,
        validation_split REAL DEFAULT 0.2
      )
    `);

        // Downloads Table
        db.run(`
      CREATE TABLE IF NOT EXISTS downloads (
        id TEXT PRIMARY KEY,
        file_name TEXT NOT NULL,
        url TEXT,
        type TEXT DEFAULT 'model',
        status TEXT DEFAULT 'pending',
        progress REAL DEFAULT 0,
        size_mb REAL,
        downloaded_mb REAL DEFAULT 0,
        speed TEXT,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        error_message TEXT,
        source TEXT DEFAULT 'huggingface'
      )
    `);

        // Training Metrics Table
        db.run(`
      CREATE TABLE IF NOT EXISTS training_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id TEXT NOT NULL,
        epoch INTEGER,
        step INTEGER,
        training_loss REAL,
        validation_loss REAL,
        training_accuracy REAL,
        validation_accuracy REAL,
        learning_rate REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES training_jobs(id)
      )
    `);

        // System Metrics Table
        db.run(`
      CREATE TABLE IF NOT EXISTS system_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cpu_usage REAL,
        memory_usage REAL,
        gpu_usage REAL,
        disk_usage REAL,
        network_usage REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Analysis Results Table
        db.run(`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id TEXT PRIMARY KEY,
        model_id TEXT,
        dataset_id TEXT,
        analysis_type TEXT,
        results_json TEXT,
        accuracy REAL,
        precision REAL,
        recall REAL,
        f1_score REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (model_id) REFERENCES models(id),
        FOREIGN KEY (dataset_id) REFERENCES datasets(id)
      )
    `);

        console.log('✅ Database tables created successfully');

        // Insert real sample data
        insertSampleData();
    });
}

function insertSampleData() {
    console.log('📝 Inserting sample data...');

    // Sample datasets
    const datasets = [
        {
            id: 'dataset-1',
            name: 'مجموعه داده اخبار فارسی',
            type: 'text',
            language: 'fa',
            size_mb: 125.3,
            samples_count: 50000,
            file_path: '/datasets/persian-news.json',
            description: 'مجموعه داده اخبار فارسی برای آموزش مدل‌های NLP',
            tags: 'news,persian,nlp,text'
        },
        {
            id: 'dataset-2',
            name: 'مجموعه داده ویکی‌پدیا فارسی',
            type: 'text',
            language: 'fa',
            size_mb: 250.8,
            samples_count: 100000,
            file_path: '/datasets/persian-wikipedia.json',
            description: 'نمونه‌ای از مقالات ویکی‌پدیا فارسی',
            tags: 'wikipedia,persian,text,encyclopedia'
        },
        {
            id: 'dataset-3',
            name: 'مجموعه داده ترجمه فارسی-انگلیسی',
            type: 'translation',
            language: 'fa',
            size_mb: 180.5,
            samples_count: 25000,
            file_path: '/datasets/translation-pairs.json',
            description: 'جفت‌های ترجمه فارسی-انگلیسی',
            tags: 'translation,persian,english,parallel'
        },
        {
            id: 'dataset-4',
            name: 'مجموعه داده احساسات فارسی',
            type: 'sentiment',
            language: 'fa',
            size_mb: 45.2,
            samples_count: 15000,
            file_path: '/datasets/persian-sentiment.json',
            description: 'داده‌های برچسب‌گذاری احساسات برای متن فارسی',
            tags: 'sentiment,persian,emotion,classification'
        }
    ];

    // Sample models
    const models = [
        {
            id: 'model-1',
            name: 'مدل پردازش متن فارسی BERT',
            type: 'transformer',
            version: '1.0.0',
            size_mb: 450.5,
            accuracy: 0.94,
            precision_score: 0.92,
            recall_score: 0.95,
            f1_score: 0.93,
            status: 'ready',
            file_path: '/models/persian-bert.bin',
            download_count: 150
        },
        {
            id: 'model-2',
            name: 'مدل تولید متن GPT-2 فارسی',
            type: 'generative',
            version: '1.2.0',
            size_mb: 550.2,
            accuracy: 0.89,
            precision_score: 0.87,
            recall_score: 0.91,
            f1_score: 0.89,
            status: 'ready',
            file_path: '/models/persian-gpt2.bin',
            download_count: 89
        },
        {
            id: 'model-3',
            name: 'مدل ترجمه فارسی-انگلیسی',
            type: 'translation',
            version: '1.1.0',
            size_mb: 380.7,
            accuracy: 0.92,
            precision_score: 0.90,
            recall_score: 0.94,
            f1_score: 0.92,
            status: 'ready',
            file_path: '/models/persian-translator.bin',
            download_count: 67
        },
        {
            id: 'model-4',
            name: 'مدل تحلیل احساسات فارسی',
            type: 'sentiment',
            version: '1.0.0',
            size_mb: 120.3,
            accuracy: 0.88,
            precision_score: 0.86,
            recall_score: 0.90,
            f1_score: 0.88,
            status: 'ready',
            file_path: '/models/persian-sentiment.bin',
            download_count: 45
        }
    ];

    // Sample training jobs
    const trainingJobs = [
        {
            id: 'job-1',
            name: 'آموزش مدل BERT فارسی',
            model_type: 'transformer',
            dataset_path: '/datasets/persian-news.json',
            status: 'completed',
            progress: 100,
            current_epoch: 10,
            total_epochs: 10,
            accuracy: 0.94,
            loss: 0.12,
            learning_rate: 0.001,
            batch_size: 32,
            started_at: new Date(Date.now() - 86400000).toISOString(),
            completed_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 'job-2',
            name: 'آموزش مدل GPT-2 فارسی',
            model_type: 'generative',
            dataset_path: '/datasets/persian-wikipedia.json',
            status: 'running',
            progress: 65,
            current_epoch: 7,
            total_epochs: 10,
            accuracy: 0.89,
            loss: 0.18,
            learning_rate: 0.0005,
            batch_size: 16,
            started_at: new Date(Date.now() - 7200000).toISOString()
        },
        {
            id: 'job-3',
            name: 'آموزش مدل ترجمه',
            model_type: 'translation',
            dataset_path: '/datasets/translation-pairs.json',
            status: 'pending',
            progress: 0,
            current_epoch: 0,
            total_epochs: 15,
            accuracy: 0,
            loss: 0,
            learning_rate: 0.001,
            batch_size: 32
        },
        {
            id: 'job-4',
            name: 'آموزش مدل تحلیل احساسات',
            model_type: 'sentiment',
            dataset_path: '/datasets/persian-sentiment.json',
            status: 'failed',
            progress: 45,
            current_epoch: 5,
            total_epochs: 10,
            accuracy: 0.75,
            loss: 0.35,
            learning_rate: 0.001,
            batch_size: 64,
            error_message: 'Out of memory during training'
        }
    ];

    // Insert datasets
    datasets.forEach(dataset => {
        db.run(`
      INSERT OR IGNORE INTO datasets (
        id, name, type, language, size_mb, samples_count, 
        file_path, description, tags
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            dataset.id, dataset.name, dataset.type, dataset.language,
            dataset.size_mb, dataset.samples_count, dataset.file_path,
            dataset.description, dataset.tags
        ]);
    });

    // Insert models
    models.forEach(model => {
        db.run(`
      INSERT OR IGNORE INTO models (
        id, name, type, version, size_mb, accuracy, precision_score,
        recall_score, f1_score, status, file_path, download_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            model.id, model.name, model.type, model.version, model.size_mb,
            model.accuracy, model.precision_score, model.recall_score,
            model.f1_score, model.status, model.file_path, model.download_count
        ]);
    });

    // Insert training jobs
    trainingJobs.forEach(job => {
        db.run(`
      INSERT OR IGNORE INTO training_jobs (
        id, name, model_type, dataset_path, status, progress,
        current_epoch, total_epochs, accuracy, loss, learning_rate,
        batch_size, started_at, completed_at, error_message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            job.id, job.name, job.model_type, job.dataset_path, job.status,
            job.progress, job.current_epoch, job.total_epochs, job.accuracy,
            job.loss, job.learning_rate, job.batch_size, job.started_at,
            job.completed_at, job.error_message
        ]);
    });

    // Insert sample training metrics for completed job
    const metrics = [];
    for (let epoch = 1; epoch <= 10; epoch++) {
        const accuracy = 0.5 + (epoch / 10) * 0.44 + Math.random() * 0.02;
        const loss = 1.0 - (epoch / 10) * 0.88 + Math.random() * 0.05;
        const valAccuracy = accuracy - Math.random() * 0.03;
        const valLoss = loss + Math.random() * 0.05;

        metrics.push({
            job_id: 'job-1',
            epoch: epoch,
            training_loss: loss,
            validation_loss: valLoss,
            training_accuracy: accuracy,
            validation_accuracy: valAccuracy,
            learning_rate: 0.001
        });
    }

    metrics.forEach(metric => {
        db.run(`
      INSERT OR IGNORE INTO training_metrics (
        job_id, epoch, training_loss, validation_loss,
        training_accuracy, validation_accuracy, learning_rate
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
            metric.job_id, metric.epoch, metric.training_loss,
            metric.validation_loss, metric.training_accuracy,
            metric.validation_accuracy, metric.learning_rate
        ]);
    });

    // Insert sample downloads
    const downloads = [
        {
            id: 'dl-1',
            file_name: 'persian-bert-base.bin',
            url: 'https://huggingface.co/HooshvareLab/bert-fa-base-uncased',
            type: 'model',
            status: 'completed',
            progress: 100,
            size_mb: 450.5,
            downloaded_mb: 450.5,
            speed: '3.2 MB/s',
            started_at: new Date(Date.now() - 3600000).toISOString(),
            completed_at: new Date(Date.now() - 1800000).toISOString(),
            source: 'huggingface'
        },
        {
            id: 'dl-2',
            file_name: 'persian-gpt2.bin',
            url: 'https://huggingface.co/HooshvareLab/gpt2-fa',
            type: 'model',
            status: 'downloading',
            progress: 75,
            size_mb: 550.2,
            downloaded_mb: 412.7,
            speed: '2.8 MB/s',
            started_at: new Date(Date.now() - 1800000).toISOString(),
            source: 'huggingface'
        }
    ];

    downloads.forEach(download => {
        db.run(`
      INSERT OR IGNORE INTO downloads (
        id, file_name, url, type, status, progress, size_mb,
        downloaded_mb, speed, started_at, completed_at, source
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            download.id, download.file_name, download.url, download.type,
            download.status, download.progress, download.size_mb,
            download.downloaded_mb, download.speed, download.started_at,
            download.completed_at, download.source
        ]);
    });

    // Insert sample system metrics
    for (let i = 0; i < 24; i++) {
        const timestamp = new Date(Date.now() - (i * 3600000)).toISOString();
        const cpuUsage = 20 + Math.random() * 30;
        const memoryUsage = 30 + Math.random() * 40;
        const gpuUsage = 15 + Math.random() * 25;
        const diskUsage = 10 + Math.random() * 20;
        const networkUsage = 5 + Math.random() * 15;

        db.run(`
      INSERT OR IGNORE INTO system_metrics (
        cpu_usage, memory_usage, gpu_usage, disk_usage, network_usage, timestamp
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `, [cpuUsage, memoryUsage, gpuUsage, diskUsage, networkUsage, timestamp]);
    }

    console.log('✅ Sample data inserted successfully');
    console.log(`📊 Database ready with:`);
    console.log(`   - ${datasets.length} datasets`);
    console.log(`   - ${models.length} models`);
    console.log(`   - ${trainingJobs.length} training jobs`);
    console.log(`   - ${downloads.length} downloads`);
    console.log(`   - 24 hours of system metrics`);
    console.log(`   - ${metrics.length} training metrics`);
}

// Run setup
setupDatabase();

// Close database connection
db.close((err) => {
    if (err) {
        console.error('❌ Error closing database:', err);
    } else {
        console.log('✅ Database setup completed successfully!');
        console.log('🚀 You can now start the backend server with: npm start');
    }
});
