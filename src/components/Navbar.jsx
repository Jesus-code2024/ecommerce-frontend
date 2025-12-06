'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useCartStore from '@/store/cartStore';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { getItemCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <span className="hidden xs:inline">E-Commerce</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex ml-10 space-x-2">
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
                    Categorías
                  </Link>
                  <Link
                    href="/admin/pedidos"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/admin/pedidos'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Pedidos
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {user?.rol === 'CLIENTE' && (
                  <>
                    <Link
                      href="/shop/carrito"
                      className="relative text-gray-900 hover:text-blue-600 p-2"
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
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
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
                <span className="text-sm text-gray-900 font-medium hidden xl:block">
                  Hola, <span className="font-bold text-blue-600">{user?.nombre}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  Salir
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

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3">
            {isAuthenticated && user?.rol === 'CLIENTE' && (
              <Link
                href="/shop/carrito"
                className="relative text-gray-900 hover:text-blue-600 p-2"
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {getItemCount()}
                  </span>
                )}
              </Link>
            )}
            
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 hover:text-blue-600 p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/shop/productos"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/admin/productos'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin Productos
                </Link>
                <Link
                  href="/admin/categorias"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/admin/categorias'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin Categorías
                </Link>
                <Link
                  href="/admin/pedidos"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/admin/pedidos'
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Admin Pedidos
                </Link>
              </>
            )}
            
            {isAuthenticated && user?.rol === 'CLIENTE' && (
              <Link
                href="/shop/pedidos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                Mis Pedidos
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-2 space-y-2">
                <div className="px-3 py-2 text-base font-medium text-gray-900">
                  Hola, <span className="font-bold text-blue-600">{user?.nombre}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
