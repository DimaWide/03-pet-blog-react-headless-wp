import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useQuery } from 'react-query';

// Функция для получения данных о посте
const fetchPost = async (id) => {
    const response = await axios.get(`http://dev.wp-blog/wp-json/wp/v2/posts/${id}?_embed`);
    return response.data;
};

// Функция для получения комментариев
const fetchComments = async (postId) => {
    const response = await axios.get(`http://dev.wp-blog/wp-json/wp/v2/comments?post=${postId}`);
    return response.data;
};

// Функция для получения соседних постов (следующий и предыдущий)
const fetchAdjacentPosts = async (currentPostDate) => {
    const previousPost = await axios.get(
        `http://dev.wp-blog/wp-json/wp/v2/posts?before=${currentPostDate}&per_page=1&_embed`
    );
    const nextPost = await axios.get(
        `http://dev.wp-blog/wp-json/wp/v2/posts?after=${currentPostDate}&per_page=1&_embed`
    );
    return {
        previousPost: previousPost.data[0] || null,
        nextPost: nextPost.data[0] || null,
    };
};

// Функция для получения данных о текущем пользователе
const fetchCurrentUser = async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.get('http://dev.wp-blog/wp-json/wp/v2/users/me', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const SinglePost = () => {
    const { id } = useParams();
    const [newComment, setNewComment] = useState('');
    const { data: post, isLoading: postLoading } = useQuery(['post', id], () => fetchPost(id));
    const { data: comments } = useQuery(['comments', id], () => fetchComments(id));
    const { data: user } = useQuery('user', fetchCurrentUser, { enabled: !!localStorage.getItem('authToken') });

    // Для получения предыдущего и следующего поста используем дату текущего поста
    const { data: adjacentPosts, isLoadingAdjacent, errorAdjacent } = useQuery(
        ['adjacentPosts', post?.date],
        () => fetchAdjacentPosts(post?.date),
        { enabled: !!post } // Запрос выполняется только если post есть
    );

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        if (user) {
            try {
                await axios.post('http://dev.wp-blog/wp-json/wp/v2/comments', {
                    post: id,
                    content: newComment,
                    author_name: user.name, // Используем данные пользователя
                    author_email: user.email || 'test@mail.com', // Или указать дефолтный email
                });
                setNewComment(''); // Очищаем поле ввода
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        } else {
            console.error('User not authenticated');
        }
    };

    if (postLoading || isLoadingAdjacent) {
        return ;
    }

    const author = post._embedded?.author?.[0]?.name || 'Неизвестный автор';
    const postDate = post.date ? moment(post.date).format('LL') : 'Дата не указана';
    const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

    // Убедимся, что данные соседних постов существуют
    const previousPost = adjacentPosts?.previousPost;
    const nextPost = adjacentPosts?.nextPost;

    return (
        <div className="single-post-container max-w-4xl mx-auto rounded-lg overflow-hidden my-5 ">
            {/* Post Title and Featured Image */}
            <div className="post-title">
                {featuredMedia ? (
                    <img alt={post.title.rendered} src={featuredMedia} className="w-full h-64 object-cover mb-5" />
                ) : (
                    <div className="h-64 bg-gray-200 flex items-center justify-center mb-5">
                        <span className="text-gray-500">Изображение отсутствует</span>
                    </div>
                )}
                <h1 className="text-3xl font-bold mb-2">{post.title.rendered}</h1>
                <p className="text-gray-600 text-sm mb-4">
                    Опубликовано {postDate} | Автор: {author}
                </p>
            </div>

            {/* Post Content */}
            <div
                className="post-content prose mb-5"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Previous and Next Post Links */}
            <div className="post-navigation flex justify-between mb-5">
                {previousPost ? (
                    <Link to={`/post/${previousPost.id}`} className="text-blue-500">Предыдущий пост</Link>
                ) : (
                    <span className="text-gray-500">Предыдущий пост</span>
                )}

                {nextPost ? (
                    <Link to={`/post/${nextPost.id}`} className="text-blue-500">Следующий пост</Link>
                ) : (
                    <span className="text-gray-500">Следующий пост</span>
                )}
            </div>

            {/* Comments Section */}
            <div className="comments-section mb-5">
                <h3 className="text-2xl font-bold mb-3">Комментарии</h3>
                {comments?.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className="comment p-3 mb-3 border border-gray-300 rounded">
                            <div dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                        </div>
                    ))
                ) : (
                    <p>Нет комментариев</p>
                )}
            </div>

            {/* Add a Comment */}
            <div className="add-comment mb-5">
                <h3 className="text-2xl font-bold mb-3">Добавить комментарий</h3>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ваш комментарий"
                        className="w-full p-3 mb-3 border border-gray-300 rounded"
                    />
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Отправить</button>
                </form>
            </div>
        </div>
    );
};

export default SinglePost;
