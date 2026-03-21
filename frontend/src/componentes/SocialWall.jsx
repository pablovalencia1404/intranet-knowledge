import React, { useState, useEffect } from 'react';
import NuevoSocialPost from './NuevoSocialPost'; // 👈 Asegúrate de que el nombre coincida

export default function SocialWall() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Función para pedir los posts al servidor
  const cargarPosts = () => {
    
    
    fetch(`${API_URL}/posts/leer_p.php`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.foro)
            ? data.foro
            : Array.isArray(data.datos)
              ? data.datos
              : [];
        setPosts(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("❌ Error cargando el muro:", err);
        setCargando(false);
      });
  };

  // 2. Se ejecuta nada más abrir la web
  useEffect(() => {
    cargarPosts();
  }, []);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Conectando con el equipo...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 pb-20">
      
      {/* SECCIÓN A: Formulario para publicar nuevo contenido */}
      <NuevoSocialPost onPostCreated={cargarPosts} />

      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-2xl text-gray-800 tracking-tighter">📢 Novedades</h3>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">En vivo</span>
      </div>
      
      {/* SECCIÓN B: Listado de publicaciones */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <span className="text-4xl">🏜️</span>
            <p className="text-gray-400 mt-2 text-sm">Parece que nadie ha publicado nada todavía.</p>
          </div>
        ) : (
          posts.map((post, index) => {
            const postId = post?._id?.$oid || post?.id || `post-${index}`;
            const autor = post?.user || post?.usuario || post?.usuario_id || 'Usuario';
            const contenido = post?.content || post?.contenido || post?.text || '';
            return (
            <div key={postId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
              {/* Cabecera del Post: Usuario y Fecha */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform">
                  {autor ? autor[0].toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{autor}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.date || post.fecha || 'Reciente'}</p>
                </div>
              </div>
              
              {/* Cuerpo del Post: Texto */}
              <p className="text-gray-700 leading-relaxed text-sm mb-4">
                {contenido}
              </p>
              
              {/* Imagen del Post (si existe) */}
              {post.image && (
                <div className="relative overflow-hidden rounded-xl border border-gray-50">
                   <img 
                    src={post.image} 
                    className="w-full h-auto max-h-[400px] object-cover hover:scale-[1.02] transition-transform duration-500" 
                    alt="Imagen de la publicación" 
                  />
                </div>
              )}

              {/* Pie del Post: Interacción básica */}
              <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-gray-400">
                <button className="text-[11px] font-bold hover:text-blue-600 transition-colors">👍 Me gusta</button>
                <button className="text-[11px] font-bold hover:text-blue-600 transition-colors">💬 Comentar</button>
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
}