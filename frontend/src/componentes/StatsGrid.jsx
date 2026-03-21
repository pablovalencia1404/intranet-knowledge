import React, { useState, useEffect } from 'react';

export default function StatsGrid() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [stats, setStats] = useState({ docs: 0, foro: 0, usuarios: 0 });

  useEffect(() => {
    const extraerLista = (data) => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.datos)) return data.datos;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.foro)) return data.foro;
      return [];
    };

    Promise.all([
      fetch(`${API_URL}/documentos/leer_d.php`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_URL}/posts/leer_p.php`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API_URL}/usuarios/leer_u.php`, { credentials: 'include' }).then(r => r.json()),
    ])
      .then(([docs, foro, usuarios]) => {
        setStats({
          docs: extraerLista(docs).length,
          foro: extraerLista(foro).length,
          usuarios: extraerLista(usuarios).length,
        });
      })
      .catch(err => console.error("Error en stats", err));
  }, []);

  const items = [
    { label: "Documentos", value: stats.docs, icon: "DOC", color: "text-blue-600" },
    { label: "Debates", value: stats.foro, icon: "FORO", color: "text-orange-600" },
    { label: "Miembros", value: stats.usuarios, icon: "USR", color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {items.map((s, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
          <span className="text-3xl opacity-20">{s.icon}</span>
        </div>
      ))}
    </div>
  );
}