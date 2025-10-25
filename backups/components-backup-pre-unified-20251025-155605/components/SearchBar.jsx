import React from 'react';
import { Search, XCircle } from 'lucide-react';
const SearchBar = ({
  placeholder = 'جستجو...',
  value,
  onChange,
  onSearch,
  onClear,
  className = '',
  showClearButton = true,
  showButton = true,
  buttonLabel = 'جستجو'
}) => {
  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  };

  return (
    <div className={`harmony-search-section ${className}`}>
      <div className="harmony-search-box">
        <Search size={18} />
        <input
          type="text"
          className="harmony-search-input"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange && onChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {showClearButton && value && (
          <button onClick={handleClear} className="harmony-clear-search" type="button">
            <XCircle size={16} />
          </button>
        )}
      </div>
      {showButton && (
        <button className="harmony-search-button" type="button" onClick={handleSearch}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default SearchBar;
