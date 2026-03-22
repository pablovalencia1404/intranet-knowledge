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
                Bienvenido a tu panel personal. Desde aquí puedes gestionar tu información y revisar tu actividad en la intranet.
              </p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                Editar perfil
              </button>
              <button className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors border border-slate-200">
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