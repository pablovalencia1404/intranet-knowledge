import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
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
        {/* Busca el div de la foto y pon esto en su lugar */}
        <Link to="/perfil" className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs hover:bg-slate-600 transition-colors">
            👤
        </Link>
      </div>
    </nav>
  );
}