# Persian ML Real Backend System

A production-ready backend for Persian Machine Learning training and analysis with real data persistence.

## 🚀 Features

- **Real Database Persistence**: SQLite database with comprehensive ML schema
- **Actual ML Training**: Integration with TensorFlow/Keras for real model training
- **Persian Language Support**: Specialized for Persian NLP tasks
- **Real-time Monitoring**: Live training progress and system metrics
- **Production Ready**: Error handling, logging, and graceful shutdown

## 📊 Database Schema

### Core Tables
- **training_jobs**: Real ML training job tracking
- **models**: Model management and metadata
- **datasets**: Dataset information and paths
- **downloads**: Download progress and status
- **training_metrics**: Detailed ML metrics over time
- **system_metrics**: System performance monitoring
- **analysis_results**: Analysis and evaluation results

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- Python 3.8+
- SQLite3

### Quick Start

#### Windows:
```bash
# Run the setup script
start-real-backend.bat
```

#### Linux/Mac:
```bash
# Make executable and run
chmod +x start-real-backend.sh
./start-real-backend.sh
```

#### Manual Setup:
```bash
# Install Node.js dependencies
npm install

# Install Python ML dependencies
pip install -r requirements.txt

# Setup database
node setup-database.js

# Start server
node real-backend.js
```

## 🔧 API Endpoints

### Health & System
- `GET /api/health` - System health check
- `GET /api/system/status` - Real system monitoring

### Training Management
- `GET /api/training/jobs` - Get all training jobs
- `GET /api/training/status/:jobId` - Get specific job status
- `POST /api/training/start` - Start new training job
- `POST /api/training/stop/:jobId` - Stop training job

### Model Management
- `GET /api/models` - Get all models
- `POST /api/models` - Create new model

### Download Management
- `GET /api/downloader/status` - Get download status
- `POST /api/downloader/start` - Start download

### Analysis & Metrics
- `GET /api/analysis/metrics` - Get ML analysis metrics
- `GET /api/menu/counts` - Get menu badge counts

## 🤖 Real ML Training

### Supported Model Types
1. **Transformer Models**: BERT-style Persian text classification
2. **Generative Models**: GPT-2 style Persian text generation
3. **Translation Models**: Persian-English translation
4. **Sentiment Analysis**: Persian sentiment classification

### Training Process
1. **Data Loading**: Real Persian datasets from JSON files
2. **Preprocessing**: Persian text tokenization and encoding
3. **Model Creation**: TensorFlow/Keras model architecture
4. **Training Loop**: Real-time progress tracking
5. **Metrics Logging**: Detailed performance metrics
6. **Model Saving**: Checkpoint and final model persistence

### Example Training Job
```json
{
  "name": "آموزش مدل BERT فارسی",
  "modelType": "transformer",
  "datasetPath": "/datasets/persian-news.json",
  "epochs": 10,
  "learningRate": 0.001,
  "batchSize": 32
}
```

## 📈 Real Data Features

### Training Metrics
- Real-time loss and accuracy tracking
- Validation metrics
- Learning rate scheduling
- Epoch-by-epoch progress

### System Monitoring
- CPU, Memory, GPU usage
- Disk space monitoring
- Network performance
- Database statistics

### Model Performance
- Accuracy, Precision, Recall, F1-Score
- Training time analysis
- Model size and complexity
- Download and usage statistics

## 🔍 Database Sample Data

The system comes with realistic sample data:

### Datasets
- Persian News Dataset (50K samples)
- Persian Wikipedia (100K samples)  
- Translation Pairs (25K samples)
- Sentiment Analysis (15K samples)

### Models
- Persian BERT (450MB, 94% accuracy)
- Persian GPT-2 (550MB, 89% accuracy)
- Translation Model (380MB, 92% accuracy)
- Sentiment Model (120MB, 88% accuracy)

### Training Jobs
- Completed BERT training
- Running GPT-2 training
- Pending translation training
- Failed sentiment training

## 🐍 Python ML Integration

### Real Training Script
```bash
# Train a specific job
python ml-integration.py <job_id>
```

### Features
- Real TensorFlow/Keras models
- Persian text preprocessing
- Live progress updates
- Model checkpointing
- Performance analysis

## 📊 Monitoring & Analytics

### Real-time Metrics
- Training progress visualization
- System resource usage
- Model performance trends
- Download progress tracking

### Historical Data
- 24 hours of system metrics
- Training job history
- Model performance over time
- Download statistics

## 🔧 Configuration

### Environment Variables
```bash
PORT=3001                    # Server port
HOST=0.0.0.0                 # Server host
NODE_ENV=production          # Environment
```

### Database Configuration
- SQLite database: `ml_system.db`
- Automatic table creation
- Sample data insertion
- Backup and recovery

## 🚀 Production Deployment

### Docker Support
```dockerfile
FROM node:16-alpine
COPY . /app
WORKDIR /app
RUN npm install
CMD ["node", "real-backend.js"]
```

### Performance Optimization
- Database indexing
- Connection pooling
- Caching strategies
- Resource monitoring

## 🔍 Troubleshooting

### Common Issues
1. **Database Connection**: Check SQLite file permissions
2. **Python Dependencies**: Ensure TensorFlow is installed
3. **Port Conflicts**: Change PORT environment variable
4. **Memory Issues**: Monitor system resources

### Logs
- Server logs: Console output
- Database logs: SQLite logs
- Training logs: Python ML logs
- Error logs: Detailed error messages

## 📚 API Documentation

### Request/Response Format
```json
{
  "ok": true,
  "data": { ... },
  "error": "Error message",
  "status": 200
```
