import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PostDetails.css';
import PdfViewer from '../../components/PdfViewer/PdfViewer';
import { pdfjs } from 'react-pdf';
import pdfIcon from '../../assets/pdf-file.png'


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const fetchPostDetails = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Example of how to switch between the two types
      const postDetails = (id % 2 === 0) ? {
        id: id,
        image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
        title: 'מידע ותמיכה לנשים המתמודדות עם היפראמזיס בהריון',
        date: '29 ביוני 2024',
        description: 'ברוכות הבאות לפוסט שיעזור לכן להבין ולהתמודד עם היפראמזיס במהלך ההריון. היפראמזיס הינו מצב בו נשים חוות בחילות והקאות קשות במהלך ההריון, דבר שיכול לסכן את האם והעובר. כאן תמצאו יעוץ רפואי מקצועי, מידע על אפשרויות תמיכה כלכלית למימון תרופות, והמלצות למניעת סיכונים לאם ולעובר.',
        type: 'pdf',
        contentFile: 'https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf'
      } : {
        id: id,
        image: 'https://assets1.farmaciasanpablo.com.mx/landings/_blog/bebes/230125-10cuidadosEmbarazada/10-cuidados-que-debe-tener-una-mujer-embarazada.jpg',
        title: 'מידע ותמיכה לנשים המתמודדות עם היפראמזיס בהריון ',
        date: '30 ביוני 2024',
        description: 'ברוכות הבאות לפוסט שיעזור לכן להבין ולהתמודד עם היפראמזיס במהלך ההריון. היפראמזיס הינו מצב בו נשים חוות בחילות והקאות קשות במהלך ההריון, דבר שיכול לסכן את האם והעובר. כאן תמצאו יעוץ רפואי מקצועי, מידע על אפשרויות תמיכה כלכלית למימון תרופות, והמלצות למניעת סיכונים לאם ולעובר.',
        type: 'editor',
        contentHtml: '<p> מודדות עם היפראמזיס דורשת ידע והבנה של התסמינים והטיפולים הזמינים. ראשית, חשוב לזהות את הסימפטומים במוקדם ולפנות לייעוץ רפואי. ביקור אצל הרופא יכול לסייע בהתאמת תכנית טיפול המתאימה לצרכיך, כולל תרופות שיכולות לשפר את איכות חייך ולהקל על התסמינים.מודדות עם היפראמזיס דורשת ידע והבנה של התסמינים והטיפולים הזמינים. ראשית, חשוב לזהות את הסימפטומים במוקדם ולפנות לייעוץ רפואי. ביקור אצל הרופא יכול לסייע בהתאמת תכנית טיפול המתאימה לצרכיך, כולל תרופות שיכולות לשפר את איכות חייך ולהקל על התסמינים.התמודדות עם היפראמזיס דורשת ידע והבנה של התסמינים והטיפולים הזמינים. ראשית, חשוב לזהות את הסימפטומים במוקדם ולפנות לייעוץ רפואי. ביקור אצל הרופא יכול לסייע בהתאמת תכנית טיפול המתאימה לצרכיך, כולל תרופות שיכולות לשפר את איכות חייך ולהקל על התסמינים.</p>'

      };

      resolve(postDetails);
    }, 1000);
  });
};

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPostDetails(id).then(data => {
      setPost(data);
    });
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }
  const handleOpenPdf = () => {
    window.open(post.contentFile, '_blank');
  };

  return (
    <div className="post-details">
      <h1>{post.title}</h1>
      <p><strong>תאריך פרסום:</strong> {post.date}</p>
      <div class="image-container">
        <img src={post.image} alt={post.title} style={{ width: '100%', height: 'auto' }} />
      </div>
      <p><strong>תיאור:</strong> {post.description}</p>
      {post.type === 'pdf' ? (
        <>
          <button onClick={handleOpenPdf} className="pdf-button">
            <img src={pdfIcon} alt="Open PDF" />
          </button>

          <PdfViewer pdfFile={post.contentFile} />
        </>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      )}
    </div>
  );
};

export default PostDetails;
