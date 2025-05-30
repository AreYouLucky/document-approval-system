import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import {
  PDFPageView,
  DefaultTextLayerFactory,
  DefaultAnnotationLayerFactory,
} from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.mjs';

const PdfViewer = ({ url }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });

        const pageView = new PDFPageView({
          container: containerRef.current,
          id: 1,
          scale: 1.5,
          defaultViewport: viewport,
          textLayerFactory: new DefaultTextLayerFactory(),
          annotationLayerFactory: new DefaultAnnotationLayerFactory(),
        });

        pageView.setPdfPage(page);
        pageView.draw();
      });
    });
  }, [url]);

  return <div ref={containerRef} className="pdfViewer" style={{ width: '100%' }} />;
};

export default PdfViewer;



