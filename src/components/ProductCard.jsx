'use client';

import Image from 'next/image';
import Link from 'next/link';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';

export default function ProductCard({ producto }) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const handleAddToCart = () => {
    addItem(producto, 1);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      {/* Imagen del producto con overlay */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {producto.imagenes && producto.imagenes.length > 0 ? (
          <Image
            src={producto.imagenes[0].startsWith('http') 
              ? producto.imagenes[0] 
              : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${producto.imagenes[0]}`
            }
            alt={producto.nombre}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-20 h-20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Sin imagen</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {!producto.activo && (
            <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
              No disponible
            </span>
          )}
          {producto.stock > 0 && producto.stock < 10 && producto.activo && (
            <span className="bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
              ¡Últimas unidades!
            </span>
          )}
        </div>

        {/* Overlay con botón de vista rápida */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Link
            href={`/shop/productos/${producto.id || producto._id}`}
            className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-gray-100"
          >
            👁️ Vista Rápida
          </Link>
        </div>
      </div>

      {/* Información del producto */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
          {producto.nombre}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {producto.descripcion || 'Sin descripción disponible'}
        </p>

        {/* Precio y Stock */}
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-500 mb-1">Precio</p>
            <span className="text-3xl font-extrabold text-blue-600">
              S/ {producto.precio?.toFixed(2) || '0.00'}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Stock</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
              producto.stock > 10 
                ? 'bg-green-100 text-green-700' 
                : producto.stock > 0 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {producto.stock > 0 ? `${producto.stock} unid.` : 'Agotado'}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Link
            href={`/shop/productos/${producto.id || producto._id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 text-center text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Detalles
          </Link>
          
          {user?.rol === 'CLIENTE' && producto.activo && producto.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
