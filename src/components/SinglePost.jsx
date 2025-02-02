import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { HiOutlineArrowLongLeft, HiOutlineArrowLongRight } from "react-icons/hi2";
import { useQuery, useQueryClient } from 'react-query';

// Fetching the post and related details, like comments, author, categories, etc.
const fetchPostAndDetails = async (id) => {
    const postRequest = axios.get(`http://dev.wp-blog/wp-json/wp/v2/posts/${id}?_embed`);
    const commentsRequest = axios.get(`http://dev.wp-blog/wp-json/wp/v2/comments?post=${id}`);
    const post = await postRequest;
    const comments = await commentsRequest;

    const authorId = post.data.author;
    const categoriesIds = post.data.categories;
    
    // Fetching the author and category data concurrently
    const authorRequest = axios.get(`http://dev.wp-blog/wp-json/wp/v2/users/${authorId}`);
    const categoriesRequest = axios.all(categoriesIds.map((id) =>
        axios.get(`http://dev.wp-blog/wp-json/wp/v2/categories/${id}`)
    ));

    // Fetching the previous and next posts based on the current post's date
    const prevPostRequest = axios.get(`http://dev.wp-blog/wp-json/wp/v2/posts?before=${post.data.date}&per_page=1&_embed`);
    const nextPostRequest = axios.get(`http://dev.wp-blog/wp-json/wp/v2/posts?after=${post.data.date}&per_page=1&_embed&orderby=date&order=asc`);

    const [author, categories, prevPost, nextPost] = await axios.all([authorRequest, categoriesRequest, prevPostRequest, nextPostRequest]);

    return {
        post: post.data,
        comments: comments.data,
        authorName: author.data.name,
        categories: categories.map(cat => cat.data.name),
        previousPost: prevPost.data[0] || null,
        nextPost: nextPost.data[0] || null,
    };
};

const SinglePost = () => {
    const { id } = useParams();  // Extract the post ID from the URL parameters
    const [newComment, setNewComment] = useState('');  // State to hold new comment input
    const [errorMessage, setErrorMessage] = useState('');  // State for error messages during comment submission
    const [isSubmitting, setIsSubmitting] = useState(false);  // State to indicate whether a comment is being submitted

    const { data: postData, isLoading, isError } = useQuery(
        ['post', id],
        () => fetchPostAndDetails(id),
        {
            keepPreviousData: true,  // Keep previous data while loading the new one
        }
    );

    const queryClient = useQueryClient();

    // Loading state
    if (isLoading) {
        return <div className='cmp-loader'> <div className="data-loader"></div></div>;
    }

    // Error handling state
    if (isError) {
        return <div>Error loading data.</div>;
    }

    const { post, comments, authorName, categories, previousPost, nextPost } = postData;
    const postDate = moment(post.date).format('LL');  // Format the post date using moment.js
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;  // Extract the featured image URL

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;  // Prevent submission of empty comments

        setIsSubmitting(true);  // Set submitting state to true

        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const user = await axios.get('http://dev.wp-blog/wp-json/wp/v2/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Send the new comment to the server
                await axios.post('http://dev.wp-blog/wp-json/wp/v2/comments', {
                    post: id,
                    content: newComment,
                    author_name: user.data.name,
                    author_email: user.data.email || 'test@mail.com',
                });

                setNewComment('');
                setErrorMessage('');
                queryClient.invalidateQueries(['post', id]);  // Invalidate the post query to refresh data
            } catch (error) {
                setErrorMessage('There was an error sending your comment. Try again.');
            }
        } else {
            console.error('User not authenticated');
        }

        setIsSubmitting(false);  // Reset submitting state after submission
    };

    return (
        <div className="cmp-single-post single-post-container max-w-4xl mx-auto rounded-lg overflow-hidden my-5">
            <div className="data-container wcl-container">
                <div className="post-title">
                    <div className="data-img">
                        {/* Display featured image */}
                        {featuredMedia ? (
                            <img alt={post.title.rendered} src={featuredMedia} className="w-full h-64 object-cover mb-5" />
                        ) : (
                            <div className="h-64 bg-gray-200 flex items-center justify-center mb-5">
                                <span className="text-gray-500">No image available</span>
                            </div>
                        )}
                    </div>

                    <div className="data-cats categories-container mb-4">
                        {/* Display post categories */}
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="category-button inline-block bg-blue-500 text-white px-3 py-1 rounded-full mr-2 mb-2 cursor-default"
                            >
                                {category}
                            </div>
                        ))}
                    </div>

                    <h1 className="data-title text-3xl font-bold mb-2">{post.title.rendered}</h1>

                    <p className="data-meta text-gray-600 text-sm mb-4">
                        Published {postDate} | Author: {authorName}
                    </p>
                </div>

                {/* Post content */}
                <div
                    className="post-content cmp-content prose mb-5 pb-5"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />

                {/* Navigation to previous and next post */}
                <div className="data-post-navigation post-navigation flex justify-between items-center mb-10">
                    {previousPost ? (
                        <Link
                            to={`/post/${previousPost.id}`}
                            className="data-btn-left flex items-center bg-blue-500 text-white hover:bg-blue-600 rounded px-6 py-3 transition-all"
                        >
                            <HiOutlineArrowLongLeft className="w-5 h-5 mr-2" />
                            Previous post
                        </Link>
                    ) : (
                        <span className="data-btn-left flex items-center bg-gray-300 text-gray-500 rounded px-6 py-3 cursor-not-allowed">
                            <HiOutlineArrowLongLeft className="w-5 h-5 mr-2" />
                            Previous post
                        </span>
                    )}

                    {nextPost ? (
                        <Link
                            to={`/post/${nextPost.id}`}
                            className="data-btn-right flex items-center bg-blue-500 text-white hover:bg-blue-600 rounded px-6 py-3 transition-all"
                        >
                            Next post
                            <HiOutlineArrowLongRight className="w-5 h-5 mr-2" />
                        </Link>
                    ) : (
                        <span className="data-btn-right flex items-center bg-gray-300 text-gray-500 rounded px-6 py-3 cursor-not-allowed">
                            Next post
                            <HiOutlineArrowLongRight className="w-5 h-5 mr-2" />
                        </span>
                    )}
                </div>

                {/* Comments section */}
                <div className="comments-section mb-8 border-t border-gray-300 border-solid mt-5 pt-6">
                    <h3 className="text-2xl font-bold mb-5">Comments</h3>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment p-4 mb-5 border-b border-gray-200 rounded-lg shadow-sm">
                                {comment.author_name && <h4 className="text-lg font-semibold mb-2">{comment.author_name}</h4>}
                                {comment.date && <p className="text-gray-500 text-sm mb-2">{moment(comment.date).fromNow()}</p>}
                                <div className="comment-content text-gray-700 mt-3" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">
                            No comments yet.</p>
                    )}

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="comment-form mt-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Leave your comment"
                        />
                        {errorMessage && (
                            <div className="error-message text-red-500 text-sm mb-3">{errorMessage}</div>
                        )}
                        <button
                            type="submit"
                            className={`submit-btn ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500'} text-white rounded-lg px-6 py-3 hover:bg-blue-600 transition-all duration-300 ease-in-out`}
                            disabled={isSubmitting}  // Disable button while submitting
                        >
                            {isSubmitting ? 'Submitting...' : 'Post a comment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SinglePost;
