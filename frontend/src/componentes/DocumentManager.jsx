import React, { useState } from 'react';

export default function DocumentManager() {
  const [filtro, setFiltro] = useState("Todos");

  const docs = [
    { id: 1, name: "Plan_Estrategico_2026.pdf", cat: "Dirección", size: "2.4MB" },
    { id: 2, name: "Calendario_Laboral.png", cat: "RRHH", size: "1.1MB" },
    { id: 3, name: "Configuracion_Wifi.txt", cat: "IT", size: "12KB" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm my-6 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">📂 Archivos Compartidos</h3>
        {/* Filtros por Categoría (Punto 9 de la arquitectura) */}
        <select 
          onChange={(e) => setFiltro(e.target.value)}
          className="text-xs border rounded-md p-1 outline-none bg-white font-medium"
        >
          <option value="Todos">Todas las carpetas</option>
          <option value="RRHH">RRHH</option>
          <option value="IT">IT</option>
          <option value="Dirección">Dirección</option>
        </select>
      </div>

      <div className="p-4 space-y-2">
        {docs.filter(d => filtro === "Todos" || d.cat === filtro).map(doc => (
          <div key={doc.id} className="flex items-center justify-between p-3 hover:bg-blue-50/50 rounded-lg transition-all border border-transparent hover:border-blue-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">📄</span>
              <div>
                <p className="text-sm font-bold text-gray-700">{doc.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{doc.cat} • {doc.size}</p>
              </div>
            </div>
            <button className="text-blue-600 font-bold text-xs hover:underline">Descargar</button>
          </div>
        ))}
      </div>
    </div>
  );
}