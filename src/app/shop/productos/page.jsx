'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    categoriaId: '',
    busqueda: '',
  });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      const { data } = await api.get('/productos');
      // La API devuelve un objeto con: { page, limit, total, totalPages, filters, data }
      const productosArray = Array.isArray(data) ? data : (data.data || data.productos || []);
      setProductos(productosArray);
    } catch (error) {
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const { data } = await api.get('/categorias');
      // ...existing code...
      const categoriasArray = Array.isArray(data) ? data : (data.categorias || []);
      setCategorias(categoriasArray);
    } catch (error) {
      setCategorias([]);
    }
  };

  const productosFiltrados = productos.filter((producto) => {
    const cumpleBusqueda = producto.nombre
      .toLowerCase()
      .includes(filtros.busqueda.toLowerCase());
    const cumpleCategoria =
      !filtros.categoriaId || producto.categoriaId === filtros.categoriaId;
    return cumpleBusqueda && cumpleCategoria;
  });

  return (
    <>
      <Navbar />
      
      {/* Hero Section con Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 animate-fade-in">
              Catálogo de Productos
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto">
              Descubre nuestra selección exclusiva de productos de alta calidad
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-blue-600 hover:shadow-xl transition-all">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{productos.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Productos Totales</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-green-600 hover:shadow-xl transition-all">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{productosFiltrados.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Disponibles</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-purple-600 hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{categorias.length}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Categorías</p>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Filtros Mejorado */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
            <div className="flex items-center mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Filtros de Búsqueda</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Buscar Producto
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escribe el nombre del producto..."
                    value={filtros.busqueda}
                    onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                  />
                  <svg className="absolute left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📂 Filtrar por Categoría
                </label>
                <select
                  value={filtros.categoriaId}
                  onChange={(e) => setFiltros({ ...filtros, categoriaId: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                >
                  <option value="">🌟 Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id || cat._id} value={cat.id || cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botón para limpiar filtros */}
            {(filtros.busqueda || filtros.categoriaId) && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setFiltros({ categoriaId: '', busqueda: '' })}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>

          {/* Lista de productos con Loading mejorado */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">Cargando productos increíbles...</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="inline-block p-6 sm:p-8 bg-white rounded-full shadow-lg mb-4 sm:mb-6">
                <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No se encontraron productos</h3>
              <p className="text-sm sm:text-base text-gray-600">Intenta cambiar los filtros de búsqueda</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                  Mostrando <span className="text-blue-600 font-bold">{productosFiltrados.length}</span> productos
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {productosFiltrados.map((producto, index) => (
                  <ProductCard key={producto.id || producto._id || index} producto={producto} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
