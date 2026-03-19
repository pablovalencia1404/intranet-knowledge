import React from 'react';

export default function SocialWall() {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden my-6">
      {/* Cabecera del Muro */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className="text-xl">📣</span>
        <h3 className="font-bold text-gray-800 tracking-tight">Muro de Actualidad</h3>
      </div>
      
      {/* Área para escribir */}
      <div className="p-4 bg-white">
        <textarea 
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
          placeholder="¿Qué novedades hay en tu departamento?"
          rows="3"
        />
        <div className="flex justify-end mt-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-sm active:scale-95">
            Publicar novedad
          </button>
        </div>
      </div>

      {/* Publicación de ejemplo */}
      <div className="p-4 border-t border-gray-50">
        <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              AR
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Ana Rodríguez</p>
              <p className="text-xs text-gray-400 mt-1">Recursos Humanos • Hace 2 horas</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            ¡Hola equipo! 🥐 Os recuerdo que este viernes tenemos el desayuno mensual en la sala común. 
            Hablaremos de los nuevos beneficios sociales. ¡Os espero!
          </p>
          <div className="mt-4 flex items-center gap-6 border-t border-blue-100/30 pt-3">
            <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
              <span>❤️</span> Me gusta (12)
            </button>
            <button className="text-gray-500 text-xs font-medium flex items-center gap-1 hover:underline">
              <span>💬</span> Comentar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}