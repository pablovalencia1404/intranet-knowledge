import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar({ usuario, onLogout }) {
  const navigate = useNavigate();

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

  const navItems = [
    { to: '/wiki', label: 'Wiki' },
    { to: '/foro', label: 'Foro' },
    { to: '/chatbot', label: 'Chatbot' },
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

        <div className="flex items-center gap-3">
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