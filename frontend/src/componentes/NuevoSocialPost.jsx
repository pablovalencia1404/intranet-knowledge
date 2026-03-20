import React, { useState } from 'react';

export default function NuevoSocialPost({ onPostCreated }) {
  // Ahora usamos "texto" y "setTexto" siempre
  const [texto, setTexto] = useState("");
  const [image, setImage] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const formData = new FormData();
    formData.append('user', 'Alfonso'); 
    formData.append('content', texto); // Mandamos "texto" al servidor
    if (image) formData.append('image', image);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/social/crear_p.php`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
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
    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">A</div>
          <textarea 
            value={texto} // Usamos "texto"
            onChange={(e) => setTexto(e.target.value)} // Usamos "setTexto"
            placeholder="¿Qué está pasando en la oficina?"
            className="w-full p-2 text-gray-700 outline-none resize-none text-sm"
            rows="2"
            required
          />
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-50 pt-4">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer hover:text-blue-600">
            <span>🖼️ Añadir foto</span>
            <input 
              type="file" 
              className="hidden" 
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
          </label>
          
          <button 
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-xs hover:bg-blue-700"
          >
            {enviando ? "Cargando..." : "Publicar 🚀"}
          </button>
        </div>
        {image && <p className="text-[10px] text-green-600 font-bold">📸 Foto: {image.name}</p>}
      </form>
    </div>
  );
}