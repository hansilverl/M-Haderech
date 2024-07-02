import React from 'react';
import Post from '../../components/Posts/Post';
import usePostsDetails from '../../hooks/usePostsDetails';
import './Posts.css';

const Posts = () => {
  const posts = [
    {
      id: 1,
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 1',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 1',
      type: 'pdf',
      contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
    {
      id: 2,
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 2',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 2',
      type: 'pdf',
      contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
    {
      id: 3,
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 3',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 3',
      type: 'pdf',
      // contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
    {
      id: 4,
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 4',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 4',
      type: 'pdf',
      contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
    {
      id: 5,
      image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
      title: 'פוסט 5',
      date: '29 de junio de 2024',
      description: 'תיאור של פוסט 5',
      type: 'pdf',
      // contentFile: 'https://pdfobject.com/pdf/sample.pdf',
      published: true
    },
  ];

  return (
    <div className="posts-screen">
      <h2></h2>
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
    </div>
  );
};

export default Posts;
