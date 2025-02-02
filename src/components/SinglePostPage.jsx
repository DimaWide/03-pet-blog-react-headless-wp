import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";

const SinglePostPage = () => {
    const { id } = useParams();  // Получение ID поста из URL

    const fetchPost = async () => {
        const response = await axios.get(`/wp-json/wp/v2/posts/${id}`);
        return response.data;
    };

    const { data: post, error, isLoading } = useQuery(["post", id], fetchPost);

    if (isLoading) return <div>Loading post...</div>;
    if (error) return <div>Error loading post</div>;

    return (
        <div>
            <h1>{post.title.rendered}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
    );
};

export default SinglePostPage;
