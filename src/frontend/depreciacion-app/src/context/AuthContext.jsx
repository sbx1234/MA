import { createContext, useContext, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario'));

  const login = async (nombreUsuario, password) => {
    const response = await axiosClient.post('/Auth/login', {
      usuario: nombreUsuario,
      password: password,
    });

    const { token: nuevoToken, usuario: datosUsuario, mensaje } = response.data;

    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));

    setToken(nuevoToken);
    setUsuario(datosUsuario);

    return { token: nuevoToken, mensaje, usuario: datosUsuario };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        login,
        logout,
        isAuth: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}