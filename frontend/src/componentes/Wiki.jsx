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
  const [modoEditor, setModoEditor] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [mensajeEdicion, setMensajeEdicion] = useState('');

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
    setMensajeEdicion('');
  };

  const abrirEditorCrear = () => {
    setMensajeEdicion('');
    setEditTitle('');
    setEditBody('');
    setModoEditor('crear');
  };

  const abrirEditorEditar = () => {
    if (!activePage) {
      return;
    }

    setMensajeEdicion('');
    setEditTitle(activePage.title || '');
    setEditBody(activePage.body || '');
    setModoEditor('editar');
  };

  const cerrarEditor = () => {
    setModoEditor(null);
    setEditTitle('');
    setEditBody('');
  };

  const guardarPagina = async () => {
    const tituloLimpio = editTitle.trim();
    const cuerpoLimpio = editBody.trim();

    if (!tituloLimpio) {
      setMensajeEdicion('El titulo es obligatorio.');
      return;
    }

    if (!cuerpoLimpio) {
      setMensajeEdicion('El contenido es obligatorio.');
      return;
    }

    try {
      setGuardando(true);
      setMensajeEdicion('');

      let nuevaPaginaActivaId = activePage?.id || null;

      const librosActualizados = biblioteca.map((libro) => {
        if (libro.id !== activeBook.id) {
          return libro;
        }

        if (modoEditor === 'crear') {
          const nuevaPaginaId = `page-${Date.now()}`;
          nuevaPaginaActivaId = nuevaPaginaId;
          return {
            ...libro,
            pages: [
              ...libro.pages,
              { id: nuevaPaginaId, title: tituloLimpio, body: cuerpoLimpio }
            ],
          };
        }

        return {
          ...libro,
          pages: libro.pages.map((page) => (
            page.id === activePage?.id
              ? { ...page, title: tituloLimpio, body: cuerpoLimpio }
              : page
          )),
        };
      });

      const res = await fetch(`${API_URL}/wiki/crear_w.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ biblioteca: librosActualizados }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setBiblioteca(librosActualizados);

      const libroActualizado = librosActualizados.find((libro) => libro.id === activeBook.id) || activeBook;
      setActiveBook(libroActualizado);

      const paginaActualizada = libroActualizado.pages.find((page) => page.id === nuevaPaginaActivaId)
        || libroActualizado.pages[0]
        || null;
      setActivePage(paginaActualizada);

      setMensajeEdicion(modoEditor === 'crear' ? 'Pagina creada correctamente.' : 'Pagina actualizada correctamente.');
      cerrarEditor();
    } catch (err) {
      setMensajeEdicion(`No se pudo guardar la pagina: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };
  if (cargando) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 my-6 min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">Cargando wiki...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 my-6 min-h-[70vh] lg:h-[85vh] animate-in fade-in duration-500 overflow-hidden">
      <div className="px-6 py-4 bg-[#0f172a] text-white flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-blue-300 font-bold">Biblioteca</p>
          <h3 className="text-lg font-extrabold">Centro de conocimiento</h3>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row h-full">

        <aside className="w-full md:w-[36%] bg-slate-50 border-r border-slate-200 p-5 space-y-6 overflow-y-auto">
          <h4 className="text-[11px] uppercase font-bold text-blue-700 tracking-[0.15em]">Biblioteca institucional</h4>
          <div className="space-y-4">
            {biblioteca.map(libro => (
              <div 
                key={libro.id} 
                onClick={() => handleBookChange(libro)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeBook.id === libro.id 
                    ? 'bg-blue-600 text-white shadow-md border-blue-600' 
                    : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'
                }`}
              >
                <p className="font-bold text-sm truncate">{libro.title}</p>
                <p className={`text-[10px] mt-1 ${activeBook.id === libro.id ? 'text-blue-100' : 'text-slate-400'}`}>
                  Contiene {libro.pages.length} páginas de documentación.
                </p>
              </div>
            ))}
          </div>
        </aside>

        <main className="w-full md:w-[64%] p-5 md:p-8 overflow-y-auto">
          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold uppercase tracking-wider">Manual activo</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">{activeBook?.title || 'Sin libro activo'}</h2>
          <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={abrirEditorEditar}
                disabled={guardando || !activePage}
                className="text-xs px-3 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                ✏️ Editar Página
              </button>
              <button
                type="button"
                onClick={abrirEditorCrear}
                disabled={guardando}
                className="text-xs px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50"
              >
                ➕ Nueva Página
              </button>
            </div>
          {mensajeEdicion && (
            <p className="mt-2 text-xs text-slate-600">{mensajeEdicion}</p>
          )}
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

            {modoEditor && (
              <div className="fixed inset-0 bg-black/40 flex items-end z-50">
                <div className="bg-white w-full md:w-2/3 rounded-t-2xl p-6 space-y-4 animate-in slide-in-from-bottom">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                      {modoEditor === 'crear' ? 'Nueva Pagina' : 'Editar Pagina'}
                    </h3>
                    <button
                      type="button"
                      onClick={cerrarEditor}
                      className="text-2xl text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">Título</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Título de la página"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">Contenido</label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                      rows="10"
                      placeholder="Escribe el contenido aquí..."
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={cerrarEditor}
                      disabled={guardando}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={guardarPagina}
                      disabled={guardando}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                      {guardando ? '⏳ Guardando...' : '💾 Guardar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          
          <div className="mt-8 space-y-4">
            <h4 className="font-bold text-slate-800">Indice del manual</h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {(activeBook?.pages || []).map((page) => (
                <button
                  type="button"
                  key={page.id}
                  onClick={() => setActivePage(page)}
                  className={`w-full flex gap-3 items-center p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    activePage?.id === page.id
                      ? 'border-blue-300 bg-blue-50 text-blue-900'
                      : 'bg-white border-slate-200 hover:border-blue-100'
                  }`}
                >
                  <span className="text-sm font-bold text-slate-500">PAG</span>
                  <p className="text-sm font-semibold text-slate-800">{page.title}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mb-2">Página seleccionada</p>
              <h5 className="text-2xl font-extrabold text-slate-900 mb-3">{activePage?.title || 'Sin pagina seleccionada'}</h5>
              <p className="text-base text-slate-700 leading-relaxed">{activePage?.body || 'Selecciona una pagina del indice para ver su contenido.'}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}