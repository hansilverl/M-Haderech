import React from 'react';
import './PostSection.css';
import Post from '../Posts/Post';

const PostsSection = () => {
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

  return (
    <section id="posts" className="posts-section">
      <div className="posts-header">
        <h2>פוסטים</h2>
        <div className="view-all-button-container">
          <button className="view-all-button">ראה את כל הפוסטים</button>
        </div>
      </div>
      <div className="posts-container">
        {posts.map((post, index) => (
          <Post
            key={index}
            image={post.image}
            title={post.title}
            date={post.date}
            description={post.description}
          />
        ))}
      </div>
    </section>
  );
};

export default PostsSection;
