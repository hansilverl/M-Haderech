import React, { useState, useEffect } from 'react';
import Post from '../Posts/Post';
import { useNavigate } from 'react-router-dom';
import usePostDelete from '../../hooks/usePostDelete';
import usePostUpdate from '../../hooks/usePostUpdate';
import { serverTimestamp } from 'firebase/firestore';
import './PostAdmin.css';

const PostAdmin = ({ id, post, setRefresh }) => {
	const { imageUrl, title, date, description, type, contentUrl, published, datePublished } = post;
	const { postDelete, postDeleteHandler } = usePostDelete(id);
	const { postUpdate, postUpdateHandler } = usePostUpdate(id);

	const [isPublished, setPublished] = useState(published ? true : false);

	const deletePostButton = async () => {
		if (window.confirm('Are you sure you want to delete this post?')) {
			await postDeleteHandler();
		}
	};

	const togglePublished = async () => {
		setPublished(!isPublished);
	};

	useEffect(() => {
		const publish = async () => {
			const newPost = { published: isPublished };
			if (isPublished && !datePublished) newPost['datePublished'] = serverTimestamp();
			await postUpdateHandler(newPost);
		};
		if (published !== isPublished) publish();
	}, [isPublished]);

	useEffect(() => {
		if (postDelete) setRefresh(true);
	}, [postDelete, isPublished]);

	const navigate = useNavigate(`/edit/${id}`);

	const AdminBar = () => {
		return (
			<div className="admin-bar">
				<button onClick={() => navigate(`/edit/${id}`)} className="admin-button">
					ערוך
				</button>
				<button onClick={deletePostButton} className="admin-button">
					מחק
				</button>
				{!isPublished ? (
					<button onClick={togglePublished} className="admin-button publish-button">
						פרסם
					</button>
				) : (
					<button onClick={togglePublished} className="admin-button unpublish-button">
						בטל פרסום
					</button>
				)}
			</div>
		);
	};

	return (
		<div className="post-admin">
			<div className="post-content">
				<Post
					id={id}
					imageUrl={imageUrl}
					title={title}
					date={date}
					description={description}
					type={type}
					contentUrl={contentUrl}
				/>
			</div>
			<AdminBar id={id} />
		</div>
	);
};

export default PostAdmin;