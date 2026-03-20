import React, { useState, useEffect } from 'react';

export default function DocumentManager() {
  const [docs, setDocs] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarDocs = () => {
    // 👈 Apuntamos a la ruta real de Raúl
    fetch(`${import.meta.env.VITE_API_URL}/documentos/leer_d.php`)
      .then(res => res.json())
      .then(data => {
        // Raúl suele enviar los datos en una clave (como "foro" antes)
        // Si él los envía directamente, usa: setDocs(data);
        // Si usa una clave "docs", usa: setDocs(data.docs || []);
        setDocs(data.docs || data); 
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando documentos:", err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDocs();
  }, []);

  // ... (aquí iría tu tabla de documentos con el .map)
  return (
    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-black mb-6">📁 Biblioteca de Archivos</h2>
      {cargando ? (
        <p className="animate-pulse text-gray-400 text-xs">Buscando archivos...</p>
      ) : (
        <div className="space-y-2">
          {docs.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <p className="text-sm font-bold text-gray-700">{doc.nombre || doc.name || "Archivo sin nombre"}</p>
              </div>
              <span className="text-[10px] font-black text-blue-600 opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-opacity">Descargar ↓</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}