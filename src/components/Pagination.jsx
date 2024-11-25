// src/components/Pagination.js

import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    return (
      <div className="cmp-5-pagination flex items-center space-x-4 py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-full 
            ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} 
            text-white transition duration-300 shadow-lg`}
        >
          <span className="text-sm font-semibold">Previous</span>
        </button>
  
        <span className="text-lg font-bold">
          {`Page ${currentPage} of ${totalPages}`}
        </span>
  
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-full 
            ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} 
            text-white transition duration-300 shadow-lg`}
        >
          <span className="text-sm font-semibold">Next</span>
        </button>
      </div>
    );
  };
  
  export default Pagination;
  