import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Moment.js to format dates
import axios from 'axios'; // Axios for HTTP requests (not used in this component, but might be needed)
import { Link } from 'react-router-dom'; // Link component for navigation

const BlogPost = ({ post }) => {
    // State to store author name, default is 'Unknown author'
    const [authorName, setAuthorName] = useState('Unknown author');

    // Format the post date using Moment.js
    const postDate = post.date ? moment(post.date).format('LL') : 'No date specified';

    // Get the URL for the featured image (if available)
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.['image-size-2']?.source_url;

    // Get the categories for the post, if available, default to 'Без категории' (uncategorized)
    const categories = post._embedded?.['wp:term']?.[0]?.map(term => term.name) || ['Без категории'];

    // Get the excerpt (short description) of the post, limiting to the first 30 words
    const excerpt = post.excerpt?.rendered
        ? post.excerpt.rendered.split(' ').slice(0, 30).join(' ') + (post.excerpt.rendered.split(' ').length > 30 ? '...' : '')
        : 'No short description';

    return (
        // Link to the full post page
        <Link to={`/post/${post.id}`} className="cmp-3-post block bg-white shadow-md rounded-lg overflow-hidden mb-5">
            {/* Display the featured image if available */}
            {featuredMedia ? (
                <img
                    alt={post.title.rendered}
                    src={featuredMedia}
                    className="w-full h-48 object-cover"
                />
            ) : (
                // Show a placeholder if there's no image
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                </div>
            )}

            <div className="p-5">
                {/* Title of the post */}
                <h2 className="data-title text-xl font-bold mb-2">{post.title.rendered}</h2>

                {/* Date the post was published */}
                <p className="data-meta text-gray-600 text-sm mb-4">
                    Published {postDate}
                </p>

                {/* Display categories of the post */}
                <p className="data-meta text-gray-600 text-sm mb-4">
                    Categories: {categories.length > 0 ? categories.join(', ') : 'Uncategorized'}
                </p>

                {/* Display excerpt (short description) of the post */}
                <div
                    className="data-desc prose mb-4"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />
            </div>
        </Link>
    );
};

export default BlogPost;
