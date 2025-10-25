import React, { useState, useRef, useEffect } from 'react';
import { FolderOpen, Check, X, Loader, Brain, Database } from 'lucide-react';

function PathInput({
  value,
  onChange,
  placeholder,
  label,
  hint,
  required = false,
  onBrowse,
  validating = false,
  valid = null
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [detectedModels, setDetectedModels] = useState([]);
  const inputRef = useRef(null);

  // Enhanced model detection function
  const detectModelsInPath = (path) => {
    if (!path) return [];

    const modelExtensions = [
      '.pth', '.pt', '.pkl', '.pickle', '.h5', '.hdf5', '.pb', '.bin',
      '.safetensors', '.ckpt', '.weights', '.onnx', '.tflite', '.mlmodel',
      '.joblib', '.npy', '.npz'
    ];

    const datasetExtensions = [
      '.csv', '.json', '.jsonl', '.parquet', '.feather', '.arrow',
      '.tsv', '.txt', '.data', '.dat', '.db', '.sqlite'
    ];

    const detectedModels = [];
    const pathLower = path.toLowerCase();

    // Check for model files in path
    modelExtensions.forEach(ext => {
      if (pathLower.includes(ext)) {
        detectedModels.push({
          type: 'model',
          extension: ext,
          icon: '🤖',
          color: '#8b5cf6'
        });
      }
    });

    // Check for dataset files in path
    datasetExtensions.forEach(ext => {
      if (pathLower.includes(ext)) {
        detectedModels.push({
          type: 'dataset',
          extension: ext,
          icon: '📊',
          color: '#10b981'
        });
      }
    });

    return detectedModels;
  };

  // Update detected models when path changes
  useEffect(() => {
    if (value) {
      const models = detectModelsInPath(value);
      setDetectedModels(models);
    } else {
      setDetectedModels([]);
    }
  }, [value]);

  const handleBrowse = async () => {
    if (onBrowse) {
      try {
        const path = await onBrowse();
        if (path) {
          onChange(path);
        }
      } catch (error) {
        console.error('Error browsing for path:', error);
        // Fallback to file input
        fallbackBrowse();
      }
    } else {
      fallbackBrowse();
    }
  };

  const fallbackBrowse = () => {
    // Enhanced fallback with better error handling
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.directory = true;
    input.multiple = true;

    input.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        try {
          // Try to get directory path from first file
          const firstFile = e.target.files[0];
          let dirPath = '';

          if (firstFile.path) {
            // Windows/Electron path
            dirPath = firstFile.path.substring(0, firstFile.path.lastIndexOf('\\'));
          } else if (firstFile.webkitRelativePath) {
            // Web path
            const relativePath = firstFile.webkitRelativePath;
            const pathParts = relativePath.split('/');
            if (pathParts.length > 1) {
              dirPath = pathParts[0]; // Get directory name
            }
          }

          if (dirPath) {
            onChange(dirPath);
          } else {
            // If we can't determine directory, use file name
            onChange(firstFile.name);
          }
        } catch (error) {
          console.error('Error processing selected files:', error);
          // Use file name as fallback
          if (e.target.files[0]) {
            onChange(e.target.files[0].name);
          }
        }
      }
    };

    input.onerror = (error) => {
      console.error('File input error:', error);
    };

    input.click();
  };

  const getValidationIcon = () => {
    if (validating) {
      return <Loader className="validation-icon animate-spin" />;
    }
    if (valid === true) {
      return <Check className="validation-icon success" />;
    }
    if (valid === false) {
      return <X className="validation-icon error" />;
    }
    return null;
  };

  return (
    <div className={`path-input-container ${isFocused ? 'focused' : ''}`}>
      {label && (
        <label className="path-input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className="path-input-wrapper glass">
        <input
          ref={inputRef}
          type="text"
          className="path-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          required={required}
        />

        <div className="path-input-actions">
          {getValidationIcon()}

          <button
            type="button"
            className="browse-button glass-button"
            onClick={handleBrowse}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <FolderOpen className="browse-icon" />
            {showTooltip && (
              <div className="browse-tooltip animate-fadeInUp">
                انتخاب پوشه
              </div>
            )}
          </button>
        </div>
      </div>

      {hint && (
        <p className="path-input-hint animate-fadeInUp">
          {hint}
        </p>
      )}

      {/* Detected Models Display */}
      {detectedModels.length > 0 && (
        <div className="detected-models-container animate-fadeInUp">
          <div className="detected-models-header">
            <Brain className="detected-models-icon" />
            <span className="detected-models-title">
              مدل‌های شناسایی شده ({detectedModels.length})
            </span>
          </div>
          <div className="detected-models-list">
            {detectedModels.map((model, index) => (
              <div key={index} className="detected-model-item">
                <span className="detected-model-icon">{model.icon}</span>
                <span className="detected-model-type">{model.type}</span>
                <span className="detected-model-extension">{model.extension}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .path-input-container {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .path-input-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          transition: color 0.3s;
        }
        
        .required-asterisk {
          color: var(--danger);
          margin-right: 0.25rem;
        }
        
        .path-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .path-input-container.focused .path-input-wrapper {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }
        
        .path-input {
          flex: 1;
          padding: 0.875rem 1rem;
          background: transparent;
          border: none;
          font-size: 0.95rem;
          color: var(--text-primary);
          font-family: 'Courier New', monospace;
        }
        
        .path-input:focus {
          outline: none;
        }
        
        .path-input::placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
        
        .dark .path-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
        
        .path-input-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-left: 0.5rem;
        }
        
        .validation-icon {
          width: 20px;
          height: 20px;
          transition: all 0.3s;
        }
        
        .validation-icon.success {
          color: var(--success);
        }
        
        .validation-icon.error {
          color: var(--danger);
        }
        
        .browse-button {
          position: relative;
          padding: 0.625rem 1rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          border: none;
          border-radius: 0 10px 10px 0;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .browse-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
        }
        
        .browse-button:active {
          transform: scale(0.98);
        }
        
        .browse-icon {
          width: 20px;
          height: 20px;
          color: white;
        }
        
        .browse-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          padding: 0.5rem 0.75rem;
          background: rgba(0, 0, 0, 0.9);
          color: white;
          font-size: 0.75rem;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 1000;
        }
        
        .browse-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.9);
        }
        
        .path-input-hint {
          margin-top: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .detected-models-container {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(139, 92, 246, 0.05);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .detected-models-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: var(--primary);
        }
        
        .detected-models-icon {
          width: 16px;
          height: 16px;
          color: var(--primary);
        }
        
        .detected-models-title {
          font-size: 0.875rem;
        }
        
        .detected-models-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .detected-model-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 6px;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }
        
        .detected-model-item:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: var(--primary);
          transform: translateY(-1px);
        }
        
        .detected-model-icon {
          font-size: 1rem;
        }
        
        .detected-model-type {
          font-weight: 500;
          color: var(--text-primary);
          text-transform: capitalize;
        }
        
        .detected-model-extension {
          color: var(--text-secondary);
          font-family: 'Courier New', monospace;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}

export default PathInput;
