// src/components/UserProfile.jsx (CORREGIDO)
import React from 'react';

export default function UserProfile() {
  const stats = [
    { label: "Posts", value: "12" },
    { label: "Documentos", value: "5" },
    { label: "Antigüedad", value: "2 años" }
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible relative">
        {/* Banner superior */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl"></div>
        
        {/* Contenedor relativo para el avatar superpuesto */}
        <div className="relative px-8 pb-8">
          {/* Foto de perfil (Avatar) SUPERPUESTA */}
          <div className="absolute -top-12 left-8 w-24 h-24 bg-slate-800 rounded-2xl border-4 border-white flex items-center justify-center text-4xl shadow-lg">
            {/* El flex, items-center y justify-center centran el icono */}
            U
          </div>

          <div className="mt-16 space-y-2"> {/* space-y-2 para dar aire entre líneas */}
            {/* Nombre visible del usuario */}
            <h2 className="text-3xl font-black text-gray-950 tracking-tighter">Alfonso</h2>
            
            <p className="text-blue-600 font-semibold text-sm">Frontend Developer • IT Department</p>
            
            <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-xl">
              Especialista en interfaces modernas con React y Tailwind. 
              Encargado de la nueva arquitectura de la Intranet corporativa.
            </p>

            {/* Estadísticas rápidas */}
            <div className="flex gap-10 mt-10 border-t border-gray-100 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</p>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Habilidades */}
            <div className="mt-8 flex gap-2 pt-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium border border-gray-200">React v19</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium border border-gray-200">Tailwind v4</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium border border-gray-200">JavaScript</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}