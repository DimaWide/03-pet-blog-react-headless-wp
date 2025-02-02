import React, { useRef } from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  // Создаём ref для элемента, к которому будем прокручивать
  const blogListRef = useRef(null);

  const scrollToBlogList = () => {
    if (blogListRef.current) {
      blogListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageClick = (newPage) => {
    handlePageChange(newPage);
    scrollToBlogList();
  };

  return (
    <div className="cmp-5-pagination flex items-center space-x-4 py-4">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-full 
          ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} 
          text-white transition duration-300`}
      >
        <span className="text-sm font-semibold">Previous</span>
      </button>

      <span className="text-lg font-bold">
        {`Page ${currentPage} of ${totalPages}`}
      </span>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-full 
          ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} 
          text-white transition duration-300`}
      >
        <span className="text-sm font-semibold">Next</span>
      </button>

      {/* Скрытый элемент для ссылки */}
      <div ref={blogListRef} className="hidden" />
    </div>
  );
};

export default Pagination;
