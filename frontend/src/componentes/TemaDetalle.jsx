import React, { useState, useEffect } from 'react';

export default function TemaDetalle({ temaid, onClose, onRespuestaCreada }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [tema, setTema] = useState(null);
  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  // Cargar tema y respuestas
  const cargarTema = () => {
    fetch(`${API_URL}/posts/leer_p.php?id=${temaid}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.tema) {
          setTema(data.tema);
        }
        if (data.respuestas) {
          setRespuestas(Array.isArray(data.respuestas) ? data.respuestas : []);
        }
        setCargando(false);
      })
      .catch(err => {
        console.error('Error cargando tema:', err);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarTema();
  }, [temaid]);

  const handleEnviarRespuesta = async (e) => {
    e.preventDefault();
    if (!textoRespuesta.trim()) return;

    setEnviandoRespuesta(true);
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    try {
      const response = await fetch(`${API_URL}/posts/crear_p.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido: textoRespuesta,
          usuario_id: usuario?.id || 'anonimo',
          usuario_nombre: usuario?.nombre || 'Usuario',
          tema_padre_id: temaid,
          tipo: 'respuesta',
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setTextoRespuesta('');
        cargarTema();
        if (onRespuestaCreada) onRespuestaCreada();
      }
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  if (cargando) {
    return (
      <div className="fixed inset-0 bg-slate-100/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!tema) {
    return (
      <div className="fixed inset-0 bg-slate-100/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 rounded-2xl p-6 max-w-2xl w-full border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
          <p className="text-gray-600">Tema no encontrado</p>
          <button
            onClick={onClose}
            className="mt-4 bg-gray-200 px-4 py-2 rounded-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-100/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        {/* Cabecera de cierre */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-black text-gray-800">{tema.titulo_hilo || tema.contenido.substring(0, 50)}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Tema original */}
        <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {tema.user ? tema.user[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{tema.user || 'Usuario'}</p>
              <p className="text-xs text-gray-500">{tema.fecha || 'Reciente'}</p>
            </div>
          </div>
          <p className="text-gray-700">{tema.contenido || tema.content}</p>
        </div>

        {/* Respuestas */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Respuestas ({respuestas.length})
          </h3>

          {respuestas.length === 0 ? (
            <p className="text-sm text-gray-500">No hay respuestas aún. ¡Sé el primero!</p>
          ) : (
            <div className="space-y-3 mb-6">
              {respuestas.map((respuesta, index) => {
                const respuestaId = respuesta?._id?.$oid || respuesta?.id || `respuesta-${index}`;
                return (
                  <div key={respuestaId} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {respuesta.user ? respuesta.user[0].toUpperCase() : 'U'}
                      </div>
                      <p className="text-xs font-bold text-gray-800">{respuesta.user || 'Usuario'}</p>
                      <p className="text-xs text-gray-400">{respuesta.fecha || 'Reciente'}</p>
                    </div>
                    <p className="text-sm text-gray-700">{respuesta.contenido || respuesta.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Formulario de respuesta */}
        <form onSubmit={handleEnviarRespuesta} className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Añadir respuesta</h3>
          <textarea
            value={textoRespuesta}
            onChange={(e) => setTextoRespuesta(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={enviandoRespuesta || !textoRespuesta.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {enviandoRespuesta ? 'Enviando...' : 'Responder'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
