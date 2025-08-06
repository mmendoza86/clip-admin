import api from './api';

export const login = async (username: string, password: string) => {
  const EXPIRATION_MINUTES = 60; // tiempo de vida del token en minutos

  // Si el usuario es 'admin', simulamos el login
  if (username === 'admin' && password === 'admin123') {
    const fakeToken = 'fake-token-admin';
    const expirationTime = Date.now() + EXPIRATION_MINUTES * 60 * 1000;

    localStorage.setItem('token', fakeToken);
    localStorage.setItem('token_expiration', expirationTime.toString());

    return {
      token: fakeToken,
      user: {
        username: 'admin',
        role: 'admin',
        fake: true
      }
    };
  }

  // Backend real
  const res = await api.post('/auth/login', { username, password });
  const expirationTime = Date.now() + EXPIRATION_MINUTES * 60 * 1000;

  localStorage.setItem('token', res.data.token);
  localStorage.setItem('token_expiration', expirationTime.toString());

  return res.data;
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('token_expiration');
};
