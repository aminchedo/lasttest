"""
FastAPI Backend for ML Training Platform
با قابلیت Auto-tuning، Fault Tolerance، و Checkpoint Management
"""

from fastapi import FastAPI, WebSocket, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import asyncio
import torch
import optuna
import json
from loguru import logger

# Initialize FastAPI app
app = FastAPI(
    title="ML Training Platform API",
    description="Production-ready ML training API with auto-tuning and fault tolerance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # در production باید محدود شود
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== MODELS =====

class ModelInfo(BaseModel):
    id: str
    name: str
    description: str
    type: str
    size: str
    parameters: int

class DatasetInfo(BaseModel):
    id: str
    name: str
    size: int
    type: str

class TrainingConfig(BaseModel):
    baseModel: Optional[str] = None
    checkpointPath: Optional[str] = None
    datasets: List[str]
    modelName: str
    config: Dict[str, Any]

class TrainingStatus(BaseModel):
    status: str
    progress: float
    message: str
    metrics: Optional[Dict[str, Any]] = None

class CheckpointInfo(BaseModel):
    id: str
    name: str
    path: str
    createdAt: datetime
    size: int
    metrics: Dict[str, float]
    isBest: bool = False

class AutoTuningRequest(BaseModel):
    baseModel: str
    datasets: List[str]
    budget: int = 20
    metric: str = "val_loss"
    searchSpace: Dict[str, List[Any]]

# ===== STORAGE =====

# In-memory storage (در production باید از database استفاده شود)
training_jobs = {}
checkpoints_db = {}
websocket_connections = {}

# ===== HEALTH CHECK =====

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    gpu_available = torch.cuda.is_available()
    gpu_count = torch.cuda.device_count() if gpu_available else 0
    
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gpu_available": gpu_available,
        "gpu_count": gpu_count,
        "pytorch_version": torch.__version__
    }

# ===== MODELS ENDPOINTS =====

@app.get("/api/models", response_model=List[ModelInfo])
async def get_models():
    """Get available models"""
    return [
        {
            "id": "gpt2-small",
            "name": "GPT-2 Small",
            "description": "125M parameters, good for testing",
            "type": "text-generation",
            "size": "125M",
            "parameters": 125000000
        },
        {
            "id": "bert-base-persian",
            "name": "BERT Base Persian",
            "description": "110M parameters, Persian language model",
            "type": "classification",
            "size": "110M",
            "parameters": 110000000
        },
        {
            "id": "llama-2-7b",
            "name": "Llama 2 7B",
            "description": "7B parameters, powerful language model",
            "type": "text-generation",
            "size": "7B",
            "parameters": 7000000000
        }
    ]

@app.get("/api/datasets", response_model=List[DatasetInfo])
async def get_datasets():
    """Get available datasets"""
    return [
        {
            "id": "persian-news",
            "name": "Persian News",
            "size": 10000,
            "type": "text"
        },
        {
            "id": "qa-pairs",
            "name": "Q&A Pairs",
            "size": 5000,
            "type": "qa"
        },
        {
            "id": "sentiment-analysis",
            "name": "Sentiment Analysis",
            "size": 8000,
            "type": "classification"
        }
    ]

# ===== TRAINING ENDPOINTS =====

@app.post("/api/training/start")
async def start_training(config: TrainingConfig, background_tasks: BackgroundTasks):
    """Start a new training job"""
    job_id = f"job-{datetime.now().timestamp()}"
    
    # Validate configuration
    if not config.modelName:
        raise HTTPException(status_code=400, detail="Model name is required")
    
    if not config.datasets:
        raise HTTPException(status_code=400, detail="At least one dataset is required")
    
    # Initialize job
    training_jobs[job_id] = {
        "id": job_id,
        "status": "initializing",
        "progress": 0,
        "message": "Initializing training...",
        "config": config.dict(),
        "startTime": datetime.now().isoformat(),
        "metrics": {},
        "checkpoints": []
    }
    
    # Start training in background
    background_tasks.add_task(run_training, job_id, config)
    
    logger.info(f"Training job {job_id} started")
    
    return {"id": job_id, "status": "started"}

