import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfIcon from '../../assets/pdf-file.png';  // Asegúrate de que la ruta al archivo es correcta
import './Post.css';


const Post = ({ id, image, title, date, description, type, contentFile }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleViewPost = () => {
    navigate(`/posts/${id}`);  // Navega a la página de detalles del post
  };

  return (
		<div className='post'>
			<img src={image} alt={title} className='post-image' />
			<h3 className='post-title'>{title}</h3>
			<p className='post-date'>{date}</p>
			<p className='post-description'>{description}</p>

			{type === 'pdf' && contentFile && (
				<button
					className='post-pdf-button'
					onMouseEnter={() => setHovered(true)}
					onMouseLeave={() => setHovered(false)}
					onClick={() => window.open(contentFile, '_blank')}>
					{hovered ? (
						'See PDF'
					) : (
						<img src={pdfIcon} alt='PDF' style={{ width: '24px', height: '24px' }} />
					)}
				</button>
			)}
			<button className='post-button' onClick={handleViewPost}>
				ראה הכל
			</button>
		</div>
	)
};

export default Post;
