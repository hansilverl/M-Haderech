import { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PdfViewer() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className='pdf-div'>
      <p>
         עמוד {pageNumber} מ {numPages}
     </p>
      <Document file="https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages)).map((x,i) => i+1).map((page) => {
            return(<Page pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false} />)
        })}
      </Document>
    </div>
  );
}

export default PdfViewer;