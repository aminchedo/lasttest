import React from 'react';
const FilterBar = ({ filters, activeFilter, onFilterChange, className = '' }) => (
  <div className={`harmony-filter-bar ${className}`}>
    {filters.map((filter) => {
      const isActive = activeFilter === filter.id;
      return (
        <button
          key={filter.id}
          className={`harmony-filter-btn ${isActive ? 'active' : ''}`}
          onClick={() => onFilterChange && onFilterChange(filter.id)}
          type="button"
          aria-pressed={isActive}
        >
          {filter.label}
        </button>
      );
    })}
  </div>
);

export default FilterBar;
