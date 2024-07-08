import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfIcon from '../../assets/pdf-file.png'; // Asegúrate de que la ruta al archivo es correcta
import './Post.css';

const Post = ({ id, imageUrl, title, date, description, type, contentUrl }) => {
	const navigate = useNavigate();
	const [hovered, setHovered] = useState(false);

	const handleViewPost = () => {
		navigate(`/posts/${id}`); // Navega a la página de detalles del post
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
			{!imageUrl ? null : <img src={imageUrl} alt={title} className='post-image' />}
			<h3 className='post-title'>{title}</h3>
			<p className='post-date'>{date}</p>
			<p className='post-description'>{truncateDescription(description, 12)}</p>

			{type === 'file' && contentUrl && (
				<button
					className='post-pdf-button'
					onClick={() => window.open(contentUrl, '_blank')}>
					<img src={pdfIcon} alt='PDF' style={{ width: '24px', height: '24px' }} />
				</button>
			)}
			<button className='post-button' onClick={handleViewPost}>
				ראה הכל
			</button>
		</div>
	);
};

export default Post;
