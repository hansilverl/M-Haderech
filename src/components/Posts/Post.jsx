import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pdfIcon from '../../assets/pdf-file.png';
import { getDownloadURLFromPath } from '../../hooks/useResourceManagement';
import './Post.css';

const getDateStringFromTimeStamp = (timeStamp) => {
  if (!timeStamp) return null;
  const now = timeStamp?.toDate();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${day}/${month}/${year}`;
};

const Post = ({ article }) => {
  const { id, title, datePublished, description, elements } = article;
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);
  const [pdfUrls, setPdfUrls] = useState(null);

  const [imagePath] = useState(elements?.find((element) => element.type === 'image')?.resourcePath);
  const [pdfPaths] = useState(
    elements
      ?.filter((element) => element.type === 'pdf' && element.resourcePath)
      ?.map((element) => element.resourcePath)
  );

  useEffect(() => {
    const getUrls = async () => {
      if (imagePath && !imageUrl) setImageUrl(await getDownloadURLFromPath(imagePath));

      if (pdfPaths && !pdfUrls) {
        const promises = pdfPaths.map(async (path) => await getDownloadURLFromPath(path));
        setPdfUrls(await Promise.all(promises));
      }
    };
    getUrls();
  }, [imagePath, pdfPaths]);

  const handleViewPost = () => {
    navigate(`/posts/${id}`); // Navigate to the post details page
  };

  return !id ? null : (
    <div className="detailed-post-container" onClick={handleViewPost}>
	  <div className="title-date-container">
      <h3 className="post-title">{title}</h3>
      <p className="post-date">{getDateStringFromTimeStamp(datePublished)}</p>
	  </div>
	  {!imageUrl ? null : <img src={imageUrl} alt={title} className="post-image" />}
      <p className="post-description">{description}</p>
      {!pdfUrls
        ? null
        : pdfUrls.map((pdfUrl, index) => (
            <a
              key={index}
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="post-pdf-button"
              onClick={(e) => e.stopPropagation()} // Prevents the click from propagating to the parent div
            >
              <img src={pdfIcon} alt="pdf-icon" className="pdf-icon" />
            </a>
          ))}
    </div>
  );
};

export default Post;
