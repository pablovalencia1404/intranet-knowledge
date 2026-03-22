import React, { useState, useEffect } from 'react';
import FileUploader from './FileUploader';

export default function DocumentManager() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [docs, setDocs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDocs = () => {
    setError('');
    fetch(`${API_URL}/documentos/leer_d.php`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.docs)
            ? data.docs
            : Array.isArray(data.datos)
              ? data.datos
              : [];
        setDocs(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando documentos:", err);
        setError('No se pudieron cargar los documentos.');
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDocs();
  }, []);

  // ... (aquí iría tu tabla de documentos con el .map)
  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-black mb-6">Biblioteca de Archivos</h2>
      
      {/* Componente para subir archivos */}
      <FileUploader onUploadSuccess={cargarDocs} />
      {cargando ? (
        <p className="animate-pulse text-gray-400 text-xs">Buscando archivos...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-500">No hay documentos disponibles.</p>
      ) : (
        <div className="space-y-2">
          {docs.map((doc, index) => {
            const docId = doc?._id?.$oid || doc?.id || `doc-${index}`;
            const nombre = doc?.titulo || doc?.nombre || doc?.name || 'Archivo sin nombre';
            const url = doc?.url || '#';
            const subidopor = doc?.subido_por || 'Usuario';
            return (
            <div key={docId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <p className="text-sm font-bold text-gray-700">{nombre}</p>
                  <p className="text-xs text-gray-500">Subido por {subidopor}</p>
                </div>
              </div>
              {url !== '#' ? (
                <a
                  href={url}
                  download
                  className="text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-opacity hover:text-blue-800"
                >
                  Descargar ↓
                </a>
              ) : (
                <span className="text-[10px] font-black text-gray-400 opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-opacity">
                  Sin archivo
                </span>
              )}
            </div>
          )})}
        </div>
      )}
    </div>
  );
}