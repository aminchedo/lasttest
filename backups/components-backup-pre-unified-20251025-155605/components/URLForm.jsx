import React from 'react';
import { Download } from 'lucide-react';
const URLForm = ({
  url,
  setUrl,
  targetDir,
  setTargetDir,
  onSubmit,
  urlPlaceholder = 'https://...',
  dirPlaceholder = '/models',
  submitLabel = 'دانلود',
  className = ''
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit({ url, targetDir });
    }
  };

  return (
    <form className={`harmony-url-form ${className}`} onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="url-input">آدرس URL:</label>
          <input
            id="url-input"
            type="text"
            value={url}
            onChange={(event) => setUrl && setUrl(event.target.value)}
            placeholder={urlPlaceholder}
            required
            dir="ltr"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dir-input">مسیر ذخیره:</label>
          <input
            id="dir-input"
            type="text"
            value={targetDir}
            onChange={(event) => setTargetDir && setTargetDir(event.target.value)}
            placeholder={dirPlaceholder}
            required
          />
        </div>
      </div>
      <button type="submit" className="harmony-btn harmony-btn-primary">
        <Download size={16} />
        {submitLabel}
      </button>
    </form>
  );
};

export default URLForm;
