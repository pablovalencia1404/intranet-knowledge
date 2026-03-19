import React from 'react';

export default function DocumentManager() {
  const docs = [
    { name: "Normativa_Teletrabajo_2026.pdf", size: "1.2 MB", date: "15 Mar" },
    { name: "Calendario_Festivos.docx", size: "850 KB", date: "10 Mar" },
    { name: "Guia_Bienvenida_Nuevos.pdf", size: "4.5 MB", date: "01 Mar" }
  ];

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden my-6">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className="text-xl">📁</span>
        <h3 className="font-bold text-gray-800 tracking-tight">Biblioteca de Documentos</h3>
      </div>

      {/* Zona de carga visual */}
      <div className="p-6 border-2 border-dashed border-gray-200 m-4 rounded-xl text-center bg-gray-50/50 hover:bg-white hover:border-blue-400 transition-all cursor-pointer group">
        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📤</div>
        <p className="text-sm text-gray-600 font-semibold">Subir nuevo documento</p>
        <p className="text-xs text-gray-400 mt-1">Arrastra aquí o haz clic para buscar</p>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre del archivo</h4>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acción</h4>
        </div>
        
        <div className="space-y-1">
          {docs.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-blue-50/30 rounded-lg transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded flex items-center justify-center text-lg group-hover:bg-white shadow-sm transition-colors">
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{doc.name}</p>
                  <p className="text-[10px] text-gray-400">{doc.size} • Modificado el {doc.date}</p>
                </div>
              </div>
              <button className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                📥
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}