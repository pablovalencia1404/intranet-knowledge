import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg font-black italic text-xl group-hover:bg-blue-500 transition-colors">IK</div>
          <span className="font-bold tracking-tight text-lg">Intranet</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/wiki" className="text-sm font-medium text-gray-300 hover:text-white">Wiki</Link>
          <Link to="/foro" className="text-sm font-medium text-gray-300 hover:text-white">Foro</Link>
          <Link to="/documentos" className="text-sm font-bold text-blue-400 hover:text-blue-300">Documentos</Link>
          <Link to="/social" className="text-sm font-bold text-blue-400 hover:text-blue-300">Red Social</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-300">
            {usuario.nombre}
          </div>
          <div className="relative group">
            <Link to="/perfil" className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs hover:bg-slate-600 transition-colors">
              U
            </Link>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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