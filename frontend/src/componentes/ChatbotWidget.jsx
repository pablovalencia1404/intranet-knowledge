import React, { useEffect, useRef, useState } from 'react';
import Chatbot from './Chatbot';

export default function ChatbotWidget({ usuario }) {
  const [esAbierto, setEsAbierto] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;

  // Solo mostrar el widget si el usuario está autenticado
  if (!usuario) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setEsAbierto(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        title="Abrir asistente IA"
        aria-label="Abrir asistente IA"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Modal */}
      {esAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-2xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-900 text-white">
              <div>
                <h2 className="text-lg font-black tracking-tight">Asistente IA</h2>
                <p className="text-xs text-slate-300">Conectado al módulo de conocimiento interno</p>
              </div>
              <button
                onClick={() => setEsAbierto(false)}
                className="text-white hover:bg-slate-700 p-2 rounded-lg transition"
                aria-label="Cerrar asistente"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del chatbot */}
            <div className="flex-1 overflow-hidden">
              <ChatbotEmbed usuario={usuario} onClose={() => setEsAbierto(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componente adaptado del Chatbot para usarlo dentro del widget
function ChatbotEmbed({ usuario, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [mensajes, setMensajes] = useState([
    {
      id: 'welcome',
      rol: 'bot',
      texto: `Hola ${usuario?.nombre || ''}, soy tu asistente de la intranet. ¿En qué te ayudo hoy?`.trim(),
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

  const enviarMensaje = async (e) => {
    e.preventDefault();
    const texto = entrada.trim();

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

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const botMsg = {
        id: `b-${Date.now()}`,
        rol: 'bot',
        texto: data.text || 'No se recibió respuesta del asistente.',
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
        texto: 'No pude responder en este momento. Revisa configuración del backend de chatbot.',
        pregunta: texto,
        fuentes: [],
      };
      setMensajes((prev) => [...prev, botErr]);
    } finally {
      setCargando(false);
    }
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
    <div className="h-full flex flex-col bg-white">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white space-y-4">
        {mensajes.map((msg) => (
          <div key={msg.id} className={`max-w-[88%] ${msg.rol === 'user' ? 'ml-auto' : 'mr-auto'}`}>
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.rol === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}
            >
              {msg.texto}
            </div>

            {msg.rol === 'bot' && Array.isArray(msg.fuentes) && msg.fuentes.length > 0 && (
              <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Fuentes</p>
                <ul className="mt-1 space-y-1">
                  {msg.fuentes.slice(0, 4).map((f, idx) => (
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
                  Útil
                </button>
                <button
                  type="button"
                  onClick={() => enviarFeedback(msg, false)}
                  disabled={Boolean(feedbackEnviado[msg.id])}
                  className="text-xs px-2 py-1 rounded border border-rose-200 text-rose-700 bg-rose-50 disabled:opacity-60"
                >
                  No útil
                </button>
                {feedbackEnviado[msg.id] && (
                  <span className="text-[11px] text-slate-500">Gracias por el feedback</span>
                )}
              </div>
            )}
          </div>
        ))}

        {cargando && (
          <div className="mr-auto bg-slate-100 text-slate-600 rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
            Escribiendo...
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Área de entrada */}
      <div className="p-4 border-t border-gray-100 bg-white">
        {error && (
          <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={enviarMensaje} className="flex items-end gap-2">
          <textarea
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="flex-1 min-h-[40px] max-h-24 resize-y border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={cargando || !entrada.trim()}
            className="h-[40px] px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
