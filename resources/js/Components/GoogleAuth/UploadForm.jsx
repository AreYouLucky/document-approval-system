import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ accessToken, setFileId }) => {
  const [file, setFile] = useState(null);
  const [folderId, setFolderID] = useState('1tKRYzcYjKpO17b5pWHymZKPgtCF9sQxU');


  const handleUpload = () => {
    if (!file || !accessToken) return;
    axios.get(
      'https://www.googleapis.com/drive/v3/files',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: `name='${file.name}' and '${folderId}' in parents and trashed=false`,
          fields: 'files(id, name)',
        },
      }
    ).then(
      res => {
        filterFiles(res.data.files[0], file)
      }
    );
  }

  const filterFiles = (result, file) => {
    const existingFile = result;
    if (existingFile) {
      axios.delete(
        `https://www.googleapis.com/drive/v3/files/${existingFile.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ).then(
        uploadFileToDrive(file)
      );
    }
    else {
      uploadFileToDrive(file)
    }
  }

  const uploadFileToDrive = (file) => {
    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', file);
    axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/related',
        },
      }
    ).then(
      res => {
        setFileId(res.data.id); 
      }
    );
  }




//   // 4. Set file permission to public
//   await axios.post(
//     `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
//     {
//       role: 'reader',
//       type: 'anyone',
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     }
//   );

// } catch (error) {
//   console.error('Upload error:', error);
// }
//   };

return (
  <div>
    <input
      type="file"
      onChange={(e) => {
        if (e.target.files[0]) {
          setFile(e.target.files[0]);
        }
      }}
    />
    <button onClick={handleUpload}>Upload to Drive</button>
  </div>
);
};

export default UploadForm;
