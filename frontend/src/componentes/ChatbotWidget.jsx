import React, { useEffect, useMemo, useRef, useState } from 'react';

const PROMPTS_RAPIDOS = [
  'Como pido vacaciones?',
  'Buscar manual onboarding',
  'Beneficios de salud',
  'Cambiar mi contrasena',
];

export default function ChatbotWidget({ usuario }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [esAbierto, setEsAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      id: 'welcome',
      rol: 'bot',
      texto: `Hola ${usuario?.nombre || ''}, soy tu asistente IA de la intranet. Estoy listo para ayudarte con wiki, foro y documentos.`.trim(),
      pregunta: '',
      fuentes: [],
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

  useEffect(() => {
    const openWidget = () => setEsAbierto(true);
    window.addEventListener('open-chatbot-widget', openWidget);
    return () => window.removeEventListener('open-chatbot-widget', openWidget);
  }, []);

  const historial = useMemo(() => {
    const primeraPregunta = mensajes.find((msg) => msg.rol === 'user');
    return [{
      id: 'h-current',
      titulo: primeraPregunta
        ? (primeraPregunta.texto.length > 38 ? `${primeraPregunta.texto.slice(0, 38)}...` : primeraPregunta.texto)
        : 'Conversacion actual',
      fecha: 'Hoy',
    }];
  }, [mensajes]);

  if (!usuario) {
    return null;
  }

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
        fuentes: Array.isArray(data.sources) ? data.sources : [],
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
        fuentes: [],
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
    <>
      <button
        onClick={() => setEsAbierto(true)}
        className="fixed bottom-6 right-6 z-40 h-14 min-w-14 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-[0_14px_30px_rgba(37,99,235,0.45)] flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.03]"
        title="Abrir asistente IA"
        aria-label="Abrir asistente IA"
      >
        <span className="text-lg">✦</span>
        <span className="hidden sm:inline text-sm font-bold">Asistente IA</span>
      </button>

      {esAbierto && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="w-full md:max-w-6xl h-[90vh] md:h-[88vh] bg-white rounded-none md:rounded-2xl border-0 md:border md:border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <header className="h-14 px-4 md:px-6 bg-[#0f172a] text-white border-b border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-300 font-bold">Knowledge Core</p>
                <h2 className="text-base md:text-lg font-extrabold">AI Assistant</h2>
              </div>
              <button
                onClick={() => setEsAbierto(false)}
                className="h-9 w-9 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="Cerrar asistente"
              >
                ✕
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] flex-1 min-h-0">
              <aside className="hidden md:flex bg-slate-100 border-r border-slate-200 p-4 flex-col">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-bold">Chat history</p>

                <div className="mt-3 space-y-2 flex-1 overflow-y-auto">
                  {historial.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`w-full text-left rounded-xl p-3 transition ${
                        idx === 0
                          ? 'bg-white border border-blue-200 shadow-sm'
                          : 'hover:bg-white border border-transparent'
                      }`}
                    >
                      <p className="text-[11px] text-blue-700 font-bold uppercase tracking-[0.12em]">{item.fecha}</p>
                      <p className="text-sm text-slate-800 font-semibold mt-1">{item.titulo}</p>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="mt-3 h-10 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-300 transition-colors"
                  onClick={() => setMensajes((prev) => prev.filter((msg) => msg.id === 'welcome'))}
                >
                  Clear all history
                </button>
              </aside>

              <section className="flex flex-col min-h-0 bg-slate-50">
                <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
                  {mensajes.map((msg) => (
                    <div key={msg.id} className={`max-w-[92%] ${msg.rol === 'user' ? 'ml-auto' : ''}`}>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap border ${
                          msg.rol === 'user'
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-800 border-slate-200'
                        }`}
                      >
                        {msg.texto}
                      </div>

                      {msg.rol === 'bot' && Array.isArray(msg.fuentes) && msg.fuentes.length > 0 && (
                        <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Fuentes</p>
                          <ul className="mt-1 space-y-1">
                            {msg.fuentes.slice(0, 3).map((f, idx) => (
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
                        </div>
                      )}
                    </div>
                  ))}

                  {cargando && (
                    <div className="max-w-[92%] rounded-2xl px-4 py-3 text-sm bg-white text-slate-600 border border-slate-200">
                      Escribiendo...
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                <footer className="border-t border-slate-200 bg-white p-4">
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!cargando && entrada.trim()) {
                            enviarTexto(entrada);
                          }
                        }
                      }}
                      placeholder="Escribe tu pregunta aqui..."
                      className="flex-1 min-h-[48px] max-h-32 resize-y border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={cargando || !entrada.trim()}
                      className="h-[48px] px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enviar
                    </button>
                  </form>
                </footer>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