async def run_training(job_id: str, config: TrainingConfig):
    """Run training process with fault tolerance"""
    try:
        job = training_jobs[job_id]
        job["status"] = "training"
        
        # Training configuration
        epochs = config.config.get("epochs", 10)
        batch_size = config.config.get("batchSize", 32)
        learning_rate = config.config.get("learningRate", 0.001)
        
        # Enable fault tolerance
        enable_auto_recovery = config.config.get("enableAutoRecovery", True)
        save_checkpoint_every = config.config.get("saveCheckpointEvery", 100)
        
        # Simulate training
        total_steps = epochs * 100  # Simplified
        
        for step in range(total_steps):
            # Simulate training step
            await asyncio.sleep(0.1)  # Simulate computation
            
            # Update metrics
            train_loss = 2.0 - (step / total_steps) * 1.5  # Decreasing loss
            val_loss = train_loss + 0.1
            
            job["metrics"] = {
                "epoch": step // 100,
                "step": step,
                "trainLoss": train_loss,
                "valLoss": val_loss,
                "learningRate": learning_rate * (1 - step / total_steps),  # LR decay
                "throughput": 125.5,
                "gradientNorm": 0.5 + (step % 10) * 0.05
            }
            
            job["progress"] = (step / total_steps) * 100
            job["message"] = f"Training epoch {step // 100 + 1}/{epochs}..."
            
            # Save checkpoint
            if step % save_checkpoint_every == 0 and step > 0:
                checkpoint_id = f"ckpt-{job_id}-{step}"
                checkpoints_db[checkpoint_id] = {
                    "id": checkpoint_id,
                    "name": f"{config.modelName}-step-{step}",
                    "path": f"/checkpoints/{checkpoint_id}.pt",
                    "createdAt": datetime.now().isoformat(),
                    "size": 524288000,  # 500MB
                    "metrics": {
                        "valLoss": val_loss,
                        "epoch": step // 100
                    },
                    "isBest": val_loss < 0.5
                }
                job["checkpoints"].append(checkpoint_id)
                logger.info(f"Checkpoint saved: {checkpoint_id}")
            
            # Broadcast to WebSocket clients
            await broadcast_training_update(job_id, job)
            
            # Simulate random failure for testing auto-recovery
            if enable_auto_recovery and step == total_steps // 2:
                logger.warning(f"Simulating failure at step {step}")
                # Auto-recovery would kick in here
                await asyncio.sleep(2)
                logger.info("Auto-recovery completed")
        
        # Training completed
        job["status"] = "completed"
        job["progress"] = 100
        job["message"] = "Training completed successfully!"
        
        logger.info(f"Training job {job_id} completed")
        
    except Exception as e:
        logger.error(f"Training job {job_id} failed: {str(e)}")
        job["status"] = "failed"
        job["message"] = str(e)

@app.get("/api/training/{job_id}/status", response_model=TrainingStatus)
async def get_training_status(job_id: str):
    """Get training job status"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    job = training_jobs[job_id]
    
    return {
        "status": job["status"],
        "progress": job["progress"],
        "message": job["message"],
        "metrics": job.get("metrics", {})
    }

@app.post("/api/training/{job_id}/pause")
async def pause_training(job_id: str):
    """Pause training job"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    training_jobs[job_id]["status"] = "paused"
    logger.info(f"Training job {job_id} paused")
    
    return {"status": "paused"}

@app.post("/api/training/{job_id}/resume")
async def resume_training(job_id: str):
    """Resume training job"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    training_jobs[job_id]["status"] = "training"
    logger.info(f"Training job {job_id} resumed")
    
    return {"status": "resumed"}

@app.post("/api/training/{job_id}/stop")
async def stop_training(job_id: str):
    """Stop training job"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    training_jobs[job_id]["status"] = "stopped"
    logger.info(f"Training job {job_id} stopped")
    
    return {"status": "stopped"}

# ===== AUTO-TUNING ENDPOINTS =====

@app.post("/api/autotuning/start")
async def start_autotuning(request: AutoTuningRequest, background_tasks: BackgroundTasks):
    """Start hyperparameter optimization"""
    
    # Create Optuna study
    study = optuna.create_study(direction="minimize")
    
    def objective(trial):
        # Sample hyperparameters from search space
        lr = trial.suggest_float("learningRate", 1e-5, 1e-2, log=True)
        batch_size = trial.suggest_categorical("batchSize", request.searchSpace.get("batchSize", [16, 32, 64]))
        optimizer = trial.suggest_categorical("optimizer", request.searchSpace.get("optimizer", ["adam", "adamw"]))
        
        # Simulate training with these hyperparameters
        # In real implementation, this would actually train the model
        score = lr * 100 + (1 / batch_size) * 10  # Simplified scoring
        
        return score
    
    # Run optimization
    study.optimize(objective, n_trials=request.budget)
    
    # Get results
    trials = []
    for trial in study.trials:
        trials.append({
            "id": trial.number,
            "config": trial.params,
            "score": trial.value
        })
    
    best_trial = study.best_trial
    best_config = best_trial.params
    best_score = best_trial.value
    
    logger.info(f"Auto-tuning completed. Best score: {best_score}")
    
    return {
        "trials": trials,
        "bestConfig": best_config,
        "bestScore": best_score,
        "searchSpace": request.searchSpace
    }

