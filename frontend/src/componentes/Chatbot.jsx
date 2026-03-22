import React, { useEffect, useMemo, useRef, useState } from 'react';

const PROMPTS_RAPIDOS = [
  'Como pido vacaciones?',
  'Buscar manual de onboarding',
  'Beneficios de salud',
  'Cambiar mi contrasena',
];

export default function Chatbot({ usuario }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [mensajes, setMensajes] = useState([
    {
      id: 'welcome',
      rol: 'bot',
      texto: `Hola ${usuario?.nombre || ''}, soy tu asistente de la intranet. Estoy aqui para ayudarte con manuales, procesos y documentacion.`.trim(),
      pregunta: '',
      sources: [],
      engine: 'anythingllm',
    },
  ]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [feedbackEnviado, setFeedbackEnviado] = useState({});
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  const historial = useMemo(() => {
    const ultimasPreguntas = mensajes
      .filter((msg) => msg.rol === 'user')
      .slice(-4)
      .reverse()
      .map((msg, index) => ({
        id: `h-${index}`,
        titulo: msg.texto.length > 32 ? `${msg.texto.slice(0, 32)}...` : msg.texto,
        fecha: index === 0 ? 'Hoy' : 'Reciente',
      }));

    return [
      ...ultimasPreguntas,
      { id: 'manual-1', titulo: 'Manual de Onboarding IT', fecha: 'Ayer' },
      { id: 'manual-2', titulo: 'Configuracion VPN corporativa', fecha: 'Oct 24' },
    ];
  }, [mensajes]);

  const enviarTexto = async (textoPlano) => {
    const texto = textoPlano.trim();
    if (!texto || cargando) {
      return;
    }

    setError('');
    setEntrada('');

    const userMsg = { id: `u-${Date.now()}`, rol: 'user', texto };
    setMensajes((prev) => [...prev, userMsg]);
    setCargando(true);

    try {
      const res = await fetch(`${API_URL}/chatbot/chat.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: texto }),
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error(`Respuesta invalida del servidor (${res.status}).`);
      }

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const botMsg = {
        id: `b-${Date.now()}`,
        rol: 'bot',
        texto: data.text || 'No se recibio respuesta del asistente.',
        pregunta: texto,
        sources: Array.isArray(data.sources) ? data.sources : [],
        engine: data.engine || 'desconocido',
      };
      setMensajes((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(`No se pudo obtener respuesta: ${err.message}`);
      const botErr = {
        id: `be-${Date.now()}`,
        rol: 'bot',
        texto: 'No pude responder en este momento. Revisa configuracion del backend de chatbot.',
        pregunta: texto,
        sources: [],
        engine: 'N/A',
      };
      setMensajes((prev) => [...prev, botErr]);
    } finally {
      setCargando(false);
    }
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    await enviarTexto(entrada);
  };

  const enviarFeedback = async (msg, util) => {
    if (feedbackEnviado[msg.id]) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/chatbot/feedback.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          util,
          pregunta: msg.pregunta || '',
          respuesta: msg.texto || '',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      setFeedbackEnviado((prev) => ({ ...prev, [msg.id]: true }));
    } catch (err) {
      setError(`No se pudo guardar feedback: ${err.message}`);
    }
  };

  return (
    <section className="my-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden min-h-[78vh]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] min-h-[78vh]">
        <aside className="bg-slate-100/80 border-r border-slate-200 p-5 flex flex-col">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-bold">Chat History</p>
          </div>

          <div className="mt-4 space-y-2 flex-1">
            {historial.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`w-full text-left rounded-xl p-3 transition ${
                  index === 0
                    ? 'bg-white border border-blue-200 shadow-sm'
                    : 'hover:bg-white border border-transparent'
                }`}
              >
                <p className="text-xs text-blue-700 font-bold uppercase tracking-[0.12em]">{item.fecha}</p>
                <p className="text-sm text-slate-800 font-semibold mt-1">{item.titulo}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 h-11 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
            onClick={() => setMensajes((prev) => prev.filter((msg) => msg.id === 'welcome'))}
          >
            Clear all history
          </button>
        </aside>

        <div className="flex flex-col bg-slate-50">
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
            {mensajes.map((msg) => (
              <div key={msg.id} className={`max-w-[90%] ${msg.rol === 'user' ? 'ml-auto' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed whitespace-pre-wrap border ${
                    msg.rol === 'user'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-800 border-slate-200'
                  }`}
                >
                  {msg.texto}
                </div>

                {msg.rol === 'bot' && Array.isArray(msg.sources) && msg.sources.length > 0 && (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Fuentes</p>
                    <ul className="mt-1 space-y-1">
                      {msg.sources.slice(0, 3).map((f, idx) => (
                        <li key={`${msg.id}-f-${idx}`} className="text-xs text-slate-700">
                          {f.tipo}: {f.titulo}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {msg.rol === 'bot' && msg.pregunta && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-slate-500">Motor: {msg.engine || 'N/A'}</span>
                    <button
                      type="button"
                      onClick={() => enviarFeedback(msg, true)}
                      disabled={Boolean(feedbackEnviado[msg.id])}
                      className="text-xs px-2 py-1 rounded border border-emerald-200 text-emerald-700 bg-emerald-50 disabled:opacity-60"
                    >
                      Util
                    </button>
                    <button
                      type="button"
                      onClick={() => enviarFeedback(msg, false)}
                      disabled={Boolean(feedbackEnviado[msg.id])}
                      className="text-xs px-2 py-1 rounded border border-rose-200 text-rose-700 bg-rose-50 disabled:opacity-60"
                    >
                      No util
                    </button>
                    {feedbackEnviado[msg.id] && <span className="text-[11px] text-slate-500">Gracias por el feedback</span>}
                  </div>
                )}
              </div>
            ))}

            {cargando && (
              <div className="max-w-[90%] rounded-2xl px-4 py-3 text-sm bg-white text-slate-600 border border-slate-200">
                Escribiendo...
              </div>
            )}
            <div ref={endRef} />
          </div>

          <footer className="border-t border-slate-200 bg-white p-4 md:p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {PROMPTS_RAPIDOS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => enviarTexto(prompt)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-700"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={enviarMensaje} className="flex items-end gap-2">
              <textarea
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder="Escribe tu pregunta aqui..."
                className="flex-1 min-h-[52px] max-h-40 resize-y border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={cargando || !entrada.trim()}
                className="h-[52px] px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </form>
          </footer>
        </div>
      </div>
    </section>
  );
}
