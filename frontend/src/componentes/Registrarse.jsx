import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Registrarse() {
  const API_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api`;
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (contraseña !== confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/usuarios/crear_u.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre,
          email: email,
          contraseña: contraseña,
          rol: 'user',
        }),
      });

      const datos = await respuesta.json();

      if (datos.status === 'success') {
        setExito('¡Cuenta creada exitosamente! Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(datos.msj || 'Error al crear la cuenta');
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
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Institutional Intelligence</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 max-w-md mx-auto">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Crear Cuenta</h2>
            <p className="mt-2 text-slate-600 text-sm">Unete a la galeria de inteligencia institucional.</p>

            <form onSubmit={handleRegistro} className="mt-6">
              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-[0.12em] text-slate-700 font-semibold mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-[0.12em] text-slate-700 font-semibold mb-2">
                  Correo electronico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nombre@institucion.com"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-[0.12em] text-slate-700 font-semibold mb-2">
                  Contrasena
                </label>
                <input
                  type="password"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                  className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-[0.12em] text-slate-700 font-semibold mb-2">
                  Confirmar contrasena
                </label>
                <input
                  type="password"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  required
                  className="w-full h-11 px-4 bg-slate-100 border border-slate-200 rounded-md text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {exito && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm">
                  {exito}
                </div>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full h-12 bg-gradient-to-r from-[#1552c9] to-[#4f83f1] hover:from-[#1248b0] hover:to-[#3f73dd] disabled:opacity-60 text-white font-bold rounded-lg transition"
              >
                {cargando ? 'Creando cuenta...' : 'Registrarse →'}
              </button>
            </form>

            <p className="text-center text-slate-600 mt-6 text-sm">
              Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-700 hover:text-blue-900 font-semibold">
                Inicia sesion aqui
              </Link>
            </p>
          </div>

          <div className="text-center mt-6 text-[11px] uppercase tracking-[0.16em] text-slate-400 font-semibold">
            <button type="button" className="hover:text-slate-600">Politica de Privacidad</button>
            <span className="mx-3"> </span>
            <button type="button" className="hover:text-slate-600">Terminos de Uso</button>
          </div>
        </div>
      </div>

      <footer className="h-14 border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="h-full max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between text-xs text-slate-500">
          <p className="font-semibold text-slate-800">Knowledge Core</p>
          <div className="hidden md:flex items-center gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Protocols</span>
            <span>Help Desk</span>
          </div>
          <p>© 2024 Knowledge Core</p>
        </div>
      </footer>
    </div>
  );
}
