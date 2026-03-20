import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import StatsGrid from './componentes/StatsGrid';
import SocialWall from './componentes/SocialWall';
import DocumentManager from './componentes/DocumentManager';
import UserProfile from './componentes/UserProfile';
import Wiki from './componentes/Wiki';
import Foro from './componentes/Foro';
import Login from './componentes/Login';
import Registrarse from './componentes/Registrarse';

const Mantenimiento = ({ modulo, icono }) => (
  <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-gray-100 mt-10">
    <span className="text-6xl mb-4">{icono}</span>
    <h2 className="text-xl font-bold text-gray-800">Módulo de {modulo}</h2>
    <p className="text-gray-500 mt-2 text-center text-sm">Chen está preparando este contenedor Docker. <br/>Pronto disponible.</p>
  </div>
);

// Componente para rutas protegidas
const RutaProtegida = ({ element, usuario }) => {
  return usuario ? element : <Navigate to="/login" />;
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    const verificarSesion = async () => {
      try {
        const respuesta = await fetch('http://localhost/api/usuarios/verificar_sesion.php', {
          credentials: 'include',
        });
        const datos = await respuesta.json();
        if (datos.status === 'autenticado') {
          setUsuario(datos.usuario);
          localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        }
      } catch (err) {
        console.log('No hay sesión activa');
      } finally {
        setCargando(false);
      }
    };

    // También verificar localStorage
    const usuarioLocal = localStorage.getItem('usuario');
    if (usuarioLocal) {
      setUsuario(JSON.parse(usuarioLocal));
    }
    
    verificarSesion();
  }, []);

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {usuario && <Navbar usuario={usuario} onLogout={handleLogout} />}
        <main className={usuario ? "max-w-5xl mx-auto p-6" : ""}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrarse" element={<Registrarse />} />
            
            <Route path="/" element={
              <RutaProtegida usuario={usuario} element={
                <>
                  <StatsGrid /> 
                  <SocialWall />
                </>
              } />
            } />
            <Route path="/social" element={
              <RutaProtegida usuario={usuario} element={<SocialWall />} />
            } />
            <Route path="/documentos" element={
              <RutaProtegida usuario={usuario} element={<DocumentManager />} />
            } />
            <Route path="/perfil" element={
              <RutaProtegida usuario={usuario} element={<UserProfile />} />
            } />
            <Route path="/wiki" element={
              <RutaProtegida usuario={usuario} element={<Wiki />} />
            } />
            <Route path="/foro" element={
              <RutaProtegida usuario={usuario} element={<Foro />} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;