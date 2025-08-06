import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 🔹 Función de logout centralizada
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    setUser(null);
    router.push('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('token_expiration');

    // No hay token o no hay expiración → logout inmediato
    if (!token || !expiration) {
      if (router.pathname !== '/') router.push('/');
      return;
    }

    const expTime = parseInt(expiration);
    const now = Date.now();

    // Token vencido → logout inmediato
    if (now > expTime) {
      logout();
      return;
    }

    // 🔹 Programar logout automático cuando expire
    const timeLeft = expTime - now;
    const timeout = setTimeout(() => {
      logout();
    }, timeLeft);

    return () => clearTimeout(timeout);
  }, [router.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