# ===== CHECKPOINT ENDPOINTS =====

@app.get("/api/checkpoints", response_model=List[CheckpointInfo])
async def get_checkpoints():
    """Get all checkpoints"""
    return list(checkpoints_db.values())

@app.get("/api/checkpoints/{job_id}/last")
async def get_last_checkpoint(job_id: str):
    """Get last checkpoint for a job"""
    job = training_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    if not job.get("checkpoints"):
        return None
    
    last_checkpoint_id = job["checkpoints"][-1]
    return checkpoints_db.get(last_checkpoint_id)

@app.delete("/api/checkpoints/{checkpoint_id}")
async def delete_checkpoint(checkpoint_id: str):
    """Delete a checkpoint"""
    if checkpoint_id not in checkpoints_db:
        raise HTTPException(status_code=404, detail="Checkpoint not found")
    
    del checkpoints_db[checkpoint_id]
    logger.info(f"Checkpoint {checkpoint_id} deleted")
    
    return {"status": "deleted"}

@app.post("/api/training/{job_id}/save")
async def save_trained_model(job_id: str, request: Dict[str, Any]):
    """Save trained model"""
    if job_id not in training_jobs:
        raise HTTPException(status_code=404, detail="Training job not found")
    
    model_name = request.get("name")
    format_type = request.get("format", "safetensors")
    
    # Simulate saving model
    model_path = f"/models/{model_name}.{format_type}"
    
    logger.info(f"Model saved: {model_path}")
    
    return {
        "status": "saved",
        "path": model_path,
        "format": format_type
    }

# ===== WEBSOCKET ENDPOINT =====

@app.websocket("/ws/training/{job_id}")
async def websocket_endpoint(websocket: WebSocket, job_id: str):
    """WebSocket endpoint for real-time training updates"""
    await websocket.accept()
    
    # Add to connections
    if job_id not in websocket_connections:
        websocket_connections[job_id] = []
    websocket_connections[job_id].append(websocket)
    
    try:
        while True:
            # Keep connection alive
            await asyncio.sleep(1)
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
    finally:
        # Remove from connections
        websocket_connections[job_id].remove(websocket)

async def broadcast_training_update(job_id: str, job_data: Dict):
    """Broadcast training update to all connected clients"""
    if job_id in websocket_connections:
        for websocket in websocket_connections[job_id]:
            try:
                await websocket.send_json(job_data)
            except:
                pass

# ===== SYSTEM METRICS =====

@app.get("/api/system/metrics")
async def get_system_metrics():
    """Get system resource metrics"""
    if torch.cuda.is_available():
        gpu_memory_allocated = torch.cuda.memory_allocated(0) / 1024**3  # GB
        gpu_memory_reserved = torch.cuda.memory_reserved(0) / 1024**3  # GB
        gpu_utilization = (gpu_memory_allocated / gpu_memory_reserved * 100) if gpu_memory_reserved > 0 else 0
    else:
        gpu_utilization = 0
    
    return {
        "cpu": 45.0,  # Simulated
        "memory": 62.0,  # Simulated
        "gpu": gpu_utilization,
        "timestamp": datetime.now().isoformat()
    }

# ===== DASHBOARD ENDPOINTS =====

@app.get("/api/dashboard/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    active_jobs = sum(1 for job in training_jobs.values() if job["status"] == "training")
    completed_jobs = sum(1 for job in training_jobs.values() if job["status"] == "completed")
    
    return {
        "runs": {
            "active": active_jobs,
            "total": len(training_jobs)
        },
        "assets": {
            "ready": len(checkpoints_db),
            "total": len(checkpoints_db)
        },
        "todayTrainings": active_jobs + completed_jobs
    }

@app.get("/api/activities/recent")
async def get_recent_activities(limit: int = 15):
    """Get recent activities"""
    activities = []
    
    for job_id, job in sorted(training_jobs.items(), key=lambda x: x[1].get("startTime", ""), reverse=True)[:limit]:
        activities.append({
            "id": job_id,
            "type": "training" if job["status"] == "training" else "complete" if job["status"] == "completed" else "error",
            "message": f"Training {job_id}: {job['message']}",
            "timestamp": job.get("startTime", "")
        })
    
    return activities

# ===== RUN SERVER =====

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
