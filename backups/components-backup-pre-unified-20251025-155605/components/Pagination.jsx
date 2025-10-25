import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    totalItems,
    className = ''
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`harmony-pagination ${className}`}>
            <div className="harmony-pagination-info">
                <span>
                    نمایش {startIndex} تا {endIndex} از {totalItems} مدل
                </span>
            </div>

            <div className="harmony-pagination-controls">
                <button
                    className="harmony-pagination-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronRight size={16} />
                    قبلی
                </button>

                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        className={`harmony-pagination-btn ${page === currentPage ? 'active' : ''}`}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                    >
                        {page}
                    </button>
                ))}

                <button
                    className="harmony-pagination-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    بعدی
                    <ChevronLeft size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
