import React, { useEffect, useMemo, useState } from 'react';
import NuevoPost from './NuevoPost';
import TemaDetalle from './TemaDetalle';

const TAGS = ['#Innovacion', '#Cultura', '#Eventos', '#Seguridad', '#Productividad', '#UXDesign'];

export default function Foro() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [debates, setDebates] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarNuevoTema, setMostrarNuevoTema] = useState(false);

  const cargarDebates = () => {
    fetch(`${API_URL}/posts/leer_p.php`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data.foro)
            ? data.foro
            : Array.isArray(data.datos)
              ? data.datos
              : [];

        const normalizados = lista
          .filter((item) => !item.tema_padre_id)
          .map((item, index) => ({
            id: item?._id?.$oid || item?.id || `debate-${index}`,
            text: item?.titulo_hilo || item?.contenido || item?.content || 'Sin contenido',
            excerpt: (item?.contenido || item?.content || 'Sin descripción disponible.').slice(0, 170),
            user: item?.user || item?.usuario || item?.usuario_id || 'Usuario',
            cat: item?.categoria || 'General',
            replies: Number(item?.replies || item?.respuestas || 0),
          }));

        setDebates(normalizados);
      })
      .catch(() => {
        setDebates([]);
      });
  };

  useEffect(() => {
    cargarDebates();
  }, []);

  const expertos = useMemo(() => {
    const base = debates.slice(0, 3);
    if (base.length === 0) {
      return [
        { nombre: 'Elena Rivas', rol: 'Arquitecto de Soluciones', puntos: 42 },
        { nombre: 'Marcos S.', rol: 'Head of Culture', puntos: 38 },
        { nombre: 'Sofia Mendez', rol: 'Senior UX Lead', puntos: 15 },
      ];
    }

    return base.map((item, index) => ({
      nombre: item.user,
      rol: item.cat,
      puntos: 15 + (index + 1) * 9,
    }));
  }, [debates]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 my-6">
      <section>
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-5xl font-extrabold tracking-tight text-slate-900">Comunidad & Foros</h2>
            <p className="mt-2 text-slate-600 text-lg">Conecta, colabora y comparte conocimiento institucional.</p>
          </div>
          <button
            type="button"
            onClick={() => setMostrarNuevoTema(true)}
            className="h-11 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            + Nuevo tema
          </button>
        </header>

        <div className="mt-6 rounded-xl bg-slate-100 border border-slate-200 p-3 flex items-center justify-between">
          <div className="flex items-center gap-5 text-sm font-semibold">
            <button type="button" className="text-blue-700">Recientes</button>
            <button type="button" className="text-slate-600">Populares</button>
            <button type="button" className="text-slate-600">Sin respuesta</button>
          </div>
          <span className="text-slate-400 text-sm">☷</span>
        </div>

        <div className="mt-4 space-y-3">
          {debates.length === 0 && (
            <article className="rounded-2xl bg-white border border-slate-200 p-6 text-slate-500">
              Aun no hay debates. Crea el primer tema para iniciar la conversación.
            </article>
          )}

          {debates.map((debate, index) => (
            <button
              key={debate.id}
              type="button"
              onClick={() => setTemaSeleccionado(debate)}
              className="w-full text-left rounded-2xl bg-white border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                      {debate.cat}
                    </span>
                    <span className="text-xs text-slate-400">hace {2 + index} horas</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{debate.text}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{debate.excerpt}...</p>
                  <div className="mt-4 flex items-center gap-6 text-xs text-slate-500 font-semibold">
                    <span>💬 {debate.replies} comentarios</span>
                    <span>👁 {120 + index * 220} vistas</span>
                  </div>
                </div>
                <div className="h-11 w-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  {debate.user?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <article className="rounded-2xl bg-white border border-slate-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600">Etiquetas populares</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white border border-slate-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600">Expertos activos</h4>
          <div className="mt-4 space-y-3">
            {expertos.map((experto, index) => (
              <div key={`${experto.nombre}-${index}`} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center">
                    {experto.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{experto.nombre}</p>
                    <p className="text-xs text-slate-500 truncate">{experto.rol}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-700">{experto.puntos} pts</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-[#052a6b] text-white p-6">
          <h4 className="text-3xl font-extrabold leading-tight">¿Buscas algo especifico?</h4>
          <p className="mt-3 text-sm text-blue-100">
            Consulta nuestra wiki centralizada antes de abrir un nuevo hilo.
          </p>
          <button type="button" className="mt-4 text-sm font-bold text-white hover:text-cyan-200 transition-colors">
            Ir a la Wiki →
          </button>
        </article>
      </aside>

      {mostrarNuevoTema && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <NuevoPost
              alEnviar={() => {
                cargarDebates();
                setMostrarNuevoTema(false);
              }}
            />
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => setMostrarNuevoTema(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

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
