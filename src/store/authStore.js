import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Login
      login: (token) => {
        const decoded = jwtDecode(token);
        Cookies.set('token', token, { expires: 7 });
        set({
          token,
          user: decoded,
          isAuthenticated: true,
        });
      },

      // Logout
      logout: () => {
        Cookies.remove('token');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      // Verificar si es admin
      isAdmin: () => {
        const state = useAuthStore.getState();
        return state.user?.rol === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
