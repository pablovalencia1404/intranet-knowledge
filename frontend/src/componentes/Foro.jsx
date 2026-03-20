import React, { useState, useEffect } from 'react';
import NuevoPost from './NuevoPost';

export default function Foro() {
  const [debates, setDebates] = useState([]);

  const cargarDebates = () => {
    fetch(`${import.meta.env.VITE_API_URL}/foro`)
      .then(res => res.json())
      .then(data => setDebates(data));
  };

  useEffect(() => { cargarDebates(); }, []);

  return (
    <div className="max-w-4xl mx-auto my-6">
      <NuevoPost alEnviar={cargarDebates} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 bg-orange-600 text-white text-xs font-bold px-5">💬 FORO</div>
        <div className="p-4">
          {debates.map(debate => (
            <div key={debate.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-lg">👤</div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{debate.text}</h4>
                  <p className="text-[10px] text-gray-400">Por {debate.user} • {debate.cat}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-black">{debate.replies}</p>
                <p className="text-[9px] text-gray-400 uppercase">Respuestas</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}