import { useState } from 'react';
import { login } from '../services/authService';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
    const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      toast.error('Usuario o contraseña incorrectos');
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-secondary-300 via-secondary-200 to-secondary-300 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-gray-100 border border-gray-200 p-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-secondary-700">Admin CLIP</h1>
            <p className="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Usuario */}
          <div className="relative">
            <label htmlFor="user" className="sr-only">Usuario</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <input
              id="user"
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2.5 text-sm
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-100
                         focus:border-primary-600 transition"
            />
          </div>

          {/* Contraseña */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>

            <input
              id="password"
              type={showPass ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 pl-10 pr-10 py-2.5 text-sm
                         placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-100
                         focus:border-primary-600 transition"
            />

            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Extras (opcional) 
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 select-none text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-200" />
              Recordarme
            </label>
            <a href="#" className="text-primary-700 hover:text-primary-800">¿Olvidaste tu contraseña?</a>
          </div>
          */}

          {/* Botón */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-600
                       text-white py-2.5 rounded-xl font-medium shadow-sm transition active:scale-[0.99]
                       focus:outline-none focus:ring-4 focus:ring-primary-100"
          >
            <LogIn className="w-5 h-5" />
            Entrar
          </button>
        </form>

        {/* Footer chico 
        <p className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} CLIP · Todos los derechos reservados
        </p>
        */}
      </div>
    </div>
  );
}
