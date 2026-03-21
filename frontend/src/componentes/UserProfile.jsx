// UserProfile.jsx
import React from 'react';

export default function UserProfile({ usuario }) {
  // Estadísticas (podrían venir de la API en el futuro)
  const stats = [
    { label: "Posts", value: "12" },
    { label: "Documentos", value: "5" },
    { label: "Rol", value: usuario?.rol || "Usuario" }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible relative">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl"></div>
        
        <div className="relative px-8 pb-8">
          <div className="absolute -top-12 left-8 w-24 h-24 bg-slate-800 rounded-2xl border-4 border-white flex items-center justify-center text-4xl shadow-lg text-white font-bold">
            {usuario?.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="mt-16 space-y-2">
            {/* Nombre dinámico del usuario logueado */}
            <h2 className="text-3xl font-black text-gray-950 tracking-tighter">
              {usuario?.nombre || "Usuario"}
            </h2>
            
            <p className="text-blue-600 font-semibold text-sm">
              {usuario?.email}
            </p>
            
            <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-xl">
              Bienvenido a tu perfil de la Intranet. Aquí puedes gestionar tu información personal y revisar tu actividad.
            </p>

            <div className="flex gap-10 mt-10 border-t border-gray-100 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}