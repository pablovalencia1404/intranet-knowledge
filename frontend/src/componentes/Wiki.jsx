import React, { useState } from 'react';

export default function Wiki() {
  // Simulamos los datos que nos daría el Backend de Chen
  const [wikiContent] = useState({
    biblioteca: [
      { id: 1, title: "🚀 Manual de Onboarding", pages: ["Bienvenida", "Instalación VPN", "Herramientas IT"] },
      { id: 2, title: "⚖️ Política de Empresa", pages: ["Código de Conducta", "Seguridad de Datos", "Vacaciones"] }
    ]
  });

  const [activeBook, setActiveBook] = useState(wikiContent.biblioteca[0]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 my-6 h-[85vh] animate-in fade-in duration-500 overflow-hidden">
      
      {/* Cabecera profesional */}
      <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold px-5">
        <span>📚 WIKI CORPORATIVA - Centro de Conocimiento (BookStack UI Mock)</span>
      </div>
      
      {/* Contenedor principal de dos columnas */}
      <div className="flex h-full">
        
        {/* Columna Izquierda: Libros y Capítulos */}
        <aside className="w-1/3 bg-gray-50/50 border-r border-gray-100 p-6 space-y-8 overflow-y-auto">
          <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Biblioteca</h4>
          <div className="space-y-4">
            {wikiContent.biblioteca.map(libro => (
              <div 
                key={libro.id} 
                onClick={() => setActiveBook(libro)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeBook.id === libro.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white border-gray-100 hover:border-blue-100 hover:shadow-sm'
                }`}
              >
                <p className="font-bold text-sm truncate">{libro.title}</p>
                <p className={`text-[10px] mt-1 ${activeBook.id === libro.id ? 'text-blue-100' : 'text-gray-400'}`}>
                  Contiene {libro.pages.length} páginas de documentación.
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* Columna Derecha: Contenido del Libro Activo */}
        <main className="w-2/3 p-8 overflow-y-auto">
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Libro Activo</span>
          <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">{activeBook.title}</h2>
          
          <div className="mt-8 space-y-4">
            <h4 className="font-bold text-gray-800">📋 Índice del manual</h4>
            <div className="grid grid-cols-2 gap-3">
              {activeBook.pages.map((page, i) => (
                <div key={i} className="flex gap-3 items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-100 group transition-colors cursor-pointer">
                  <span className="text-xl">📄</span>
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{page}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}