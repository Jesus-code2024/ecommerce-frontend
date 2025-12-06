import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section Mejorado */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden">
        {/* Decoraciones de fondo animadas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Contenido Hero */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-400 text-gray-900 shadow-lg">
                ✨ Bienvenido a tu tienda online favorita
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8 leading-tight">
              Descubre productos
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-100 bg-clip-text text-transparent drop-shadow-2xl">
                increíbles
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
              La mejor selección de productos con precios inigualables. 
              Compra de forma fácil, rápida y segura.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/shop/productos"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-900 bg-white rounded-xl overflow-hidden shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🛍️ Explorar Catálogo
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                href="/auth/register"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-900 bg-yellow-400 border-2 border-yellow-500 rounded-xl hover:bg-yellow-500 hover:border-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center gap-2">
                  🎉 Crear Cuenta
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
            {[
              { icon: '🎯', number: '1000+', label: 'Productos' },
              { icon: '⭐', number: '4.9/5', label: 'Calificación' },
              { icon: '📦', number: '24h', label: 'Envío Express' },
              { icon: '🔒', number: '100%', label: 'Seguro' },
            ].map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 shadow-lg">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-blue-100 text-sm font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Sección de Características */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia de compra online
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl shadow-lg group-hover:scale-110 transition-transform">
                🛍️
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Amplio Catálogo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Miles de productos de las mejores marcas a tu alcance. Encuentra exactamente lo que buscas.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white text-4xl shadow-lg group-hover:scale-110 transition-transform">
                🚚
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Envío Rápido
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Recibe tus pedidos en tiempo récord. Envío express disponible en 24 horas.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-4xl shadow-lg group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Compra Segura
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Transacciones 100% seguras con encriptación de última generación para tu tranquilidad.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Final */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-white font-medium mb-10">
            Únete a miles de clientes satisfechos y descubre ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop/productos"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-700 bg-white rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Ver Todos los Productos →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold mb-4">🛒 E-Commerce</h3>
              <p className="text-gray-400">Tu tienda online de confianza</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/shop/productos" className="hover:text-white transition-colors">Productos</Link></li>
                <li><Link href="/auth/register" className="hover:text-white transition-colors">Crear Cuenta</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">
                Email: contacto@ecommerce.com<br />
                Tel: +51 999 999 999
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 E-Commerce. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
