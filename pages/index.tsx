import { useState } from 'react';
import { login } from '../services/authService';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      alert('Login incorrecto');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-300">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl text-secondary-700 mb-4 font-bold text-center">Admin CLIP</h1>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-4 py-2 border"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border"
        />
        <button type="submit" className="w-full bg-primary-800 text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
