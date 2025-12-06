'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
              🛒 E-Commerce
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link
                href="/shop/productos"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/shop/productos'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                Productos
              </Link>
              {user?.rol === 'ADMIN' && (
                <>
                  <Link
                    href="/admin/productos"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/productos'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Admin Productos
                  </Link>
                  <Link
                    href="/admin/categorias"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/categorias'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Admin Categorías
                  </Link>
                  <Link
                    href="/admin/pedidos"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/pedidos'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Admin Pedidos
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Usuario y carrito */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.rol === 'CLIENTE' && (
                  <>
                    <Link
                      href="/shop/carrito"
                      className="relative text-gray-900 hover:text-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {getItemCount() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {getItemCount()}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/shop/pedidos"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
                    >
                      Mis Pedidos
                    </Link>
                  </>
                )}
                <span className="text-sm text-gray-900 font-medium">
                  Hola, <span className="font-bold text-blue-600">{user?.nombre}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-900 hover:text-blue-600 hover:bg-gray-100 rounded-md"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
