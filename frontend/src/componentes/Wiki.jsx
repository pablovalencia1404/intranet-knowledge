import React, { useEffect, useMemo, useState } from 'react';

export default function Wiki() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

  const fallback = useMemo(() => ([
    {
      id: 1,
      title: "Manual de Onboarding",
      pages: [
        { id: "onb-1", title: "Bienvenida", body: "Bienvenido a Intranet Knowledge." },
        { id: "onb-2", title: "Instalación VPN", body: "Guía de conexión a la red interna." },
        { id: "onb-3", title: "Herramientas IT", body: "Lista de utilidades para el equipo." }
      ]
    }
  ]), []);

  const [biblioteca, setBiblioteca] = useState(fallback);
  const [activeBook, setActiveBook] = useState(fallback[0]);
  const [activePage, setActivePage] = useState(fallback[0].pages[0]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const cargarWiki = async () => {
      try {
        setError('');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(`${API_URL}/wiki/leer_w.php`, {
          credentials: 'include',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        const libros = Array.isArray(data?.biblioteca) && data.biblioteca.length > 0
          ? data.biblioteca
          : fallback;

        const normalizados = libros.map((libro, indexLibro) => ({
          id: libro.id || libro._id?.$oid || `book-${indexLibro}`,
          title: libro.title || libro.titulo || `Libro ${indexLibro + 1}`,
          pages: Array.isArray(libro.pages)
            ? libro.pages.map((pagina, indexPagina) => ({
                id: pagina.id || `page-${indexLibro}-${indexPagina}`,
                title: pagina.title || pagina.titulo || `Página ${indexPagina + 1}`,
                body: pagina.body || pagina.contenido || 'Contenido no disponible.',
              }))
            : [],
        })).filter((libro) => libro.pages.length > 0);

        const listaFinal = normalizados.length > 0 ? normalizados : fallback;
        setBiblioteca(listaFinal);
        setActiveBook(listaFinal[0]);
        setActivePage(listaFinal[0].pages[0]);
      } catch (err) {
        setError('No se pudo cargar la wiki desde el servidor. Se esta mostrando contenido local.');
        setBiblioteca(fallback);
        setActiveBook(fallback[0]);
        setActivePage(fallback[0].pages[0]);
      } finally {
        setCargando(false);
      }
    };

    setCargando(true);
    cargarWiki();
  }, [API_URL, fallback, reloadKey]);

  const handleBookChange = (libro) => {
    setActiveBook(libro);
    setActivePage(libro.pages?.[0] || null);
  };

  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 my-6 min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-gray-500">Cargando wiki...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 my-6 min-h-[70vh] lg:h-[85vh] animate-in fade-in duration-500 overflow-hidden">
      
      {/* Cabecera profesional */}
      <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold px-5">
        <span>WIKI CORPORATIVA - Centro de Conocimiento (BookStack UI Mock)</span>
      </div>
      
      {/* Contenedor principal de dos columnas */}
      <div className="flex flex-col md:flex-row h-full">
        
        {/* Columna Izquierda: Libros y Capítulos */}
        <aside className="w-full md:w-1/3 bg-gray-50/50 border-r border-gray-100 p-6 space-y-8 overflow-y-auto">
          <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Biblioteca</h4>
          <div className="space-y-4">
            {biblioteca.map(libro => (
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
          <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">{activeBook?.title || 'Sin libro activo'}</h2>
          {error && (
            <div className="mt-2 flex items-center gap-3">
              <p className="text-xs text-amber-700">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((v) => v + 1)}
                className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-800 font-bold"
              >
                Reintentar
              </button>
            </div>
          )}
          
          <div className="mt-8 space-y-4">
            <h4 className="font-bold text-gray-800">Indice del manual</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {(activeBook?.pages || []).map((page) => (
                <button
                  type="button"
                  key={page.id}
                  onClick={() => setActivePage(page)}
                  className={`w-full flex gap-3 items-center p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    activePage?.id === page.id
                      ? 'border-blue-300 bg-blue-50'
                      : 'bg-white border-gray-100 hover:border-blue-100'
                  }`}
                >
                  <span className="text-xl">DOC</span>
                  <p className="text-sm font-medium text-gray-800">{page.title}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">Página seleccionada</p>
              <h5 className="text-lg font-black text-slate-900 mb-2">{activePage?.title || 'Sin pagina seleccionada'}</h5>
              <p className="text-sm text-slate-700 leading-relaxed">{activePage?.body || 'Selecciona una pagina del indice para ver su contenido.'}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}