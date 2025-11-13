import React, { createElement } from "react";
export const Footer = ({
    
    totalRows,
    totalPages,
    hasPrevPage,
    hasNextPage,
    onPrevPage,
    onNextPage,
    onPageChange,
    nextIcon,
    prevIcon
}) => {
    return (
        <div className="st-footer">
            {/* Left side - Row info */}
            <div className="st-footer-info">
                <span className="st-footer-results-text">Total: {totalRows}</span>
            </div>

            {/* Right side - Page controls */}
            <div className="st-footer-pagination">
                <button onClick={onPrevPage}
                disabled={!hasPrevPage} className="st-next-prev-btn ">{prevIcon}</button>

                {/* Page numbers */}
                <div>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button  className="st-page-btn" key={page} onClick={() => onPageChange(page)}>
                            {page}
                        </button>
                    ))}
                </div>

                <button  onClick={onNextPage}
                disabled={!hasNextPage} className="st-next-prev-btn">{nextIcon}</button>
            </div>
        </div>
    );
};
