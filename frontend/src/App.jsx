import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos tus piezas de Lego (Componentes)
// NOTA: Asegúrate de que tu carpeta se llame "components" (sin la "e")
import Navbar from './componentes/Navbar';
import SocialWall from './componentes/SocialWall';
import DocumentManager from './componentes/DocumentManager';

// Esta es una pieza extra para que la Wiki y el Foro no salgan en blanco
const Mantenimiento = ({ modulo, icono }) => (
  <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
    <span className="text-6xl mb-4">{icono}</span>
    <h2 className="text-xl font-bold text-gray-800">Módulo de {modulo}</h2>
    <p className="text-gray-500 mt-2 text-center text-sm">
      Chen está configurando este contenedor en Docker. <br/>
      Estará disponible en la próxima fase del proyecto.
    </p>
  </div>
);

function App() {
  return (
    <Router>
      {/* El fondo gris suave para toda la web */}
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        
        {/* 1. El NAVBAR se queda fuera de Routes porque queremos que SIEMPRE se vea */}
        <Navbar />
        
        {/* 2. El MAIN es el contenedor donde "caerán" las diferentes páginas */}
        <main className="max-w-5xl mx-auto p-6">
          
          <Routes>
            {/* RUTA INICIAL: Al entrar a la web (localhost:5173), enseña el Muro */}
            <Route path="/" element={<SocialWall />} />
            
            {/* RUTA SOCIAL: Si pulsas en el botón de Red Social */}
            <Route path="/social" element={<SocialWall />} />
            
            {/* RUTA DOCUMENTOS: Si pulsas en el botón de Documentos */}
            <Route path="/documentos" element={<DocumentManager />} />
            
            {/* RUTAS DE MANTENIMIENTO: Para que la Wiki y el Foro tengan contenido */}
            <Route path="/wiki" element={<Mantenimiento modulo="Wiki (BookStack)" icono="📚" />} />
            <Route path="/foro" element={<Mantenimiento modulo="Foro (Flarum)" icono="💬" />} />
          </Routes>

        </main>
      </div>
    </Router>
  );
}

export default App;