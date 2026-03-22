// UserProfile.jsx
import React, { useEffect, useState } from 'react';

export default function UserProfile({ usuario }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [statsState, setStats] = useState([
    { label: 'Posts', value: 0 },
    { label: 'Documentos', value: 0 },
    { label: 'Rol', value: usuario?.rol || 'Usuario' },
  ]);
  const [bio, setBio] = useState(
    () => localStorage.getItem(`bio_${usuario?.id || usuario?.email || 'usuario'}`)
      || 'Bienvenido a tu panel personal. Desde aqui puedes gestionar tu informacion y revisar tu actividad en la intranet.'
  );

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const [postsRes, docsRes] = await Promise.all([
          fetch(`${API_URL}/posts/leer_p.php`, { credentials: 'include' }).then((r) => r.json()),
          fetch(`${API_URL}/documentos/leer_d.php`, { credentials: 'include' }).then((r) => r.json()),
        ]);

        const posts = Array.isArray(postsRes?.foro) ? postsRes.foro : [];
        const docs = Array.isArray(docsRes?.datos) ? docsRes.datos : [];

        const nombre = (usuario?.nombre || '').toLowerCase();
        const userId = String(usuario?.id || '');

        const misPosts = posts.filter((p) => {
          const pUser = String(p?.usuario_id || '').toLowerCase();
          const pName = String(p?.usuario || p?.user || '').toLowerCase();
          return (userId && pUser === userId) || (nombre && pName === nombre);
        }).length;

        const misDocs = docs.filter((d) => {
          const dUser = String(d?.subido_por_id || '').toLowerCase();
          const dName = String(d?.subido_por || '').toLowerCase();
          return (userId && dUser === userId) || (nombre && dName === nombre);
        }).length;

        setStats([
          { label: 'Posts', value: misPosts },
          { label: 'Documentos', value: misDocs },
          { label: 'Rol', value: usuario?.rol || 'Usuario' },
        ]);
      } catch (e) {
        setStats([
          { label: 'Posts', value: 0 },
          { label: 'Documentos', value: 0 },
          { label: 'Rol', value: usuario?.rol || 'Usuario' },
        ]);
      }
    };

    cargarStats();
  }, [API_URL, usuario]);

  const editarPerfil = () => {
    const nuevoTexto = window.prompt('Actualiza tu descripcion de perfil:', bio);
    if (typeof nuevoTexto === 'string' && nuevoTexto.trim()) {
      const limpia = nuevoTexto.trim();
      setBio(limpia);
      localStorage.setItem(`bio_${usuario?.id || usuario?.email || 'usuario'}`, limpia);
    }
  };

  const compartirPerfil = async () => {
    const enlace = `${window.location.origin}/perfil`;
    try {
      await navigator.clipboard.writeText(enlace);
      window.alert('Enlace del perfil copiado al portapapeles.');
    } catch (e) {
      window.prompt('Copia este enlace del perfil:', enlace);
    }
  };

  const stats = [
    { label: 'Posts', value: statsState[0]?.value ?? 0 },
    { label: 'Documentos', value: statsState[1]?.value ?? 0 },
    { label: 'Rol', value: statsState[2]?.value ?? (usuario?.rol || 'Usuario') }
  ];

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-[#2563eb] via-[#4f46e5] to-[#9333ea]"></div>

        <div className="relative px-6 md:px-8 pb-8">
          <div className="absolute -top-16 left-8 w-32 h-32 bg-slate-900 rounded-2xl border-4 border-white flex items-center justify-center text-5xl shadow-lg text-white font-bold">
            {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="pt-20 md:pt-24 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {usuario?.nombre || 'Usuario'}
              </h2>
              <p className="mt-2 text-slate-600 font-medium text-sm">{usuario?.email || 'sin-email@intranet.local'}</p>
              <p className="mt-5 text-slate-600 text-sm leading-relaxed max-w-2xl">
                {bio}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={editarPerfil}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Editar perfil
              </button>
              <button
                type="button"
                onClick={compartirPerfil}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors border border-slate-200"
              >
                Compartir
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-bold">{stat.label}</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}