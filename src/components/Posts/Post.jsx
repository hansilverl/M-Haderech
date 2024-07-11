import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfIcon from '../../assets/pdf-file.png';
import { getDownloadURLFromPath } from '../../hooks/useResourceManagement';
import './Post.css';

const getDateStringFromTimeStamp = (timeStamp) => {
	if (!timeStamp) return null;
	const now = timeStamp.toDate();
	const year = now.getFullYear();
	const month = (now.getMonth() + 1).toString().padStart(2, '0');
	const day = now.getDate().toString().padStart(2, '0');
	return `${day}/${month}/${year}`;
};

const Post = ({ article }) => {
	console.log("article: ",article)
	const { id, title, datePublished, description, elements, articleType } = article;
	const navigate = useNavigate();

	const [imageUrl, setImageUrl] = useState(null);

	const imagePath = elements?.find((element) => element.type === 'image')?.resourcePath;
	useEffect(() => {
		const getImageUrl = async () => {
			const url = await getDownloadURLFromPath(imagePath);
			setImageUrl(url);
		};
		if (imagePath) getImageUrl();
	}, [imagePath]);

	const handleViewPost = () => {
		navigate(`/posts/${id}`); // Navigate to the post details page
	};

	const truncateDescription = (text, wordLimit) => {
		const words = text.split(' ');
		if (words.length > wordLimit) {
			return words.slice(0, wordLimit).join(' ') + '...';
		}
		return text;
	};

	return !id ? null : (
		<div className='post'>
			<div className={`post-type-bubble ${articleType === 'post' ? 'posttype' : 'convention'}`}>
				{articleType === 'post' ? 'פוסט' : 'כנס'}
			</div>
			{!imageUrl ? null : <img src={imageUrl} alt={title} className='post-image' />}
			<h3 className='post-title'>{title}</h3>
			<p className='post-date'>{getDateStringFromTimeStamp(datePublished)}</p>
			<p className='post-description'>{truncateDescription(description, 12)}</p>
			<button className='post-button' onClick={handleViewPost}>
				ראה הכל
			</button>
		</div>
	);
};

export default Post;
