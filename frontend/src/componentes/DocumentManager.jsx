import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from './FileUploader';

export default function DocumentManager() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [docs, setDocs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const uploaderRef = useRef(null);

  const cargarDocs = () => {
    setError('');
    fetch(`${API_URL}/documentos/leer_d.php`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.docs)
            ? data.docs
            : Array.isArray(data.datos)
              ? data.datos
              : [];
        setDocs(lista);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando documentos:", err);
        setError('No se pudieron cargar los documentos.');
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarDocs();
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-4 md:gap-6">
      <aside className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 h-fit xl:sticky xl:top-24">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-bold">Centro de Conocimiento</p>
        <h3 className="mt-1 text-xl font-extrabold text-slate-900">Biblioteca Institucional</h3>
        <p className="mt-2 text-sm text-slate-500">Gestiona archivos y documentación del equipo.</p>

        <button
          type="button"
          onClick={() => uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          className="mt-5 w-full rounded-xl bg-blue-600 text-white font-bold text-sm py-2.5 hover:bg-blue-700 transition-colors"
        >
          + Nuevo documento
        </button>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full text-left rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-2"
          >
            Mis documentos
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="w-full text-left rounded-lg text-slate-600 text-sm px-3 py-2 hover:bg-slate-100"
          >
            Historial
          </button>
          <Link to="/foro" className="block rounded-lg text-slate-600 text-sm px-3 py-2 hover:bg-slate-100">
            Canales de foro
          </Link>
        </div>
      </aside>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-bold">Biblioteca Institucional</p>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Biblioteca de Archivos</h2>
        <p className="text-slate-500 mt-3 text-sm md:text-base">
          Accede y gestiona toda la documentación técnica, manuales y recursos compartidos.
        </p>

        <div ref={uploaderRef} className="mt-6">
          <FileUploader onUploadSuccess={cargarDocs} />
        </div>

        {cargando ? (
          <p className="animate-pulse text-slate-500 text-sm">Buscando archivos...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : docs.length === 0 ? (
          <p className="text-sm text-slate-500">No hay documentos disponibles.</p>
        ) : (
          <div className="space-y-3">
            {docs.map((doc, index) => {
              const docId = doc?._id?.$oid || doc?.id || `doc-${index}`;
              const nombre = doc?.titulo || doc?.nombre || doc?.name || 'Archivo sin nombre';
              const url = doc?.url || '#';
              const subidopor = doc?.subido_por || 'Usuario';
              return (
                <article key={docId} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/60 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">📄</span>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-bold text-slate-800 truncate">{nombre}</p>
                      <p className="text-xs text-slate-500">Subido por {subidopor}</p>
                    </div>
                  </div>
                  {url !== '#' ? (
                    <a
                      href={url}
                      download
                      className="text-xs font-bold text-blue-700 rounded-lg border border-blue-200 px-3 py-1.5 bg-white hover:bg-blue-100 transition-colors"
                    >
                      Descargar
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Sin archivo</span>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}