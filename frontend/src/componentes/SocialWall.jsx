import React, { useState, useEffect } from 'react';
import NuevoSocialPost from './NuevoSocialPost';

export default function SocialWall() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [likes, setLikes] = useState({});
  const [usuarioLikes, setUsuarioLikes] = useState({});
  const [textoComentario, setTextoComentario] = useState("");

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
        
        // Cargar likes y comentarios para cada post
        lista.forEach(post => {
          const postId = post?._id?.$oid || post?.id;
          if (postId) cargarLikesYComentarios(postId);
        });
      })
      .catch(err => {
        console.error("Error cargando el muro:", err);
        setCargando(false);
      });
  };

  const cargarLikesYComentarios = (postId) => {
    fetch(`${API_URL}/posts/leer_lc.php?post_id=${postId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setLikes(prev => ({
            ...prev,
            [postId]: data.total_likes
          }));
          setComentarios(prev => ({
            ...prev,
            [postId]: data.comentarios || []
          }));
          
          // Verificar si el usuario actual dio like
          const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
          const usuarioDioLike = data.likes?.some(like => like.usuario_id === usuario?.id);
          setUsuarioLikes(prev => ({
            ...prev,
            [postId]: usuarioDioLike || false
          }));
        }
      })
      .catch(err => console.error("Error cargando likes:", err));
  };

  const agregarLike = (postId) => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    fetch(`${API_URL}/posts/crear_l.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: postId,
        usuario_id: usuario?.id || 'anonimo',
        usuario_nombre: usuario?.nombre || 'Usuario',
      }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          cargarLikesYComentarios(postId);
        }
      })
      .catch(err => console.error("Error toggleando like:", err));
  };

  const agregarComentario = (postId) => {
    if (!textoComentario.trim()) return;
    
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    fetch(`${API_URL}/posts/crear_c.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post_id: postId,
        usuario_id: usuario?.id || 'anonimo',
        usuario_nombre: usuario?.nombre || 'Usuario',
        contenido: textoComentario,
      }),
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setTextoComentario('');
          cargarLikesYComentarios(postId);
        }
      })
      .catch(err => console.error("Error agregando comentario:", err));
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
        <h3 className="font-black text-2xl text-gray-800 tracking-tighter">Novedades</h3>
        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase">En vivo</span>
      </div>
      
      {/* SECCIÓN B: Listado de publicaciones */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
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
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex gap-4 text-gray-400 mb-3">
                  <button
                    onClick={() => agregarLike(postId)}
                    className={`text-[11px] font-bold transition-colors flex items-center gap-1 ${
                      usuarioLikes[postId] ? 'text-red-600' : 'hover:text-red-600'
                    }`}
                  >
                    {usuarioLikes[postId] ? '❤️' : '🤍'} Me gusta {likes[postId] ? `(${likes[postId]})` : ''}
                  </button>
                  <button
                    onClick={() => setPostSeleccionado(postId)}
                    className="text-[11px] font-bold hover:text-blue-600 transition-colors flex items-center gap-1"
                  >
                    💬 Comentar {comentarios[postId]?.length ? `(${comentarios[postId].length})` : ''}
                  </button>
                </div>

                {/* Mostrar comentarios si el post está seleccionado */}
                {postSeleccionado === postId && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {/* Lista de comentarios */}
                    {comentarios[postId]?.length === 0 ? (
                      <p className="text-xs text-gray-500">No hay comentarios aún</p>
                    ) : (
                      <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                        {comentarios[postId]?.map((com, idx) => (
                          <div key={idx} className="bg-white p-2 rounded text-xs">
                            <p className="font-bold text-gray-800">{com.usuario_nombre}</p>
                            <p className="text-gray-700">{com.contenido}</p>
                            <p className="text-gray-400 text-[10px]">{com.fecha ? new Date(com.fecha).toLocaleDateString('es-ES') : 'Reciente'}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulario para agregar comentario */}
                    <textarea
                      value={textoComentario}
                      onChange={(e) => setTextoComentario(e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="w-full p-2 border border-gray-300 rounded text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => agregarComentario(postId)}
                        disabled={!textoComentario.trim()}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                      >
                        Comentar
                      </button>
                      <button
                        onClick={() => {
                          setPostSeleccionado(null);
                          setTextoComentario('');
                        }}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold hover:bg-gray-400"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  );
}