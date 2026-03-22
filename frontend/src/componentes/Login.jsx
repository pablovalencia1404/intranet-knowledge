import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/login_u.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          contraseña: contraseña,
        }),
        credentials: 'include',
      });

      const datos = await respuesta.json();

      if (datos.status === 'success') {
        // Guardar info en localStorage
        localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        if (onLogin) {
          onLogin(datos.usuario);
        }
        // Redirigir al inicio
        navigate('/');
      } else {
        setError(datos.mensaje || 'Error en el inicio de sesión');
      }
    } catch (err) {
      setError('Error al conectar con el servidor: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white text-lg font-bold">✦</div>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900">Knowledge Core</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Intranet</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-md mx-auto">
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm text-slate-700 font-medium mb-2">
                  Correo electronico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nombre@compania.com"
                />
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-slate-700 font-medium">
                    Contrasena
                  </label>
                  <a
                    href="mailto:soporte@institucion.edu?subject=Recuperacion%20de%20contrasena"
                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
                  >
                    Olvidaste tu contrasena?
                  </a>
                </div>
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                  className="w-full h-12 px-4 bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full h-12 bg-gradient-to-r from-[#07266f] to-[#2563eb] hover:from-[#061d56] hover:to-[#1f56cf] disabled:opacity-60 text-white font-bold rounded-lg transition"
              >
                {cargando ? 'Iniciando sesion...' : 'Iniciar sesion →'}
              </button>
            </form>

            <div className="my-6 border-t border-slate-200" />

            <p className="text-center text-slate-600 text-sm">
              No tienes una cuenta institucional?{' '}
              <Link to="/registrarse" className="text-blue-700 hover:text-blue-900 font-semibold">
                Registrate aqui
              </Link>
            </p>
          </div>

          <div className="text-center mt-6 text-xs text-slate-500">
            <a href="https://www.espanol.org" target="_blank" rel="noreferrer" className="hover:text-slate-700">Espanol (ES)</a>
            <span className="mx-3">·</span>
            <a href="mailto:soporte@institucion.edu" className="hover:text-slate-700">Soporte Tecnico</a>
          </div>
        </div>
      </div>

      <footer className="h-14 border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between text-xs text-slate-500">
          <p className="font-semibold text-slate-800">Knowledge Core</p>
          <div className="hidden md:flex items-center gap-5">
            <a href="/" className="hover:text-slate-700">Privacy Policy</a>
            <a href="/" className="hover:text-slate-700">Terms of Service</a>
            <a href="/" className="hover:text-slate-700">Security Protocols</a>
            <a href="mailto:soporte@institucion.edu" className="hover:text-slate-700">Help Desk</a>
          </div>
          <p>© 2024 Knowledge Core</p>
        </div>
      </footer>
    </div>
  );
}
