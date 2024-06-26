import React from 'react';
import './Posts.css';
import Post from '../../components/Posts/Post';

const Posts = () => {
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
    },
    {
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 3',
      date: '02/06/2024',
      description: 'תיאור של פוסט 3'
    },
    {
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 3',
      date: '02/06/2024',
      description: 'תיאור של פוסט 3'
    },
  ];

  return (
    <div className="posts-screen">
      <h2>כל הפוסטים</h2>
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
    </div>
  );
};

export default Posts;
