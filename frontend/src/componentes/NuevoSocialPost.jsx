import React, { useState } from 'react';

export default function NuevoSocialPost({ onPostCreated }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  // Ahora usamos "texto" y "setTexto" siempre
  const [texto, setTexto] = useState("");
  const [image, setImage] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    const payload = {
      contenido: texto,
      usuario_id: usuario?.id || 'anonimo',
      usuario_nombre: usuario?.nombre || 'Usuario',
      titulo_hilo: 'Muro social',
    };

    try {
      const response = await fetch(`${API_URL}/posts/crear_p.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setTexto(""); // Borra el texto después de publicar
        setImage(null);
        if (onPostCreated) onPostCreated(); 
      }
    } catch (error) {
      console.error("Error al publicar:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3 items-start">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold">
            {JSON.parse(localStorage.getItem('usuario') || '{}')?.nombre?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="¿Qué tienes en mente hoy?"
            className="w-full p-1 text-slate-700 outline-none resize-none text-lg placeholder:text-slate-400"
            rows="2"
            required
          />
        </div>
        
        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 font-medium">
              <span>🖼️ Añadir foto</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
              />
            </label>

            <span className="font-medium">📎 Archivo</span>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>

        {image && (
          <p className="text-xs text-emerald-700 font-semibold">Imagen seleccionada: {image.name}</p>
        )}
      </form>
    </div>
  );
}