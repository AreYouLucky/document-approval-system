
// Viewer.jsx
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
const Viewer = ({ fileId, fileType, accessToken = '' }) => {
    if (!fileId) return null;

    const { url } = usePage();
    const isWord = fileType === 'Word';
    const isSpreadsheet = fileType === 'Excel';

    const handleClick = () => {
        if (isWord) {
            window.open(`https://docs.google.com/document/d/${fileId}/edit`, '_blank');
        } else if (isSpreadsheet) {
            window.open(`https://docs.google.com/spreadsheets/d/${fileId}/edit`, '_blank');
        }
    };

    const getIframeSrc = () => {
        if (isWord) {
            return `https://docs.google.com/document/d/${fileId}/preview`;
        } else if (isSpreadsheet) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        } else {
            return `https://docs.google.com/spreadsheets/d/${fileId}/preview`;

        }
    };



    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <button
                onClick={handleClick}
                className="bg-gray-600 text-sm absolute right-5 top-5 text-white px-4 py-2 rounded-lg border"
            >
                Edit/Attach Comments
            </button>

            <iframe
                src={getIframeSrc()}
                width="100%"
                height="935"
                allow="autoplay"
                style={{ backgroundColor: 'white', border: 'none' }}
                title="Document Viewer"
            ></iframe>
        </div>
    );
};

export default Viewer;

