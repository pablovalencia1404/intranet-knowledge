import React, { useState } from 'react';

export default function SocialWall() {
  const [mensaje, setMensaje] = useState("");
  const [posts, setPosts] = useState([
    { id: 1, user: "Ana Rodríguez", dept: "RRHH", text: "¡Recordad el desayuno del viernes! 🥐" }
  ]);

  const publicar = () => {
    if (mensaje.trim() === "") return;
    const nuevoPost = { id: Date.now(), user: "Alfonso", dept: "Frontend Dev", text: mensaje };
    setPosts([nuevoPost, ...posts]);
    setMensaje("");
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden my-6">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className="text-xl">📣</span>
        <h3 className="font-bold text-gray-800">Muro de Actualidad</h3>
      </div>
      <div className="p-4">
        <textarea 
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          placeholder="¿Qué novedades hay?"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows="3"
        />
        <div className="flex justify-end mt-2">
          <button onClick={publicar} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm">
            Publicar novedad
          </button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50">
            <p className="text-sm font-bold text-gray-900">{post.user} <span className="text-xs font-normal text-gray-400">• {post.dept}</span></p>
            <p className="text-gray-700 text-sm mt-2">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}