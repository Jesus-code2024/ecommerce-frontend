'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function AdminProductosPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoriaId: '',
    imagenes: [],
  });
  const [imagenesNuevas, setImagenesNuevas] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.rol === 'ADMIN') {
      cargarProductos();
      cargarCategorias();
    }
  }, [isAuthenticated, user]);

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
      const categoriasArray = Array.isArray(data) ? data : (data.categorias || []);
      // ...existing code...
      setCategorias(categoriasArray);
    } catch (error) {
      setCategorias([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar que se haya seleccionado una categoría
      if (!formData.categoriaId) {
        setNotification({ show: true, message: 'Debes seleccionar una categoría', type: 'error' });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        return;
      }

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio', parseFloat(formData.precio));
      formDataToSend.append('stock', parseInt(formData.stock));
      formDataToSend.append('categoriaId', formData.categoriaId);

      // Agregar imágenes nuevas
      imagenesNuevas.forEach((file) => {
        formDataToSend.append('imagenes', file);
      });

      if (editando) {
        await api.put(`/productos/${editando}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotification({ show: true, message: 'Producto actualizado exitosamente', type: 'success' });
      } else {
        await api.post('/productos', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotification({ show: true, message: 'Producto creado exitosamente', type: 'success' });
      }

      setShowModal(false);
      setEditando(null);
      resetForm();
      cargarProductos();
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } catch (error) {
      const mensajeError = error.response?.data?.error || error.response?.data?.mensaje || error.message || 'Error al guardar producto';
      setNotification({ show: true, message: mensajeError, type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleEditar = (producto) => {
    const productoId = producto._id || producto.id;
    setEditando(productoId);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      categoriaId: producto.categoriaId || '',
      imagenes: producto.imagenes || [],
    });
    setShowModal(true);
  };

  const handleEliminar = async (producto) => {
    const productoId = producto._id || producto.id;
    if (!confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
      return;
    }

    try {
      await api.delete(`/productos/${productoId}`);
      setNotification({ show: true, message: 'Producto eliminado exitosamente', type: 'success' });
      cargarProductos();
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } catch (error) {
      setNotification({ show: true, message: 'Error al eliminar producto', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleCambiarEstado = async (producto) => {
    const productoId = producto._id || producto.id;
    try {
      await api.patch(`/productos/${productoId}/estado`, { activo: !producto.activo });
      setNotification({ show: true, message: 'Estado actualizado', type: 'success' });
      cargarProductos();
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } catch (error) {
      setNotification({ show: true, message: 'Error al cambiar estado', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      categoriaId: '',
      imagenes: [],
    });
    setImagenesNuevas([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenesNuevas(files);
  };

  if (!isAuthenticated || user?.rol !== 'ADMIN') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-4">Solo administradores</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* Notificación Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className={`px-6 py-4 rounded-lg shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {notification.type === 'success' ? '✅' : '❌'}
              </span>
              <span className="font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Productos
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/admin/categorias')}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Ver Categorías
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setEditando(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                + Nuevo Producto
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando productos...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {productos.map((producto, index) => (
                    <tr key={producto.id || producto._id || index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {producto.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          S/ {producto.precio.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {producto.stock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            producto.activo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {producto.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEditar(producto)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleCambiarEstado(producto)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {producto.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleEliminar(producto)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editando ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      placeholder="Ej: Laptop HP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      required
                      value={formData.descripcion}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descripcion: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      placeholder="Describe el producto..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.precio}
                        onChange={(e) =>
                          setFormData({ ...formData, precio: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      required
                      value={formData.categoriaId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoriaId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categorias.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imágenes del Producto
                    </label>
                    
                    {/* Mostrar imágenes existentes si estamos editando */}
                    {editando && formData.imagenes && formData.imagenes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-2">Imágenes actuales:</p>
                        <div className="flex gap-2 flex-wrap">
                          {formData.imagenes.map((img, index) => (
                            <div key={index} className="relative w-20 h-20">
                              <img
                                src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-full object-cover rounded border"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {editando 
                        ? 'Selecciona nuevas imágenes para reemplazar las actuales (opcional)'
                        : 'Puedes seleccionar hasta 5 imágenes'}
                    </p>
                    {imagenesNuevas.length > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {imagenesNuevas.length} archivo(s) seleccionado(s)
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        setEditando(null);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editando ? 'Actualizar' : 'Crear'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
