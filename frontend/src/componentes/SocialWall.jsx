import React, { useEffect, useMemo, useState } from 'react';
import NuevoSocialPost from './NuevoSocialPost';

export default function SocialWall() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [postSeleccionado, setPostSeleccionado] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [likes, setLikes] = useState({});
  const [usuarioLikes, setUsuarioLikes] = useState({});
  const [textoComentario, setTextoComentario] = useState('');

  const cargarPosts = () => {
    fetch(`${API_URL}/posts/leer_p.php`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.foro)
            ? data.foro
            : Array.isArray(data.datos)
              ? data.datos
              : [];

        setPosts(lista);
        setCargando(false);

        lista.forEach((post) => {
          const postId = post?._id?.$oid || post?.id;
          if (postId) {
            cargarLikesYComentarios(postId);
          }
        });
      })
      .catch(() => {
        setCargando(false);
      });
  };

  const cargarLikesYComentarios = (postId) => {
    fetch(`${API_URL}/posts/leer_lc.php?post_id=${postId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setLikes((prev) => ({
            ...prev,
            [postId]: data.total_likes,
          }));
          setComentarios((prev) => ({
            ...prev,
            [postId]: data.comentarios || [],
          }));

          const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
          const usuarioDioLike = data.likes?.some((like) => like.usuario_id === usuario?.id);
          setUsuarioLikes((prev) => ({
            ...prev,
            [postId]: usuarioDioLike || false,
          }));
        }
      })
      .catch(() => {});
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
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          cargarLikesYComentarios(postId);
        }
      })
      .catch(() => {});
  };

  const agregarComentario = (postId) => {
    if (!textoComentario.trim()) {
      return;
    }

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
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setTextoComentario('');
          cargarLikesYComentarios(postId);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    cargarPosts();
  }, []);

  const totalLikes = useMemo(() => Object.values(likes).reduce((acc, value) => acc + Number(value || 0), 0), [likes]);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">Cargando red social...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_220px] gap-5 mt-6 pb-20">
      <aside className="bg-white border border-slate-200 rounded-2xl p-4 h-fit xl:sticky xl:top-24">
        <h3 className="text-2xl font-extrabold text-slate-900">Centro de Conocimiento</h3>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-[0.16em]">Gestion institucional</p>

        <div className="mt-5 space-y-2 text-sm">
          <div className="rounded-lg px-3 py-2 text-slate-600">Explorar Wiki</div>
          <div className="rounded-lg px-3 py-2 text-slate-600">Mis Documentos</div>
          <div className="rounded-lg px-3 py-2 text-slate-600">Canales de Foro</div>
          <div className="rounded-lg px-3 py-2 text-slate-600">Historial Chatbot</div>
          <div className="rounded-lg px-3 py-2 bg-blue-50 text-blue-700 font-semibold">Grupos Sociales</div>
        </div>

        <button className="mt-6 w-full rounded-xl bg-blue-600 text-white py-2.5 text-sm font-bold hover:bg-blue-700 transition-colors">
          Nuevo Documento
        </button>
      </aside>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <article className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="text-4xl font-extrabold text-slate-900">{posts.length * 24 || 2484}</p>
            <p className="text-sm text-slate-500 mt-1">Documentos compartidos</p>
          </article>

          <article className="rounded-2xl bg-[#032b4d] text-white p-5">
            <p className="text-4xl font-extrabold">{posts.length + 120}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200 mt-1">Debates activos</p>
          </article>

          <article className="rounded-2xl bg-white border border-slate-200 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Tendencias</p>
            <p className="mt-2 text-sm text-blue-700 font-semibold">#NuevaOficina</p>
            <p className="text-sm text-slate-700">Detalles de la mudanza</p>
          </article>
        </div>

        <div className="mt-5">
          <NuevoSocialPost onPostCreated={cargarPosts} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-3xl text-slate-900 tracking-tight">Novedades</h3>
          <button type="button" className="text-sm text-blue-700 font-bold hover:text-blue-900">Ver todo</button>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <article className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">Aun no hay publicaciones en el muro.</p>
            </article>
          ) : (
            posts.map((post, index) => {
              const postId = post?._id?.$oid || post?.id || `post-${index}`;
              const autor = post?.user || post?.usuario || post?.usuario_id || 'Usuario';
              const contenido = post?.content || post?.contenido || post?.text || '';
              return (
                <article key={postId} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700 font-bold">
                      {autor ? autor[0].toUpperCase() : '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{autor}</p>
                      <p className="text-xs text-slate-500">{post.date || post.fecha || 'Reciente'}</p>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-sm mb-4">{contenido}</p>

                  {post.image && (
                    <div className="relative overflow-hidden rounded-xl border border-slate-100">
                      <img
                        src={post.image}
                        className="w-full h-auto max-h-[400px] object-cover"
                        alt="Imagen de la publicacion"
                      />
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex gap-4 text-slate-500 mb-3 text-sm">
                      <button
                        onClick={() => agregarLike(postId)}
                        className={`font-semibold transition-colors flex items-center gap-1 ${
                          usuarioLikes[postId] ? 'text-rose-600' : 'hover:text-rose-600'
                        }`}
                      >
                        {usuarioLikes[postId] ? '❤️' : '🤍'} {likes[postId] || 0}
                      </button>
                      <button
                        onClick={() => setPostSeleccionado(postId)}
                        className="font-semibold hover:text-blue-600 transition-colors flex items-center gap-1"
                      >
                        💬 {comentarios[postId]?.length || 0}
                      </button>
                    </div>

                    {postSeleccionado === postId && (
                      <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-200">
                        {comentarios[postId]?.length === 0 ? (
                          <p className="text-xs text-slate-500">No hay comentarios aun</p>
                        ) : (
                          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                            {comentarios[postId]?.map((com, idx) => (
                              <div key={idx} className="bg-white p-2 rounded-lg text-xs border border-slate-100">
                                <p className="font-bold text-slate-800">{com.usuario_nombre}</p>
                                <p className="text-slate-700">{com.contenido}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <textarea
                          value={textoComentario}
                          onChange={(e) => setTextoComentario(e.target.value)}
                          placeholder="Escribe un comentario..."
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          rows="2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => agregarComentario(postId)}
                            disabled={!textoComentario.trim()}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
                          >
                            Comentar
                          </button>
                          <button
                            onClick={() => {
                              setPostSeleccionado(null);
                              setTextoComentario('');
                            }}
                            className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-300"
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <article className="rounded-2xl bg-[#052a6b] text-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Tip del dia</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-100">
            Usa el comando /chat para obtener respuestas resumidas desde la wiki y los documentos.
          </p>
        </article>

        <article className="rounded-2xl bg-white border border-slate-200 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold">Actividad</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{totalLikes}</p>
          <p className="text-sm text-slate-500">Interacciones de esta semana</p>
        </article>
      </aside>
    </div>
  );
}
