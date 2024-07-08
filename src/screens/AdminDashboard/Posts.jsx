import React, { useState, useEffect } from 'react';
import './Posts.css';
import PostAdmin from '../../components/PostAdmin/PostAdmin';
import usePostsGetAdmin from '../../hooks/usePostsGetAdmin';
import usePostCreate from '../../hooks/usePostCreate';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
    const { postsGetAdmin, loadingGetAdmin, errorGetAdmin, postsGetAdminHandler } = usePostsGetAdmin(20);
    const [isCreateButtonDisabled, setCreateButtonDisabled] = useState(false);
    const { postCreateID, loadingCreate, errorCreate, postCreateHandler } = usePostCreate();
    const [needToReload, setNeedToReload] = useState(true);
    const navigate = useNavigate();

    const addPostHandler = async (e) => {
        setCreateButtonDisabled(true);
        await postCreateHandler();
    };

    if (needToReload) {
        setNeedToReload(false);
        postsGetAdminHandler(20);
    }

    useEffect(() => {
        if (postCreateID) {
            navigate(`/edit/${postCreateID}`);
        }
    }, [postCreateID, navigate]);

    return (
        <div className="container">
            <div className="header">
                <button className="add-post-button" onClick={addPostHandler} disabled={isCreateButtonDisabled}>
                    הוספת פוסט
                </button>
            </div>
            {loadingGetAdmin ? (
                <div className="loading">טוען...</div>
            ) : errorGetAdmin ? (
                <div className="error">{errorGetAdmin.toString()}</div>
            ) : (
                <div className="posts-container">
                    {postsGetAdmin.map((post, index) => (
                        <PostAdmin
                            key={index}
                            id={post.id}
                            post={post}
                            setRefresh={setNeedToReload}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Posts;
