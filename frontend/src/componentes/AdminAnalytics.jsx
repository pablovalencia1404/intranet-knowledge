import React, { useEffect, useMemo, useState } from 'react';

function timestampFromAny(item) {
  const rawDate = item?.fecha || item?.createdAt || item?.updatedAt || item?.date || '';
  if (rawDate) {
    const d = new Date(rawDate);
    if (!Number.isNaN(d.getTime())) {
      return d.getTime();
    }
  }

  const oid = item?._id?.$oid || item?.id || '';
  if (typeof oid === 'string' && oid.length >= 8) {
    const seconds = parseInt(oid.slice(0, 8), 16);
    if (!Number.isNaN(seconds)) {
      return seconds * 1000;
    }
  }

  return 0;
}

function getList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.datos)) return data.datos;
  if (Array.isArray(data?.foro)) return data.foro;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.usuarios)) return data.usuarios;
  return [];
}

export default function AdminAnalytics({ usuario }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const [usersRes, docsRes, postsRes] = await Promise.all([
          fetch(`${API_URL}/usuarios/leer_u.php`, { credentials: 'include' }).then((r) => r.json()),
          fetch(`${API_URL}/documentos/leer_d.php`, { credentials: 'include' }).then((r) => r.json()),
          fetch(`${API_URL}/posts/leer_p.php`, { credentials: 'include' }).then((r) => r.json()),
        ]);

        if (cancelled) {
          return;
        }

        const allPosts = getList(postsRes);
        const onlyThreads = allPosts.filter((item) => !item?.tema_padre_id && String(item?.categoria || item?.titulo_hilo || '').toLowerCase() !== 'muro social');

        setUsuarios(getList(usersRes));
        setDocumentos(getList(docsRes));
        setTemas(onlyThreads);
      } catch {
        if (!cancelled) {
          setError('No se pudieron cargar las métricas de administración.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [API_URL]);

  const stats = useMemo(() => {
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

    const temasActivosSemana = temas.filter((t) => now - timestampFromAny(t) <= oneWeekMs).length;
    const docsNuevosSemana = documentos.filter((d) => now - timestampFromAny(d) <= oneWeekMs).length;

    const actividadPorUsuario = {};
    temas.forEach((tema) => {
      const key = String(tema?.user || tema?.usuario || tema?.usuario_id || tema?.autor || 'Usuario');
      actividadPorUsuario[key] = (actividadPorUsuario[key] || 0) + 1;
    });

    const topUsuarios = Object.entries(actividadPorUsuario)
      .map(([nombre, temasCreados]) => ({ nombre, temasCreados }))
      .sort((a, b) => b.temasCreados - a.temasCreados)
      .slice(0, 5);

    const actividadReciente = [...temas]
      .sort((a, b) => timestampFromAny(b) - timestampFromAny(a))
      .slice(0, 6)
      .map((tema) => ({
        id: tema?._id?.$oid || tema?.id || Math.random().toString(36),
        titulo: tema?.titulo_hilo || tema?.contenido || 'Tema sin título',
        usuario: String(tema?.user || tema?.usuario || tema?.usuario_id || 'Usuario'),
        fecha: timestampFromAny(tema),
      }));

    return {
      totalUsuarios: usuarios.length,
      totalDocumentos: documentos.length,
      totalTemas: temas.length,
      temasActivosSemana,
      docsNuevosSemana,
      topUsuarios,
      actividadReciente,
    };
  }, [usuarios, documentos, temas]);

  if (usuario?.rol !== 'admin') {
    return (
      <section className="my-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-black text-amber-900">Acceso restringido</h2>
        <p className="mt-2 text-sm text-amber-800">
          Este panel es solo para administradores.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="my-8 rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold text-slate-500">Cargando panel de analítica...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-700">{error}</p>
      </section>
    );
  }

  const cards = [
    { label: 'Usuarios', value: stats.totalUsuarios, accent: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Documentos', value: stats.totalDocumentos, accent: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Temas de foro', value: stats.totalTemas, accent: 'text-orange-700 bg-orange-50 border-orange-200' },
    { label: 'Actividad última semana', value: stats.temasActivosSemana + stats.docsNuevosSemana, accent: 'text-violet-700 bg-violet-50 border-violet-200' },
  ];

  return (
    <section className="my-6 space-y-6">
      <header className="rounded-2xl bg-slate-900 text-white p-6 border border-slate-700">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300 font-bold">Panel de control</p>
        <h1 className="mt-2 text-3xl font-black">Analítica de la plataforma</h1>
        <p className="mt-2 text-sm text-slate-300">Visión rápida de uso y actividad para gestión interna.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl border p-5 ${card.accent}`}>
            <p className="text-xs uppercase tracking-[0.18em] font-bold">{card.label}</p>
            <p className="mt-2 text-3xl font-black">{card.value}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-black text-slate-900">Top colaboradores en foro</h3>
          <p className="text-sm text-slate-500">Usuarios con más temas creados.</p>
          <ul className="mt-4 space-y-2">
            {stats.topUsuarios.length === 0 && (
              <li className="text-sm text-slate-500">No hay actividad registrada.</li>
            )}
            {stats.topUsuarios.map((u, idx) => (
              <li key={`${u.nombre}-${idx}`} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-2">
                <span className="font-semibold text-slate-700">{u.nombre}</span>
                <span className="text-sm font-bold text-slate-900">{u.temasCreados} temas</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-black text-slate-900">Actividad reciente</h3>
          <p className="text-sm text-slate-500">Últimos temas publicados en foros.</p>
          <ul className="mt-4 space-y-2">
            {stats.actividadReciente.length === 0 && (
              <li className="text-sm text-slate-500">No hay temas recientes.</li>
            )}
            {stats.actividadReciente.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-semibold text-slate-800 line-clamp-1">{item.titulo}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{item.usuario}</span>
                  <span>{item.fecha ? new Date(item.fecha).toLocaleString('es-ES') : 'Sin fecha'}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
