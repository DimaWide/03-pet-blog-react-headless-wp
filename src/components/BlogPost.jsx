import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogPost = ({ post }) => {
    const [authorName, setAuthorName] = useState('Неизвестный автор');
    const postDate = post.date ? moment(post.date).format('LL') : 'Дата не указана';

    console.log(post)

    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.['image-size-2']?.source_url

    const categories = post._embedded?.['wp:term']?.[0]?.map(term => term.name) || ['Без категории'];



    // Ограничиваем краткое описание до 30 слов
    const excerpt = post.excerpt?.rendered
        ? post.excerpt.rendered.split(' ').slice(0, 30).join(' ') + (post.excerpt.rendered.split(' ').length > 30 ? '...' : '')
        : 'Нет краткого описания';

    // useEffect(() => {
    //     // Функция для получения медиа
    //     const fetchFeaturedMedia = async () => {
    //         const mediaId = post.featured_media;
    //         if (mediaId) {
    //             try {
    //                 const response = await axios.get(`http://dev.wp-blog/wp-json/wp/v2/media/${mediaId}`);
    //                 setFeaturedMedia(response.data.source_url);
    //             } catch (error) {
    //                 console.error('Ошибка при получении изображения:', error);
    //             }
    //         }
    //     };

    //     // // Функция для получения имени автора
    //     // const fetchAuthorName = async () => {
    //     //     const authorId = post.author;
    //     //     if (authorId) {
    //     //         try {
    //     //             const response = await axios.get(`http://dev.wp-blog/wp-json/wp/v2/users/${authorId}`);
    //     //             setAuthorName(response.data.name);
    //     //         } catch (error) {
    //     //             console.error('Ошибка при получении автора:', error);
    //     //         }
    //     //     }
    //     // };

    //     // Функция для получения категорий
    //     const fetchCategories = async () => {
    //         const categoryIds = post.categories || [];
    //         try {
    //             const categoryPromises = categoryIds.map((id) =>
    //                 axios.get(`http://dev.wp-blog/wp-json/wp/v2/categories/${id}`)
    //             );
    //             const categoryResponses = await Promise.all(categoryPromises);
    //             setCategories(categoryResponses.map((res) => res.data.name));
    //         } catch (error) {
    //             console.error('Ошибка при получении категорий:', error);
    //         }
    //     };

    //     // fetchFeaturedMedia();
    //     // fetchCategories();
    // }, [post]);

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
                <h2 className="data-title text-xl font-bold mb-2">{post.title.rendered}</h2>
                <p className="data-meta text-gray-600 text-sm mb-4">
                    Опубликовано {postDate} 
                </p>
                <p className="data-meta text-gray-600 text-sm mb-4">
                    Категории: {categories.length > 0 ? categories.join(', ') : 'Без категории'}
                </p>
                {/* Отображаем краткое описание */}
                <div
                    className="data-desc prose mb-4"
                    dangerouslySetInnerHTML={{ __html: excerpt }}
                />
            </div>
        </Link>
    );
};

export default BlogPost;
