import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ usuario, onLogout }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const mostrarResultados = useMemo(() => busqueda.trim().length >= 2, [busqueda]);

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  if (!usuario) {
    return null;
  }

  const buscarGlobal = async (texto) => {
    const q = texto.trim().toLowerCase();
    if (q.length < 2) {
      setResultados([]);
      return;
    }

    setBuscando(true);
    try {
      const [docsRes, postsRes, wikiRes] = await Promise.all([
        fetch(`${API_URL}/documentos/leer_d.php`, { credentials: 'include' }).then((r) => r.json()),
        fetch(`${API_URL}/posts/leer_p.php`, { credentials: 'include' }).then((r) => r.json()),
        fetch(`${API_URL}/wiki/leer_w.php`, { credentials: 'include' }).then((r) => r.json()),
      ]);

      const docs = Array.isArray(docsRes?.datos) ? docsRes.datos : [];
      const posts = Array.isArray(postsRes?.foro) ? postsRes.foro : [];
      const libros = Array.isArray(wikiRes?.biblioteca) ? wikiRes.biblioteca : [];

      const docsMatches = docs
        .filter((d) => `${d?.titulo || d?.nombre || ''}`.toLowerCase().includes(q))
        .slice(0, 3)
        .map((d) => ({
          id: d?._id?.$oid || d?.id || Math.random().toString(36),
          tipo: 'Documento',
          titulo: d?.titulo || d?.nombre || 'Documento',
          to: '/documentos',
        }));

      const postMatches = posts
        .filter((p) => `${p?.titulo_hilo || ''} ${p?.contenido || ''}`.toLowerCase().includes(q))
        .slice(0, 3)
        .map((p) => ({
          id: p?._id?.$oid || p?.id || Math.random().toString(36),
          tipo: 'Foro',
          titulo: p?.titulo_hilo || (p?.contenido || '').slice(0, 36) || 'Tema',
          to: '/foro',
        }));

      const wikiMatches = libros
        .flatMap((l) => (Array.isArray(l?.pages) ? l.pages.map((pg) => ({ libro: l, pagina: pg })) : []))
        .filter((item) => `${item?.libro?.title || ''} ${item?.pagina?.title || ''} ${item?.pagina?.body || ''}`.toLowerCase().includes(q))
        .slice(0, 3)
        .map((item, idx) => ({
          id: `${item?.pagina?.id || idx}`,
          tipo: 'Wiki',
          titulo: `${item?.libro?.title || 'Manual'} > ${item?.pagina?.title || 'Pagina'}`,
          to: '/wiki',
        }));

      setResultados([...wikiMatches, ...docsMatches, ...postMatches].slice(0, 8));
    } catch (e) {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  };

  const onSubmitBusqueda = (e) => {
    e.preventDefault();
    if (resultados.length > 0) {
      navigate(resultados[0].to);
      setBusqueda('');
      setResultados([]);
      return;
    }
    navigate('/wiki');
  };

  const navItems = [
    { to: '/wiki', label: 'Wiki' },
    { to: '/foro', label: 'Foro' },
    { to: '/documentos', label: 'Documentos' },
    { to: '/social', label: 'Red Social' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0f172a] text-white shadow-[0_8px_30px_rgba(15,23,42,0.35)] border-b border-slate-800/80">
      <div className="w-full px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-[#2563eb] p-1.5 rounded-lg font-black text-xl group-hover:bg-[#1d4ed8] transition-colors">IK</div>
          <span className="font-extrabold tracking-tight text-xl">Intranet</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-semibold rounded-lg transition ${
                  isActive
                    ? 'bg-[#2563eb] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3 relative">
          <form onSubmit={onSubmitBusqueda} className="hidden lg:flex items-center h-10 bg-white/10 border border-white/15 rounded-xl px-3 w-72">
            <span className="text-slate-300 text-xs mr-2">🔎</span>
            <input
              value={busqueda}
              onChange={(e) => {
                const next = e.target.value;
                setBusqueda(next);
                buscarGlobal(next);
              }}
              placeholder="Buscar en wiki, foro y documentos..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-300/80 outline-none"
            />
          </form>

          {mostrarResultados && (
            <div className="hidden lg:block absolute right-24 top-12 w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              {buscando ? (
                <p className="px-4 py-3 text-sm text-slate-500">Buscando...</p>
              ) : resultados.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">Sin resultados para "{busqueda}"</p>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {resultados.map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => {
                        navigate(r.to);
                        setBusqueda('');
                        setResultados([]);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
                    >
                      <p className="text-[11px] uppercase tracking-[0.12em] text-blue-700 font-bold">{r.tipo}</p>
                      <p className="text-sm text-slate-800 font-semibold truncate">{r.titulo}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="hidden sm:block text-sm text-slate-300 font-medium">
            {usuario.nombre || 'Usuario'}
          </div>
          <div className="relative group">
            <Link to="/perfil" className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600/80 flex items-center justify-center text-xs font-bold hover:bg-slate-600 transition-colors">
              {usuario?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </Link>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-100">
              <Link 
                to="/perfil" 
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm rounded-t-lg"
              >
                Mi perfil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm rounded-b-lg border-t"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}