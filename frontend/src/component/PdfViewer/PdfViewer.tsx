import React from 'react';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import CustomViewer from './CustomViewer';

const PdfViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
    return (
        <Worker workerUrl="/pdf.worker.min.js">
            <CustomViewer fileUrl={fileUrl} />
        </Worker>
    );
};

export default PdfViewer;
