import React, { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';
import * as pdfjsLib from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = '/js/pdf.worker.mjs'; // Local worker file

const PdfThumbnailRenderer = ({ pdfUrl }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(null);

  // Detect container width when mounted or resized
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (!containerWidth) return;

    const renderThumbnail = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (error) {
        console.error('Failed to render PDF thumbnail:', error);
      }
    };

    renderThumbnail();
  }, [pdfUrl, containerWidth]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PdfThumbnailRenderer;
