import { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (producto) => {
    const cantidadSeleccionada = Number(producto.cantidad) || 1;

    setCart((prev) => {
      const itemExistente = prev.find((item) => item.id === producto.id);
      
      if (itemExistente) {
        // Verificar stock antes de sumar
        if (itemExistente.cantidad + cantidadSeleccionada > producto.stock) {
          alert(`No puedes agregar más "${producto.nombre}". Stock máximo: ${producto.stock}`);
          return prev;
        }

        // Sumar la cantidad seleccionada
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidadSeleccionada }
            : item
        );
      } else {
        // Si es nuevo, verificar stock
        if (producto.stock <= 0) {
          alert(`"${producto.nombre}" no está disponible (Sin stock)`);
          return prev;
        }

        // Agregar con la cantidad seleccionada
        return [...prev, { ...producto, cantidad: cantidadSeleccionada }];
      }
    });
  };

  const removeFromCart = (producto) => {
    setCart((prev) => prev.filter((item) => item.id !== producto.id));
  };

  const clearCart = () => setCart([]);

  const getItemQuantityInCart = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.cantidad : 0;
  };

  const getAvailableStock = (producto) => {
    const cantidadEnCarrito = getItemQuantityInCart(producto.id);
    return producto.stock - cantidadEnCarrito;
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      getItemQuantityInCart,
      getAvailableStock
    }}>
      {children}
    </CartContext.Provider>
  );
};
