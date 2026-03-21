import React, { useState } from 'react';

export default function Wiki() {
  // Simulamos los datos que nos daría el Backend de Chen
  const [wikiContent] = useState({
    biblioteca: [
      {
        id: 1,
        title: "🚀 Manual de Onboarding",
        pages: [
          {
            id: "onb-1",
            title: "Bienvenida",
            body: "Bienvenido a Intranet Knowledge. Esta guía te ayudará en tu primera semana para configurar accesos, entorno de trabajo y herramientas internas."
          },
          {
            id: "onb-2",
            title: "Instalación VPN",
            body: "Descarga el cliente oficial desde el portal IT, usa tus credenciales corporativas y valida la conexión con el recurso interno de prueba."
          },
          {
            id: "onb-3",
            title: "Herramientas IT",
            body: "Solicita acceso a correo, repositorio, gestor de tareas y panel de incidencias. Revisa también el protocolo de soporte y escalado."
          }
        ]
      },
      {
        id: 2,
        title: "⚖️ Política de Empresa",
        pages: [
          {
            id: "pol-1",
            title: "Código de Conducta",
            body: "Se espera un comportamiento profesional, respeto entre equipos y cumplimiento del reglamento interno en canales online y presenciales."
          },
          {
            id: "pol-2",
            title: "Seguridad de Datos",
            body: "No compartas credenciales, usa MFA cuando aplique y reporta cualquier incidente al equipo de seguridad en menos de 24 horas."
          },
          {
            id: "pol-3",
            title: "Vacaciones",
            body: "Las vacaciones deben solicitarse con antelación en el portal de RRHH y ser aprobadas por el responsable de área antes de su disfrute."
          }
        ]
      }
    ]
  });

  const [activeBook, setActiveBook] = useState(wikiContent.biblioteca[0]);
  const [activePage, setActivePage] = useState(wikiContent.biblioteca[0].pages[0]);

  const handleBookChange = (libro) => {
    setActiveBook(libro);
    setActivePage(libro.pages[0]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 my-6 min-h-[70vh] lg:h-[85vh] animate-in fade-in duration-500 overflow-hidden">
      
      {/* Cabecera profesional */}
      <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold px-5">
        <span>📚 WIKI CORPORATIVA - Centro de Conocimiento (BookStack UI Mock)</span>
      </div>
      
      {/* Contenedor principal de dos columnas */}
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Columna Izquierda: Libros y Capítulos */}
        <aside className="w-full md:w-1/3 bg-gray-50/50 border-r border-gray-100 p-6 space-y-8 overflow-y-auto">
          <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Biblioteca</h4>
          <div className="space-y-4">
            {wikiContent.biblioteca.map(libro => (
              <div 
                key={libro.id} 
                onClick={() => handleBookChange(libro)}
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
        <main className="w-full md:w-2/3 p-8 overflow-y-auto">
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Libro Activo</span>
          <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">{activeBook.title}</h2>
          
          <div className="mt-8 space-y-4">
            <h4 className="font-bold text-gray-800">📋 Índice del manual</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {activeBook.pages.map((page) => (
                <button
                  type="button"
                  key={page.id}
                  onClick={() => setActivePage(page)}
                  className={`w-full flex gap-3 items-center p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    activePage.id === page.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'bg-white border-gray-100 hover:border-blue-100'
                  }`}
                >
                  <span className="text-xl">📄</span>
                  <p className="text-sm font-medium text-gray-800">{page.title}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">Página seleccionada</p>
              <h5 className="text-lg font-black text-slate-900 mb-2">{activePage.title}</h5>
              <p className="text-sm text-slate-700 leading-relaxed">{activePage.body}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}