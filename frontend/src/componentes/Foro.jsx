import React, { useState } from 'react';

export default function Foro() {
  // Simulamos los debates que nos daría el Backend de Chen
  const [debates] = useState([
    { id: 1, user: "Alfonso", text: "Propuesta para el desayuno mensual de IT 🥐", replies: 12, cat: "Sugerencias" },
    { id: 2, user: "Juan P.", text: "¿Alguien sabe cómo configurar la VPN nueva?", replies: 25, cat: "Soporte Técnico" },
    { id: 3, user: "Soporte", text: "Mantenimiento del servidor: sábado 22 de marzo", replies: 0, cat: "Anuncios" }
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 my-6 animate-in fade-in duration-500 overflow-hidden">
      
      {/* Cabecera profesional */}
      <div className="p-3 bg-orange-600 text-white flex items-center justify-between text-xs font-bold px-5">
        <span>💬 FORO DE DEBATE - Hilos y Respuestas (Flarum UI Mock)</span>
        <button className="bg-white text-orange-600 px-3 py-1 rounded-lg font-bold text-[10px] hover:bg-gray-100 transition-colors shadow-sm">
          + Nuevo Debate
        </button>
      </div>
      
      <div className="p-4 space-y-1">
        {debates.map(debate => (
          <div key={debate.id} className="flex items-start justify-between p-5 rounded-xl hover:bg-gray-50/50 transition-all cursor-pointer group">
            <div className="flex gap-4 items-start">
              {/* Avatar del usuario (simulado) */}
              <div className="w-12 h-12 bg-slate-800 rounded-2xl border-4 border-gray-100 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                👤
              </div>
              
              <div className="space-y-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  debate.cat === 'Anuncios' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {debate.cat}
                </span>
                <h4 className="text-base font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {debate.text}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1">Publicado por {debate.user} • Activo hoy</p>
              </div>
            </div>

            {/* Contador de respuestas */}
            <div className="text-right flex-shrink-0 ml-10">
              <p className="text-2xl font-black text-gray-950 tracking-tighter">{debate.replies}</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Respuestas</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}