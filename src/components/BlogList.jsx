import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import BlogPost from './BlogPost';
import Pagination from './Pagination';

const fetchPosts = async (page, selectedCategory, searchTerm, postsPerPage) => {
    let url = `http://dev.wp-blog/wp-json/wp/v2/posts?page=${page}&per_page=${postsPerPage}`;

    if (selectedCategory) {
        url += `&categories=${selectedCategory}`;
    }

    if (searchTerm) {
        url += `&search=${searchTerm}`;
    }

    const response = await axios.get(url);
    return {
        posts: response.data,
        totalPages: parseInt(response.headers['x-wp-totalpages']),
    };
};

const BlogList = ({ selectedCategory, searchTerm, page, setPage, setTotalPages, postsPerPage = 6 }) => {
    const { data, error, isLoading } = useQuery(
        ['posts', page, selectedCategory, searchTerm, postsPerPage],
        () => fetchPosts(page, selectedCategory, searchTerm, postsPerPage),
        {
            keepPreviousData: true,
            onSuccess: (data) => {
                setTotalPages(data.totalPages); // Устанавливаем общее количество страниц после получения данных
            },
        }
    );

    if (isLoading) {
        return <div>Loading...</div>; // Опционально: добавьте индикатор загрузки
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const posts = data?.posts || []; // Используем опциональную цепочку для избежания ошибок
    const totalPages = data?.totalPages || 0; // Используем опциональную цепочку здесь тоже

    return (
        <div className="cmp1-out">
            <div className='cmp-1-blog-list'>
                <div className="cmp1-row">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <div className="cmp1-col" key={post.id}>
                                <BlogPost post={post} />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center p-4" style={{width: '100%'}}>
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
                        <h3 className="text-lg font-semibold text-gray-700">Посты не найдены</h3>
                        <p className="mt-2 text-sm text-gray-500">Попробуйте изменить параметры поиска или категорию.</p>
                    </div>
                    
                    )}
                </div>
            </div>
            {posts.length > 0 && ( // Показываем пагинацию только если есть посты
                <Pagination currentPage={page} totalPages={totalPages} handlePageChange={setPage} />
            )}
        </div>
    );
};

export default BlogList;
