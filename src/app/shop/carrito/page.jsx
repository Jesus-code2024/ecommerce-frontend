'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import useCartStore from '@/store/cartStore';
import useAuthStore from '@/store/authStore';
import api from '@/lib/api';

export default function CarritoPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getTotal } =
    useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('tarjeta');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [paymentData, setPaymentData] = useState({
    numeroTarjeta: '',
    nombreTitular: '',
    fechaVencimiento: '',
    cvv: '',
  });

  const [direccion, setDireccion] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'Perú',
    telefono: '',
  });

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
              Debes iniciar sesión como cliente para acceder al carrito
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

  const handleCrearPedido = async () => {
    if (items.length === 0) {
      setNotification({ show: true, message: 'El carrito está vacío', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    if (!direccion.direccion || !direccion.ciudad || !direccion.codigoPostal || !direccion.telefono) {
      setNotification({ show: true, message: 'Por favor completa todos los campos de la dirección de envío', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      return;
    }

    // Abrir modal de pago
    setShowPaymentModal(true);
  };

  const procesarPago = async () => {
    // Validar datos de pago
    if (paymentMethod === 'tarjeta') {
      if (!paymentData.numeroTarjeta || !paymentData.nombreTitular || !paymentData.fechaVencimiento || !paymentData.cvv) {
        setNotification({ show: true, message: 'Por favor completa todos los datos de la tarjeta', type: 'error' });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        return;
      }
      
      // Validar formato de tarjeta
      if (paymentData.numeroTarjeta.replace(/\s/g, '').length !== 16) {
        setNotification({ show: true, message: 'Número de tarjeta inválido', type: 'error' });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
        return;
      }
    }

    setLoading(true);
    try {
      // Simular procesamiento de pago (2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const pedidoData = {
        items: items.map((item) => ({
          productoId: item.producto._id || item.producto.id,
          cantidad: item.cantidad,
          precio: item.producto.precio,
        })),
        direccionEnvio: direccion,
      };

      await api.post('/pedidos', pedidoData);
      clearCart();
      setShowPaymentModal(false);
      setNotification({ show: true, message: '¡Pago procesado exitosamente! Pedido creado.', type: 'success' });
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
        router.push('/shop/pedidos');
      }, 2000);
    } catch (error) {
      setNotification({ show: true, message: error.response?.data?.error || error.response?.data?.mensaje || 'Error al crear el pedido', type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <div className="text-8xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-500 mb-8">
                ¡Agrega productos y empieza tu compra!
              </p>
              <button
                onClick={() => router.push('/shop/productos')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-bold text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Explorar Productos
              </button>
            </div>
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
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header del Carrito */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
              <span className="text-4xl">🛒</span>
              Carrito de Compras
            </h1>
            <p className="text-gray-600">{items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.producto._id || item.producto.id}-${index}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
                >
                  <div className="flex gap-6">
                    <div className="relative w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.producto.imagenes &&
                      item.producto.imagenes.length > 0 ? (
                        <Image
                          src={item.producto.imagenes[0].startsWith('http') 
                            ? item.producto.imagenes[0] 
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'}${item.producto.imagenes[0]}`
                          }
                          alt={item.producto.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {item.producto.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {item.producto.descripcion || 'Sin descripción'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        S/ {item.producto.precio.toFixed(2)}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.producto._id || item.producto.id,
                                item.cantidad - 1
                              )
                            }
                            className="w-8 h-8 bg-white rounded-md hover:bg-gray-200 transition-colors font-bold text-gray-700 shadow-sm"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-bold text-gray-900">{item.cantidad}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.producto._id || item.producto.id,
                                item.cantidad + 1
                              )
                            }
                            className="w-8 h-8 bg-white rounded-md hover:bg-gray-200 transition-colors font-bold text-gray-700 shadow-sm"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.producto._id || item.producto.id)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                      <p className="text-2xl font-bold text-gray-900">
                        S/{' '}
                        {(item.producto.precio * item.cantidad).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors mt-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Vaciar carrito
              </button>
            </div>

            {/* Resumen y dirección */}
            <div className="space-y-4">
              {/* Dirección de envío */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dirección de Envío
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Dirección completa (Calle y número)"
                    value={direccion.direccion}
                    onChange={(e) =>
                      setDireccion({ ...direccion, direccion: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Ciudad"
                    value={direccion.ciudad}
                    onChange={(e) =>
                      setDireccion({ ...direccion, ciudad: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Código Postal"
                    value={direccion.codigoPostal}
                    onChange={(e) =>
                      setDireccion({
                        ...direccion,
                        codigoPostal: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="País"
                    value={direccion.pais}
                    onChange={(e) =>
                      setDireccion({ ...direccion, pais: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={direccion.telefono}
                    onChange={(e) =>
                      setDireccion({ ...direccion, telefono: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 text-white sticky top-4">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Resumen del Pedido
                </h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-blue-100">
                    <span>Subtotal ({items.length} {items.length === 1 ? 'producto' : 'productos'})</span>
                    <span className="font-semibold">S/ {getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-blue-100">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      Envío
                    </span>
                    <span className="font-semibold">S/ 10.00</span>
                  </div>
                  <div className="border-t border-blue-400 pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>S/ {(getTotal() + 10).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCrearPedido}
                  disabled={loading}
                  className="w-full bg-white text-blue-600 py-4 rounded-lg hover:bg-blue-50 font-bold text-lg disabled:bg-gray-200 disabled:text-gray-500 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Continuar al Pago
                    </>
                  )}
                </button>
                
                <div className="mt-4 text-center text-blue-100 text-sm">
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pago 100% seguro
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    Procesar Pago
                  </h2>
                  <p className="text-gray-500">Completa los detalles para finalizar tu compra</p>
                </div>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Resumen del pedido */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Resumen del Pedido
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">S/ {getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-semibold text-gray-900">S/ 10.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-blue-600 pt-3 border-t border-blue-200 mt-2">
                    <span>Total a pagar:</span>
                    <span>S/ {(getTotal() + 10).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Método de Pago
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('tarjeta')}
                    className={`p-6 border-2 rounded-xl text-center transition-all transform hover:scale-105 ${
                      paymentMethod === 'tarjeta'
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl mb-3">💳</div>
                    <div className="font-bold text-gray-900">Tarjeta de Crédito/Débito</div>
                    <div className="text-xs text-gray-500 mt-1">Visa, Mastercard, etc.</div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('efectivo')}
                    className={`p-6 border-2 rounded-xl text-center transition-all transform hover:scale-105 ${
                      paymentMethod === 'efectivo'
                        ? 'border-blue-600 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-4xl mb-3">💵</div>
                    <div className="font-bold text-gray-900">Pago en Efectivo</div>
                    <div className="text-xs text-gray-500 mt-1">Contra entrega</div>
                  </button>
                </div>
              </div>

              {/* Formulario de tarjeta */}
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-4 mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4">Detalles de la Tarjeta</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      value={paymentData.numeroTarjeta}
                      onChange={(e) => 
                        setPaymentData({
                          ...paymentData,
                          numeroTarjeta: formatCardNumber(e.target.value)
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      placeholder="JUAN PEREZ"
                      value={paymentData.nombreTitular}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          nombreTitular: e.target.value.toUpperCase()
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Vencimiento
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        maxLength="5"
                        value={paymentData.fechaVencimiento}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setPaymentData({
                            ...paymentData,
                            fechaVencimiento: value
                          });
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength="3"
                        value={paymentData.cvv}
                        onChange={(e) =>
                          setPaymentData({
                            ...paymentData,
                            cvv: e.target.value.replace(/\D/g, '')
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 text-sm text-yellow-800 flex items-start gap-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <span className="font-bold">Simulación de pago:</span> Este es un entorno de prueba. Puedes usar cualquier número de tarjeta válido.
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje para efectivo */}
              {paymentMethod === 'efectivo' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">💵</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Pago Contra Entrega</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Podrás pagar en efectivo cuando recibas tu pedido. El repartidor llevará cambio si lo necesitas.
                      </p>
                      <p className="text-xs text-gray-500">
                        ✓ Sin comisiones adicionales • ✓ Paga al recibir • ✓ 100% seguro
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={procesarPago}
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pagar S/ {(getTotal() + 10).toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
