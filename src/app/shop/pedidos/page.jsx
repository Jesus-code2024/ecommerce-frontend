'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

const estadoColores = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  PROCESANDO: 'bg-blue-100 text-blue-800',
  ENVIADO: 'bg-purple-100 text-purple-800',
  ENTREGADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
};

export default function MisPedidosPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.rol === 'CLIENTE') {
      cargarPedidos();
    }
  }, [isAuthenticated, user]);

  const cargarPedidos = async () => {
    try {
      const { data } = await api.get('/pedidos/mios');
      setPedidos(data);
    } catch (error) {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.rol !== 'CLIENTE') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acceso Restringido
            </h2>
            <p className="text-gray-600 mb-4">
              Debes iniciar sesión como cliente
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Mis Pedidos
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tienes pedidos todavía</p>
              <button
                onClick={() => router.push('/shop/productos')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => (
                <div
                  key={pedido._id || pedido.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Pedido #{pedido._id || pedido.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(pedido.fecha).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        estadoColores[pedido.estado]
                      }`}
                    >
                      {pedido.estado}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Productos
                    </h3>
                    <div className="space-y-2">
                      {pedido.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600">
                            {item.cantidad || 0}x Producto (S/{' '}
                            {(item.precio || item.precioUnitario || 0).toFixed(2)})
                          </span>
                          <span className="font-medium">
                            S/ {((item.cantidad || 0) * (item.precio || item.precioUnitario || 0)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Dirección:</span>{' '}
                          {pedido.direccionEnvio?.direccion || pedido.direccionEnvio?.calle || 'N/A'},{' '}
                          {pedido.direccionEnvio?.ciudad || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          S/ {(pedido.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
