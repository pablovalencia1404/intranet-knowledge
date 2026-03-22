import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NuevoPost from './NuevoPost';
import TemaDetalle from './TemaDetalle';

const TAGS = ['#Innovacion', '#Cultura', '#Eventos', '#Seguridad', '#Productividad', '#UXDesign'];

function fechaLegible(fechaIso) {
  if (!fechaIso) {
    return 'Sin fecha';
  }
  const date = new Date(fechaIso);
  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function Foro() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [debates, setDebates] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarNuevoTema, setMostrarNuevoTema] = useState(false);
  const [filtro, setFiltro] = useState('recientes');
  const [tagActiva, setTagActiva] = useState('');

  const cargarDebates = async () => {
    try {
      const res = await fetch(`${API_URL}/posts/leer_p.php`, {
        credentials: 'include',
      });
      const data = await res.json();

      const lista = Array.isArray(data?.foro) ? data.foro : [];
      const temas = lista.filter((item) => !item.tema_padre_id && String(item?.categoria || item?.titulo_hilo || '').toLowerCase() !== 'muro social');
      const respuestas = lista.filter((item) => Boolean(item?.tema_padre_id));

      const countsRes = await Promise.all(
        temas.map(async (tema) => {
          const id = tema?._id?.$oid || tema?.id || '';
          if (!id) {
            return { id: '', likes: 0, comentarios: 0 };
          }
          try {
            const r = await fetch(`${API_URL}/posts/leer_lc.php?post_id=${id}`, { credentials: 'include' });
            const json = await r.json();
            return {
              id,
              likes: Number(json?.total_likes || 0),
              comentarios: Number(json?.total_comentarios || 0),
            };
          } catch {
            return { id, likes: 0, comentarios: 0 };
          }
        })
      );

      const countsMap = countsRes.reduce((acc, item) => {
        if (item.id) {
          acc[item.id] = item;
        }
        return acc;
      }, {});

      const normalizados = temas.map((item, index) => {
        const id = item?._id?.$oid || item?.id || `debate-${index}`;
        const replies = respuestas.filter((r) => String(r?.tema_padre_id || '') === String(id)).length;
        const counts = countsMap[id] || { likes: 0, comentarios: 0 };

        return {
          id,
          text: item?.titulo_hilo || item?.contenido || item?.content || 'Sin contenido',
          excerpt: String(item?.contenido || item?.content || 'Sin descripcion disponible.').slice(0, 170),
          user: item?.user || item?.usuario || item?.usuario_id || 'Usuario',
          cat: item?.categoria || item?.titulo_hilo || 'General',
          fecha: item?.fecha || '',
          replies,
          likes: counts.likes,
          comentarios: counts.comentarios,
          actividad: replies + counts.comentarios + counts.likes,
        };
      });

      setDebates(normalizados);
    } catch {
      setDebates([]);
    }
  };

  useEffect(() => {
    cargarDebates();
  }, []);

  const expertos = useMemo(() => {
    const actividadPorUsuario = debates.reduce((acc, debate) => {
      const nombre = String(debate.user || 'Usuario');
      acc[nombre] = (acc[nombre] || 0) + Number(debate.actividad || 0);
      return acc;
    }, {});

    return Object.entries(actividadPorUsuario)
      .map(([nombre, puntos]) => ({ nombre, rol: 'Colaborador', puntos }))
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 3);
  }, [debates]);

  const debatesFiltrados = useMemo(() => {
    let list = [...debates];

    if (tagActiva) {
      const tag = tagActiva.replace('#', '').toLowerCase();
      list = list.filter((d) => String(d.cat || '').toLowerCase().includes(tag));
    }

    if (filtro === 'populares') {
      list.sort((a, b) => b.actividad - a.actividad);
    } else if (filtro === 'sin-respuesta') {
      list = list.filter((d) => d.replies === 0 && d.comentarios === 0);
      list.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    } else {
      list.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
    }

    return list;
  }, [debates, filtro, tagActiva]);

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
            <button type="button" onClick={() => setFiltro('recientes')} className={filtro === 'recientes' ? 'text-blue-700' : 'text-slate-600'}>Recientes</button>
            <button type="button" onClick={() => setFiltro('populares')} className={filtro === 'populares' ? 'text-blue-700' : 'text-slate-600'}>Populares</button>
            <button type="button" onClick={() => setFiltro('sin-respuesta')} className={filtro === 'sin-respuesta' ? 'text-blue-700' : 'text-slate-600'}>Sin respuesta</button>
          </div>
          <span className="text-slate-400 text-sm">{debatesFiltrados.length} temas</span>
        </div>

        <div className="mt-4 space-y-3">
          {debatesFiltrados.length === 0 && (
            <article className="rounded-2xl bg-white border border-slate-200 p-6 text-slate-500">
              No hay temas para este filtro. Prueba cambiar de vista o crear un nuevo tema.
            </article>
          )}

          {debatesFiltrados.map((debate) => (
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
                    <span className="text-xs text-slate-400">{fechaLegible(debate.fecha)}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{debate.text}</h3>
                  <p className="mt-2 text-slate-600 text-sm leading-relaxed">{debate.excerpt}...</p>
                  <div className="mt-4 flex items-center gap-6 text-xs text-slate-500 font-semibold">
                    <span>💬 {debate.replies} respuestas</span>
                    <span>🗨 {debate.comentarios} comentarios</span>
                    <span>❤️ {debate.likes} likes</span>
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
              <button
                type="button"
                key={tag}
                onClick={() => setTagActiva((prev) => (prev === tag ? '' : tag))}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tagActiva === tag ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white border border-slate-200 p-5">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-600">Expertos activos</h4>
          <div className="mt-4 space-y-3">
            {expertos.length === 0 && <p className="text-sm text-slate-500">Aun no hay actividad suficiente.</p>}
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
          <Link to="/wiki" className="inline-block mt-4 text-sm font-bold text-white hover:text-cyan-200 transition-colors">
            Ir a la Wiki →
          </Link>
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
