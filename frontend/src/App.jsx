import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import SocialWall from './componentes/SocialWall';
import DocumentManager from './componentes/DocumentManager';
import UserProfile from './componentes/UserProfile';
import Wiki from './componentes/Wiki'; // <-- Importar
import Foro from './componentes/Foro'; //

const Mantenimiento = ({ modulo, icono }) => (
  <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
    <span className="text-6xl mb-4">{icono}</span>
    <h2 className="text-xl font-bold text-gray-800">Módulo de {modulo}</h2>
    <p className="text-gray-500 mt-2 text-center text-sm">Chen está preparando este contenedor Docker. <br/>Pronto disponible.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<SocialWall />} />
            <Route path="/social" element={<SocialWall />} />
            <Route path="/documentos" element={<DocumentManager />} />
            
            <Route path="/perfil" element={<UserProfile />} />
            <Route path="/wiki" element={<Wiki />} />
            <Route path="/foro" element={<Foro />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;