import React, { useState } from 'react';

export default function FileUploader({ onUploadSuccess }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [file, setFile] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setSubiendo(true);
    setMensaje("");
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('titulo', file.name);
    formData.append('usuario_id', usuario?.id || 'anonimo');
    formData.append('usuario_nombre', usuario?.nombre || 'Usuario');
    formData.append('categoria', 'general');

    try {
      const response = await fetch(`${API_URL}/documentos/crear_d.php`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setMensaje("Archivo subido con exito.");
        setFile(null);
        if (onUploadSuccess) onUploadSuccess(); // Para que la lista de abajo se actualice sola
      } else {
        setMensaje("Error al subir el archivo.");
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      setMensaje("Error de conexion con el servidor.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="bg-blue-50 p-6 rounded-3xl border-2 border-dashed border-blue-200 mb-8">
      <form onSubmit={handleUpload} className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-black text-blue-900 mb-1">Subir nuevo documento</p>
          <p className="text-[10px] text-blue-600 uppercase tracking-widest">PDF, DOCX, XLSX (MÁX 10MB)</p>
        </div>

        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />

        {file && (
          <button 
            type="submit" 
            disabled={subiendo}
            className="bg-blue-900 text-white px-8 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
          >
            {subiendo ? "Subiendo..." : "Confirmar Subida"}
          </button>
        )}
        
        {mensaje && <p className="text-[10px] font-bold mt-2">{mensaje}</p>}
      </form>
    </div>
  );
}