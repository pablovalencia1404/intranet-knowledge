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
        setMensaje("✅ Archivo subido con éxito.");
        setFile(null);
        if (onUploadSuccess) onUploadSuccess(); 
      } else {
        setMensaje("❌ " + (data.msj || "Error al subir el archivo."));
      }
    } catch (error) {
      console.error("Error en la subida:", error);
      setMensaje("❌ Error de conexión con el servidor.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8 mb-8">
      <form onSubmit={handleUpload} className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl">
          ↑
        </div>

        <div className="text-center">
          <p className="text-2xl font-extrabold text-slate-900 mb-1">Subir nuevo documento</p>
          <p className="text-sm text-slate-500">Arrastra archivos aquí o haz clic para buscarlos</p>
          <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX, XLSX (MAX 10MB)</p>
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
        />

        {file && (
          <button
            type="submit"
            disabled={subiendo}
            className="bg-slate-900 text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {subiendo ? 'Subiendo...' : 'Confirmar subida'}
          </button>
        )}

        {mensaje && <p className="text-xs font-semibold mt-2 text-slate-700">{mensaje}</p>}
      </form>
    </div>
  );
}