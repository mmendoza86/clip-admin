import api from './api';

export const login = async (username: string, password: string) => {
  // Si el usuario es 'admin', simulamos el login
  if (username === 'admin' && password === 'admin123') {
    const fakeToken = 'fake-token-admin';
    localStorage.setItem('token', fakeToken);

    return {
      token: fakeToken,
      user: {
        username: 'admin',
        role: 'admin',
        fake: true
      }
    };
  }

  // Para cualquier otro usuario, validamos contra el backend real
  const res = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', res.data.token);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
