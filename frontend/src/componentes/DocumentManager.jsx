import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';

export default function DocumentManager() {
  const [docs, setDocs] = useState([]);
  const [filtro, setFiltro] = useState("Todos");

  const cargarDocs = () => {
    fetch(`${import.meta.env.VITE_API_URL}/documentos`)
      .then(res => res.json())
      .then(data => setDocs(data));
  };

  useEffect(() => { cargarDocs(); }, []);

  return (
    <div className="max-w-4xl mx-auto my-6">
      <FileUploader onUploadSuccess={cargarDocs} />
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
          <h3 className="font-bold text-gray-800">📂 Archivos</h3>
          <select onChange={(e) => setFiltro(e.target.value)} className="text-xs border p-1">
            <option value="Todos">Todos</option>
            <option value="RRHH">RRHH</option>
            <option value="IT">IT</option>
          </select>
        </div>
        <div className="p-4 space-y-2">
          {docs.filter(d => filtro === "Todos" || d.cat === filtro).map(doc => (
            <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-100">
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <p className="text-sm font-bold text-gray-700">{doc.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{doc.cat} • {doc.size}</p>
                </div>
              </div>
              <button className="text-blue-600 font-bold text-xs hover:underline">Descargar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}