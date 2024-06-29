import React from 'react';
import './PostSection.css';
import Post from '../Posts/Post';
import { useNavigate } from 'react-router-dom';


const PostsSection = () => {
  const navigate = useNavigate();

  const posts = [
    {
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 1',
      date: '02/06/2024',
      description: 'תיאור של פוסט 1'
    },
    {
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 2',
      date: '02/06/2024',
      description: 'תיאור של פוסט 2'
    },
    {
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 3',
      date: '02/06/2024',
      description: 'תיאור של פוסט 3'
    },
    {
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 4',
      date: '02/06/2024',
      description: 'תיאור של פוסט 4'
    }
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
        {posts.slice(0, 3).map((post, index) => (
          <Post
            key={index}
            image={post.image}
            title={post.title}
            date={post.date}
            description={post.description}
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
