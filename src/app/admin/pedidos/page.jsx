'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

const ESTADOS = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'EN_PROCESO', label: 'En Proceso', color: 'bg-blue-100 text-blue-800' },
  { value: 'ENVIADO', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  { value: 'ENTREGADO', label: 'Entregado', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELADO', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
];

export default function AdminPedidosPage() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const { data } = await api.get('/pedidos');
      setPedidos(data);
    } catch (error) {
      mostrarNotificacion('Error al cargar pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await api.patch(`/pedidos/${pedidoId}/estado`, { estado: nuevoEstado });
      
      // Actualizar el estado local
      setPedidos(pedidos.map(p => 
        (p._id || p.id) === pedidoId ? { ...p, estado: nuevoEstado } : p
      ));
      
      mostrarNotificacion('Estado actualizado correctamente', 'success');
    } catch (error) {
      mostrarNotificacion(error.response?.data?.error || 'Error al cambiar estado', 'error');
    }
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    setNotification({ mensaje, tipo });
    setTimeout(() => setNotification(null), 3000);
  };

  const getEstadoColor = (estado) => {
    const estadoObj = ESTADOS.find(e => e.value === estado);
    return estadoObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (estado) => {
    const estadoObj = ESTADOS.find(e => e.value === estado);
    return estadoObj?.label || estado;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Notificaciones */}
        {notification && (
          <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.tipo === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.mensaje}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            ← Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-2">Administra todos los pedidos del sistema</p>
        </div>

        {/* Lista de Pedidos */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <div
                key={pedido._id || pedido.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                {/* Cabecera del Pedido */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Pedido: <span className="font-mono">{(pedido._id || pedido.id)?.toString().slice(-8)}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Usuario ID: <span className="font-mono">{pedido.usuarioId?.toString().slice(-8)}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Fecha: {new Date(pedido.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  {/* Total */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      S/ {(pedido.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Dirección de Envío */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h3>
                  <p className="text-sm text-gray-700">
                    {pedido.direccionEnvio?.direccion || pedido.direccionEnvio?.calle || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    {pedido.direccionEnvio?.ciudad}, {pedido.direccionEnvio?.pais} - {pedido.direccionEnvio?.codigoPostal}
                  </p>
                  {pedido.direccionEnvio?.telefono && (
                    <p className="text-sm text-gray-700">
                      Tel: {pedido.direccionEnvio.telefono}
                    </p>
                  )}
                </div>

                {/* Items del Pedido */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Productos</h3>
                  <div className="space-y-2">
                    {pedido.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm border-b border-gray-200 pb-2"
                      >
                        <div className="flex-1">
                          <p className="text-gray-700">Producto ID: {item.productoId?.toString().slice(-8)}</p>
                          <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-700">
                            S/ {((item.precio || item.precioUnitario || 0) * item.cantidad).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            S/ {(item.precio || item.precioUnitario || 0).toFixed(2)} c/u
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estado y Cambio de Estado */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm text-gray-600 mr-2">Estado actual:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(pedido.estado)}`}>
                      {getEstadoLabel(pedido.estado)}
                    </span>
                  </div>
                  
                  {/* Selector de Estado */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Cambiar a:</label>
                    <select
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido._id || pedido.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
