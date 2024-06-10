import React from 'react';
import './Post.css';

const Post = ({ image, title, date, description }) => {
  return (
    <div className="post">
      <img src={image} alt={title} className="post-image" />
      <h3 className="post-title">{title}</h3>
      <p className="post-date">{date}</p>
      <p className="post-description">{description}</p>
      <button className="post-button">ראה הכל</button>
    </div>
  );
};

export default Post;
