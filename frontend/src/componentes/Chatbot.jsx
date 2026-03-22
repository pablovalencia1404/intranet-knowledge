import React, { useEffect, useRef, useState } from 'react';

export default function Chatbot({ usuario }) {
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
      };
      setMensajes((prev) => [...prev, botMsg]);
    } catch (err) {
      setError(`No se pudo obtener respuesta: ${err.message}`);
      const botErr = {
        id: `be-${Date.now()}`,
        rol: 'bot',
        texto: 'No pude responder en este momento. Revisa configuración del backend de chatbot.',
      };
      setMensajes((prev) => [...prev, botErr]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="my-6 h-[calc(100vh-11rem)] min-h-[540px] bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <header className="px-6 py-4 border-b border-gray-100 bg-slate-900 text-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black tracking-tight">Asistente IA</h2>
          <p className="text-xs text-slate-300">Conectado al módulo de conocimiento interno</p>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded font-bold uppercase tracking-wider">
          Online
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-slate-50 to-white space-y-4">
        {mensajes.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
              msg.rol === 'user'
                ? 'ml-auto bg-blue-600 text-white rounded-br-sm'
                : 'mr-auto bg-slate-100 text-slate-800 rounded-bl-sm'
            }`}
          >
            {msg.texto}
          </div>
        ))}

        {cargando && (
          <div className="mr-auto bg-slate-100 text-slate-600 rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
            Escribiendo...
          </div>
        )}

        <div ref={endRef} />
      </div>

      <footer className="p-4 border-t border-gray-100 bg-white">
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
            className="flex-1 min-h-[52px] max-h-40 resize-y border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={cargando || !entrada.trim()}
            className="h-[52px] px-4 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </form>
      </footer>
    </section>
  );
}
