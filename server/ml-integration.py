#!/usr/bin/env python3
"""
ml-integration.py - Real Machine Learning Integration for Persian ML System
This script provides real ML training capabilities using TensorFlow/Keras
"""

import os
import sys
import json
import sqlite3
import numpy as np
import pandas as pd
from datetime import datetime
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PersianMLTrainer:
    """Real ML trainer for Persian language models"""
    
    def __init__(self, db_path='ml_system.db'):
        self.db_path = db_path
        self.models = {}
        self.training_jobs = {}
        
    def connect_database(self):
        """Connect to SQLite database"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.cursor = self.conn.cursor()
            logger.info("✅ Connected to ML database")
            return True
        except Exception as e:
            logger.error(f"❌ Database connection error: {e}")
            return False
    
    def get_training_job(self, job_id):
        """Get training job details from database"""
        try:
            query = "SELECT * FROM training_jobs WHERE id = ?"
            self.cursor.execute(query, (job_id,))
            job = self.cursor.fetchone()
            
            if job:
                columns = [description[0] for description in self.cursor.description]
                return dict(zip(columns, job))
            return None
        except Exception as e:
            logger.error(f"❌ Error getting training job: {e}")
            return None
    
    def update_training_progress(self, job_id, epoch, loss, accuracy, val_loss=None, val_accuracy=None):
        """Update training progress in database"""
        try:
            progress = (epoch / 10) * 100  # Assuming 10 epochs total
            
            # Update training job
            update_query = """
                UPDATE training_jobs 
                SET current_epoch = ?, progress = ?, loss = ?, accuracy = ?
                WHERE id = ?
            """
            self.cursor.execute(update_query, (epoch, progress, loss, accuracy, job_id))
            
            # Insert metrics
            metrics_query = """
                INSERT INTO training_metrics (
                    job_id, epoch, training_loss, validation_loss,
                    training_accuracy, validation_accuracy
                )
                VALUES (?, ?, ?, ?, ?, ?)
            """
            self.cursor.execute(metrics_query, (
                job_id, epoch, loss, val_loss or loss,
                accuracy, val_accuracy or accuracy
            ))
            
            self.conn.commit()
            logger.info(f"📊 Updated progress for job {job_id}: Epoch {epoch}, Loss: {loss:.4f}, Accuracy: {accuracy:.4f}")
            
        except Exception as e:
            logger.error(f"❌ Error updating progress: {e}")
    
    def create_persian_text_classifier(self, vocab_size=10000, max_length=128, num_classes=5):
        """Create a real Persian text classification model"""
        model = keras.Sequential([
            layers.Embedding(vocab_size, 128, input_length=max_length),
            layers.LSTM(64, return_sequences=True),
            layers.LSTM(32),
            layers.Dropout(0.5),
            layers.Dense(64, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def create_persian_generator(self, vocab_size=10000, max_length=50):
        """Create a real Persian text generation model"""
        model = keras.Sequential([
            layers.Embedding(vocab_size, 256, input_length=max_length),
            layers.LSTM(512, return_sequences=True),
            layers.LSTM(256, return_sequences=True),
            layers.LSTM(128),
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.3),
            layers.Dense(vocab_size, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def create_translation_model(self, source_vocab_size=10000, target_vocab_size=10000, max_length=50):
        """Create a real Persian-English translation model"""
        # Encoder
        encoder_inputs = layers.Input(shape=(max_length,))
        encoder_embedding = layers.Embedding(source_vocab_size, 256)(encoder_inputs)
        encoder_lstm = layers.LSTM(256, return_state=True)
        encoder_outputs, state_h, state_c = encoder_lstm(encoder_embedding)
        encoder_states = [state_h, state_c]
        
        # Decoder
        decoder_inputs = layers.Input(shape=(max_length,))
        decoder_embedding = layers.Embedding(target_vocab_size, 256)(decoder_inputs)
        decoder_lstm = layers.LSTM(256, return_sequences=True, return_state=True)
        decoder_outputs, _, _ = decoder_lstm(decoder_embedding, initial_state=encoder_states)
        decoder_dense = layers.Dense(target_vocab_size, activation='softmax')
        decoder_outputs = decoder_dense(decoder_outputs)
        
        model = keras.Model([encoder_inputs, decoder_inputs], decoder_outputs)
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        
        return model
    
    def load_persian_dataset(self, dataset_path, dataset_type='text'):
        """Load Persian dataset for training"""
        try:
            if dataset_type == 'text':
                # Load Persian text data
                with open(dataset_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                texts = [item['text'] for item in data]
                labels = [item.get('label', 0) for item in data]
                
                return texts, labels
            
            elif dataset_type == 'translation':
                # Load translation pairs
                with open(dataset_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                source_texts = [item['persian'] for item in data]
                target_texts = [item['english'] for item in data]
                
                return source_texts, target_texts
            
            elif dataset_type == 'sentiment':
                # Load sentiment data
                with open(dataset_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                texts = [item['text'] for item in data]
                sentiments = [item['sentiment'] for item in data]
                
                return texts, sentiments
                
        except Exception as e:
            logger.error(f"❌ Error loading dataset: {e}")
            return None, None
    
    def preprocess_persian_text(self, texts, max_length=128):
        """Preprocess Persian text for training"""
        # Simple tokenization (in production, use proper Persian tokenizer)
        tokenizer = keras.preprocessing.text.Tokenizer(
            num_words=10000,
            filters='!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n',
            lower=True
        )
        
        tokenizer.fit_on_texts(texts)
        sequences = tokenizer.texts_to_sequences(texts)
        padded_sequences = keras.preprocessing.sequence.pad_sequences(
            sequences, maxlen=max_length, padding='post'
        )
        
        return padded_sequences, tokenizer
    
    def train_model(self, job_id, model_type, dataset_path, config):
        """Real ML training function"""
        try:
            logger.info(f"🚀 Starting real ML training for job {job_id}")
            
            # Get job details
            job = self.get_training_job(job_id)
            if not job:
                logger.error(f"❌ Job {job_id} not found")
                return False
            
            # Load dataset
            texts, labels = self.load_persian_dataset(dataset_path, job['model_type'])
            if texts is None:
                logger.error("❌ Failed to load dataset")
                return False
            
            # Preprocess data
            X, tokenizer = self.preprocess_persian_text(texts)
            
            if model_type == 'transformer':
                # Text classification
                y = keras.utils.to_categorical(labels, num_classes=5)
                model = self.create_persian_text_classifier()
                
            elif model_type == 'generative':
                # Text generation
                y = X[:, 1:]  # Shifted target
                X = X[:, :-1]  # Input
                model = self.create_persian_generator()
                
            elif model_type == 'translation':
                # Translation
                target_texts, _ = self.load_persian_dataset(dataset_path, 'translation')
                target_sequences, target_tokenizer = self.preprocess_persian_text(target_texts)
                model = self.create_translation_model()
            
            # Split data
            from sklearn.model_selection import train_test_split
            X_train, X_val, y_train, y_val = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Training loop
            epochs = int(job['total_epochs'])
            batch_size = int(job['batch_size'])
            
            for epoch in range(1, epochs + 1):
                logger.info(f"📊 Training epoch {epoch}/{epochs}")
                
                # Train model
                history = model.fit(
                    X_train, y_train,
                    batch_size=batch_size,
                    epochs=1,
                    validation_data=(X_val, y_val),
                    verbose=0
                )
                
                # Get metrics
                loss = history.history['loss'][0]
                accuracy = history.history['accuracy'][0]
                val_loss = history.history.get('val_loss', [loss])[0]
                val_accuracy = history.history.get('val_accuracy', [accuracy])[0]
                
                # Update database
                self.update_training_progress(
                    job_id, epoch, loss, accuracy, val_loss, val_accuracy
                )
                
                # Save model checkpoint
                if epoch % 5 == 0:
                    model_path = f"models/checkpoint_{job_id}_epoch_{epoch}.h5"
                    os.makedirs(os.path.dirname(model_path), exist_ok=True)
                    model.save(model_path)
                    logger.info(f"💾 Saved checkpoint: {model_path}")
            
            # Save final model
            final_model_path = f"models/final_{job_id}.h5"
            model.save(final_model_path)
            
            # Update job status
            self.cursor.execute(
                "UPDATE training_jobs SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?",
                (job_id,)
            )
            self.conn.commit()
            
            logger.info(f"✅ Training completed for job {job_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Training error: {e}")
            # Update job status to failed
            self.cursor.execute(
                "UPDATE training_jobs SET status = 'failed', error_message = ? WHERE id = ?",
                (str(e), job_id)
            )
            self.conn.commit()
            return False
    
    def predict_with_model(self, model_path, text):
        """Make predictions with trained model"""
        try:
            model = keras.models.load_model(model_path)
            # Preprocess text
            # Make prediction
            prediction = model.predict(text)
            return prediction
        except Exception as e:
            logger.error(f"❌ Prediction error: {e}")
            return None
    
    def analyze_model_performance(self, model_id):
        """Analyze model performance with real metrics"""
        try:
            # Get training metrics
            query = """
                SELECT * FROM training_metrics 
                WHERE job_id = (SELECT id FROM training_jobs WHERE training_job_id = ?)
                ORDER BY epoch ASC
            """
            self.cursor.execute(query, (model_id,))
            metrics = self.cursor.fetchall()
            
            if not metrics:
                return None
            
            # Calculate performance metrics
            final_accuracy = metrics[-1][5]  # training_accuracy
            final_loss = metrics[-1][3]  # training_loss
            
            # Calculate improvement
            initial_accuracy = metrics[0][5]
            improvement = final_accuracy - initial_accuracy
            
            # Calculate convergence
            last_5_epochs = metrics[-5:] if len(metrics) >= 5 else metrics
            accuracy_std = np.std([m[5] for m in last_5_epochs])
            
            performance = {
                'final_accuracy': final_accuracy,
                'final_loss': final_loss,
                'improvement': improvement,
                'convergence_stability': 1 / (accuracy_std + 1e-6),
                'total_epochs': len(metrics),
                'best_epoch': max(metrics, key=lambda x: x[5])[1]  # epoch with best accuracy
            }
            
            return performance
            
        except Exception as e:
            logger.error(f"❌ Analysis error: {e}")
            return None

def main():
    """Main function for ML training"""
    if len(sys.argv) < 2:
        print("Usage: python ml-integration.py <job_id>")
        sys.exit(1)
    
    job_id = sys.argv[1]
    
    # Initialize trainer
    trainer = PersianMLTrainer()
    
    if not trainer.connect_database():
        sys.exit(1)
    
    # Get job details
    job = trainer.get_training_job(job_id)
    if not job:
        print(f"❌ Job {job_id} not found")
        sys.exit(1)
    
    print(f"🚀 Starting real ML training for: {job['name']}")
    print(f"📊 Model type: {job['model_type']}")
    print(f"📁 Dataset: {job['dataset_path']}")
    print(f"⚙️  Epochs: {job['total_epochs']}")
    print(f"📦 Batch size: {job['batch_size']}")
    print(f"🎯 Learning rate: {job['learning_rate']}")
    
    # Start training
    success = trainer.train_model(
        job_id,
        job['model_type'],
        job['dataset_path'],
        json.loads(job.get('config_json', '{}'))
    )
    
    if success:
        print("✅ Training completed successfully!")
        
        # Analyze performance
        performance = trainer.analyze_model_performance(job_id)
        if performance:
            print(f"📈 Final accuracy: {performance['final_accuracy']:.4f}")
            print(f"📉 Final loss: {performance['final_loss']:.4f}")
            print(f"📊 Improvement: {performance['improvement']:.4f}")
            print(f"🎯 Best epoch: {performance['best_epoch']}")
    else:
        print("❌ Training failed!")
    
    trainer.conn.close()

if __name__ == "__main__":
    main()
