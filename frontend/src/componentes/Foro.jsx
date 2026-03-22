import React, { useState, useEffect } from 'react';
import NuevoPost from './NuevoPost';
import TemaDetalle from './TemaDetalle';

export default function Foro() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [debates, setDebates] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);

  const cargarDebates = () => {
    fetch(`${API_URL}/posts/leer_p.php`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.foro)
            ? data.foro
            : Array.isArray(data.datos)
              ? data.datos
              : [];

        const normalizados = lista.filter(item => !item.tema_padre_id).map((item, index) => ({
          id: item?._id?.$oid || item?.id || `debate-${index}`,
          text: item?.titulo_hilo || item?.contenido || item?.content || 'Sin contenido',
          user: item?.user || item?.usuario || item?.usuario_id || 'Usuario',
          cat: item?.categoria || 'General',
          replies: item?.replies || 0,
        }));

        setDebates(normalizados);
      });
  };

  useEffect(() => { cargarDebates(); }, []);

  return (
    <div className="max-w-4xl mx-auto my-6">
      <NuevoPost alEnviar={cargarDebates} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 bg-orange-600 text-white text-xs font-bold px-5">FORO</div>
        <div className="p-4">
          {debates.map(debate => (
            <button
              key={debate.id}
              onClick={() => setTemaSeleccionado(debate)}
              className="w-full text-left flex items-center justify-between p-4 border-b last:border-0 hover:bg-orange-50 transition-colors cursor-pointer group"
            >
              <div className="flex gap-4 items-center flex-1">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-orange-600 transition-colors">USR</div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 group-hover:text-orange-600">{debate.text}</h4>
                  <p className="text-[10px] text-gray-400">Por {debate.user} • {debate.cat}</p>
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <p className="text-xl font-black">{debate.replies}</p>
                <p className="text-[9px] text-gray-400 uppercase">Respuestas</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {temaSeleccionado && (
        <TemaDetalle
          temaid={temaSeleccionado.id}
          onClose={() => setTemaSeleccionado(null)}
          onRespuestaCreada={cargarDebates}
        />
      )}
    </div>
  );
}