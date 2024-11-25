import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const BlogPost = ({ post }) => {
  const [featuredMedia, setFeaturedMedia] = useState(null);
  const author = post._embedded?.author?.[0]?.name || 'Неизвестный автор';
  const postDate = post.date ? moment(post.date).format('LL') : 'Дата не указана';
  const excerpt = post.excerpt?.rendered ? post.excerpt.rendered : 'Нет краткого описания';
//   console.log(post);

  useEffect(() => {
    const fetchFeaturedMedia = async () => {
      const mediaId = post.featured_media; // Get media ID
      if (mediaId) {
        try {
          const response = await axios.get(`http://dev.wp-blog/wp-json/wp/v2/media/${mediaId}`);
          setFeaturedMedia(response.data.source_url); // Set the featured media URL
        } catch (error) {
          console.error('Error fetching featured media:', error);
        }
      }
    };

    fetchFeaturedMedia();
  }, [post]);

  return (
    <Link to={`/post/${post.id}`} className="cmp-3-post block bg-white shadow-md rounded-lg overflow-hidden mb-5">
      {featuredMedia ? (
        <img
          alt={post.title.rendered}
          src={featuredMedia}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Изображение отсутствует</span>
        </div>
      )}
      <div className="p-5">
        <h2 className="text-xl font-bold mb-2">{post.title.rendered}</h2>
        <p className="text-gray-600 text-sm mb-4">
          Опубликовано {postDate} | Автор: {author}
        </p>
        {/* Display the excerpt */}
        <div
          className="prose mb-4" // Use prose class for automatic styling
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
        {/* Display the full content */}
      </div>
    </Link>
  );
};

export default BlogPost;
