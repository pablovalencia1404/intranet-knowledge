import React, { useState } from 'react';

export default function FileUploader({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const uploadFile = async () => {
    if (!file) return;
    setSubiendo(true);
    
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/documentos/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl mb-4 flex items-center justify-between">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="text-xs" />
      {file && (
        <button onClick={uploadFile} className="bg-blue-600 text-white px-3 py-1 rounded font-bold text-xs">
          {subiendo ? "⏳" : "Subir ⬆️"}
        </button>
      )}
    </div>
  );
}