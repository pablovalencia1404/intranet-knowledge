import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './componentes/Navbar';
import StatsGrid from './componentes/StatsGrid';
import SocialWall from './componentes/SocialWall';
import DocumentManager from './componentes/DocumentManager';
import UserProfile from './componentes/UserProfile';
import Wiki from './componentes/Wiki';
import Foro from './componentes/Foro';
import AdminAnalytics from './componentes/AdminAnalytics';
import ChatbotWidget from './componentes/ChatbotWidget';
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
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarAvisoSesion, setMostrarAvisoSesion] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(60);
  const timeoutInactividadRef = useRef(null);
  const intervaloAvisoRef = useRef(null);
  const avisoActivoRef = useRef(false);

  const limpiarTemporizadores = () => {
    if (timeoutInactividadRef.current) {
      clearTimeout(timeoutInactividadRef.current);
      timeoutInactividadRef.current = null;
    }
    if (intervaloAvisoRef.current) {
      clearInterval(intervaloAvisoRef.current);
      intervaloAvisoRef.current = null;
    }
  };

  const cerrarSesion = async () => {
    try {
      await fetch(`${API_URL}/usuarios/logout_u.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      setUsuario(null);
      localStorage.removeItem('usuario');
      setMostrarAvisoSesion(false);
      avisoActivoRef.current = false;
      limpiarTemporizadores();
    }
  };

  const iniciarAvisoExpiracion = () => {
    if (avisoActivoRef.current || !usuario) {
      return;
    }

    avisoActivoRef.current = true;
    setMostrarAvisoSesion(true);
    setSegundosRestantes(60);

    intervaloAvisoRef.current = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervaloAvisoRef.current);
          intervaloAvisoRef.current = null;
          cerrarSesion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const reiniciarTemporizadorInactividad = () => {
    if (!usuario || avisoActivoRef.current) {
      return;
    }

    if (timeoutInactividadRef.current) {
      clearTimeout(timeoutInactividadRef.current);
    }

    timeoutInactividadRef.current = setTimeout(() => {
      iniciarAvisoExpiracion();
    }, 30 * 60 * 1000);
  };

  const confirmarContinuarSesion = async () => {
    try {
      // Refresca la marca de actividad en backend
      await fetch(`${API_URL}/usuarios/verificar_sesion.php`, {
        credentials: 'include',
      });
    } catch (err) {
      console.error('No se pudo refrescar la sesión:', err);
    }

    setMostrarAvisoSesion(false);
    avisoActivoRef.current = false;
    if (intervaloAvisoRef.current) {
      clearInterval(intervaloAvisoRef.current);
      intervaloAvisoRef.current = null;
    }
    reiniciarTemporizadorInactividad();
  };

  useEffect(() => {
    // Verificar sesión al cargar
    const verificarSesion = async () => {
      try {
        const respuesta = await fetch(`${API_URL}/usuarios/verificar_sesion.php`, {
          credentials: 'include',
        });
        const datos = await respuesta.json();
        if (datos.status === 'autenticado') {
          setUsuario(datos.usuario);
          localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        } else {
          setUsuario(null);
          localStorage.removeItem('usuario');
        }
      } catch (err) {
        console.log('No hay sesión activa');
        setUsuario(null);
        localStorage.removeItem('usuario');
      } finally {
        setCargando(false);
      }
    };
    
    verificarSesion();
  }, [API_URL]);

  useEffect(() => {
    if (!usuario) {
      limpiarTemporizadores();
      setMostrarAvisoSesion(false);
      avisoActivoRef.current = false;
      return;
    }

    const eventosActividad = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const onActividad = () => reiniciarTemporizadorInactividad();

    eventosActividad.forEach((evento) => {
      window.addEventListener(evento, onActividad);
    });

    reiniciarTemporizadorInactividad();

    return () => {
      eventosActividad.forEach((evento) => {
        window.removeEventListener(evento, onActividad);
      });
      limpiarTemporizadores();
    };
  }, [usuario]);

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
        {usuario && <Navbar usuario={usuario} onLogout={cerrarSesion} />}
        <main className={usuario ? "w-full px-4 md:px-6 py-4" : ""}>
          <Routes>
            <Route path="/login" element={<Login onLogin={setUsuario} />} />
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
            <RutaProtegida usuario={usuario} element={<UserProfile usuario={usuario} />} />
            } />
            <Route path="/wiki" element={
              <RutaProtegida usuario={usuario} element={<Wiki />} />
            } />
            <Route path="/foro" element={
              <RutaProtegida usuario={usuario} element={<Foro />} />
            } />
            <Route path="/admin" element={
              <RutaProtegida usuario={usuario} element={<AdminAnalytics usuario={usuario} />} />
            } />
            <Route path="/chatbot" element={<Navigate to="/social" replace />} />
          </Routes>
        </main>

        {mostrarAvisoSesion && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900">¿Sigues ahí?</h3>
              <p className="mt-2 text-sm text-gray-600">
                Tu sesión se cerrará por inactividad en <span className="font-bold text-red-600">{segundosRestantes}s</span>.
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Pulsa el botón para mantener la sesión activa.
              </p>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cerrar ahora
                </button>
                <button
                  type="button"
                  onClick={confirmarContinuarSesion}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Seguir conectado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Widget flotante del chatbot */}
        <ChatbotWidget usuario={usuario} />
      </div>
    </Router>
  );
}

export default App;