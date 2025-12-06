import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Agregar producto al carrito
      addItem: (producto, cantidad = 1) => {
        const items = get().items;
        const productoId = producto._id || producto.id;
        const existingItem = items.find(item => {
          const itemId = item.producto._id || item.producto.id;
          return itemId === productoId;
        });

        if (existingItem) {
          set({
            items: items.map(item => {
              const itemId = item.producto._id || item.producto.id;
              return itemId === productoId
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item;
            }),
          });
        } else {
          set({ items: [...items, { producto, cantidad }] });
        }
      },

      // Actualizar cantidad
      updateQuantity: (productoId, cantidad) => {
        if (cantidad <= 0) {
          get().removeItem(productoId);
          return;
        }
        set({
          items: get().items.map(item => {
            const itemId = item.producto._id || item.producto.id;
            return itemId === productoId ? { ...item, cantidad } : item;
          }),
        });
      },

      // Eliminar producto
      removeItem: (productoId) => {
        set({
          items: get().items.filter(item => {
            const itemId = item.producto._id || item.producto.id;
            return itemId !== productoId;
          }),
        });
      },

      // Vaciar carrito
      clearCart: () => {
        set({ items: [] });
      },

      // Calcular total
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.producto.precio * item.cantidad,
          0
        );
      },

      // Contar items
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore;
