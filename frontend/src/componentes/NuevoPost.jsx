import React, { useState } from 'react';

export default function NuevoPost({ alEnviar }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("Sugerencias");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    try {
      const response = await fetch(`${API_URL}/posts/crear_p.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contenido: texto,
          usuario_id: usuario?.id || 'anonimo',
          usuario_nombre: usuario?.nombre || 'Usuario',
          titulo_hilo: categoria,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setTexto("");
        setCategoria('Sugerencias');
        if (alEnviar) alEnviar(); 
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-blue-600 font-bold mb-2">Nuevo tema</p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Describe tu duda o propuesta para la comunidad"
        className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="4"
        required
      />
      <div className="flex flex-col sm:flex-row justify-between mt-3 gap-3">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 text-slate-700"
        >
          <option value="Sugerencias">Sugerencias</option>
          <option value="Soporte">Soporte</option>
          <option value="Anuncios">Anuncios</option>
        </select>

        <button
          type="submit"
          disabled={enviando}
          className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Publicando...' : 'Publicar tema'}
        </button>
      </div>
    </form>
  );
}