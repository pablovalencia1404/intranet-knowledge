import React, { useState } from 'react';

export default function NuevoPost({ alEnviar }) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("Sugerencias");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/foro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: "Alfonso", text: texto, cat: categoria, replies: 0 }),
      });

      if (response.ok) {
        setTexto("");
        if (alEnviar) alEnviar(); 
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-4">
      <textarea 
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="¿Qué quieres compartir?"
        className="w-full p-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-orange-500"
        rows="2" required
      />
      <div className="flex justify-between mt-2">
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="text-xs border rounded p-1">
          <option value="Sugerencias">Sugerencias</option>
          <option value="Soporte">Soporte</option>
          <option value="Anuncios">Anuncios</option>
        </select>
        <button type="submit" disabled={enviando} className="bg-orange-600 text-white px-4 py-1 rounded-lg font-bold text-xs">
          {enviando ? "..." : "Publicar 🚀"}
        </button>
      </div>
    </form>
  );
}