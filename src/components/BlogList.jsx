import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import BlogPost from './BlogPost';
import Pagination from './Pagination';

// Function to fetch posts from the API
const fetchPosts = async (page, selectedCategory, searchTerm, postsPerPage) => {
    let url = `http://dev.wp-blog/wp-json/wp/v2/posts?_embed&page=${page}&per_page=${postsPerPage}`;

    // If a category is selected, append it to the URL
    if (selectedCategory) {
        url += `&categories=${selectedCategory}`;
    }

    // If a search term is provided, append it to the URL
    if (searchTerm) {
        url += `&search=${searchTerm}`;
    }

    const response = await axios.get(url);

    // Error handling if the response or data is invalid
    if (!response || !response.data) {
        throw new Error('Error receiving data');
    }

    // Return the posts and the total pages count from the headers
    return {
        posts: response.data,
        totalPages: parseInt(response.headers['x-wp-totalpages']),
    };
};

// Main component for displaying the list of blog posts
const BlogList = ({ selectedCategory, searchTerm, page, setPage, setTotalPages, postsPerPage = 3 }) => {
    // Use React Query to fetch data from the API
    const { data, error, isLoading } = useQuery(
        ['posts', page, selectedCategory, searchTerm, postsPerPage],
        () => fetchPosts(page, selectedCategory, searchTerm, postsPerPage),
        {
            keepPreviousData: true, // Keep previous data while fetching new data
            onSuccess: (data) => {
                setTotalPages(data.totalPages); // Set the total pages in the parent component
            },
        }
    );

    // If there's an error, show the error message
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Get the posts and total pages from the data
    const posts = data?.posts || []; // If no data, default to an empty array
    const totalPages = data?.totalPages || 0; // If no data, default to 0 pages

    return (
        <div className="cmp1-out">
            <div className='cmp-1-blog-list'>
                <div className="cmp1-row">
                    {posts.length > 0 ? ( // If there are posts, display them
                        posts.map(post => (
                            <div className="cmp1-col" key={post.id}>
                                <BlogPost post={post} /> {/* Render each post */}
                            </div>
                        ))
                    ) : ( // If no posts found, show a "no posts" message
                        <div className="flex flex-col items-center justify-center p-4" style={{ width: '100%' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-400 mb-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h1m0 0h1m-1 0h-1m5 0h1m0 0v-4a3 3 0 00-3-3H8a3 3 0 00-3 3v4m0 0h1m1 0h8m-8 0v4m3-4h-1m1 0h1m-1 0h-1m-1 0h-1"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-700">No posts found</h3>
                            <p className="mt-2 text-sm text-gray-500">Try changing your search parameters or category.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Pagination will only show if there are posts */}
            {posts.length > 0 && (
                <Pagination currentPage={page} totalPages={totalPages} handlePageChange={setPage} />
            )}
        </div>
    );
};

export default BlogList;
