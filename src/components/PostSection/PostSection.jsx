import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostSection.css';
import Post from '../Posts/Post';

const PostsSection = () => {
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      image: 'https://cdn.pixabay.com/photo/2020/07/08/08/07/daisy-5383056_1280.jpg',
      title: 'פוסט 1',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 1',
      type: 'editor',
      contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
    {
      id: 2,
      image: 'https://cdn.pixabay.com/photo/2020/07/08/08/07/daisy-5383056_1280.jpg',
      title: 'פוסט 2',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 2',
      type: 'pdf',
      contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
    {
      id: 3,
      image: 'https://cdn.pixabay.com/photo/2020/07/08/08/07/daisy-5383056_1280.jpg',
      title: 'פוסט 3',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 3',
      type: 'pdf',
      // contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
  ];

  const handleViewAllClick = () => {
    navigate('/posts');
  };

  return (
    <section id="posts" className="posts-section">
      <div className="posts-header">
        <h2>פוסטים</h2>
      </div>
      <div className="posts-container">
        {posts.map((post, index) => (
          <Post
            key={index}
            id={post.id}
            image={post.image}
            title={post.title}
            date={post.date}
            description={post.description}
            type={post.type}
            contentFile={post.contentFile}
            published={post.published}
          />
        ))}
      </div>
      <div className="view-all-button-container">
        <button onClick={handleViewAllClick} className="view-all-button">ראה את כל הפוסטים</button>
      </div>
    </section>
  );
};

export default PostsSection;
