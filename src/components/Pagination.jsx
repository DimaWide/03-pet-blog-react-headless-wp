import React, { useRef } from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
    // Create a ref to the element that we want to scroll to after page change
    const blogListRef = useRef(null);

    // Function to smoothly scroll to the blog list when the page changes
    const scrollToBlogList = () => {
        if (blogListRef.current) {
            // Scroll to the blog list container with smooth scrolling
            blogListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Function to handle page click (either "Previous" or "Next")
    const handlePageClick = (newPage) => {
        handlePageChange(newPage); // Update the page number
        scrollToBlogList(); // Scroll to the blog list
    };

    return (
        <div className="cmp-5-pagination flex items-center space-x-4 py-4">
            {/* Previous Button */}
            <button
                onClick={() => handlePageClick(currentPage - 1)} // Go to the previous page
                disabled={currentPage === 1} // Disable if it's the first page
                className={`px-4 py-2 rounded-full 
          ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} 
          text-white transition duration-300`}
            >
                <span className="text-sm font-semibold">Previous</span>
            </button>

            {/* Page Information */}
            <span className="text-lg font-bold">
                {`Page ${currentPage} of ${totalPages}`} {/* Display current and total page */}
            </span>

            {/* Next Button */}
            <button
                onClick={() => handlePageClick(currentPage + 1)} // Go to the next page
                disabled={currentPage === totalPages} // Disable if it's the last page
                className={`px-4 py-2 rounded-full 
          ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} 
          text-white transition duration-300`}
            >
                <span className="text-sm font-semibold">Next</span>
            </button>

            {/* Hidden div for scrolling to blog list */}
            <div ref={blogListRef} className="hidden" />
        </div>
    );
};

export default Pagination;
