import { useCart } from "../context/CartContext";
import { X, Trash2 } from "lucide-react";
import axios from "axios";

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((acc, item) => {
    const cantidad = Number(item.cantidad) || 1;
    const precio = Number(item.precio) || 0;
    return acc + precio * cantidad;
  }, 0);

  const handleFinalizar = async () => {
    try {
      // 1️⃣ Enviar pedido al backend
      await axios.post("http://127.0.0.1:8000/api/pedidos/", {
        nombre_cliente: "Cliente Web",
        telefono_cliente: "5491136424020",
        productos: JSON.stringify(
          cart.map(item => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad || 1
          }))
        ),
        total: total,
        completado: false
      });

      // 2️⃣ Enviar mensaje a WhatsApp
      const mensaje = `*Nuevo Pedido Gomesama*%0A` +
        cart.map(item => {
          const cantidad = Number(item.cantidad) || 1;
          return `• ${item.nombre} x${cantidad} - $${(item.precio * cantidad).toFixed(2)}`;
        }).join("%0A") +
        `%0A*Total:* $${total.toFixed(2)}%0A Confirmar pedido en este chat`;

      const url = `https://wa.me/5491136424020?text=${mensaje}`;
      window.open(url, "_blank");

      clearCart();
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-gomesamaRed">Carrito</h2>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío</p>
        ) : (
          cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center mb-3 border-b pb-2"
            >
              <div>
                <p className="font-semibold">{item.nombre}</p>
                <p className="text-sm text-gray-500">
                  x{item.cantidad || 1} - ${Number(item.precio).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t">
          <p className="font-bold mb-3">
            Total: ${total.toFixed(2)}
          </p>
          <div className="flex justify-between gap-2">
            <button
              onClick={clearCart}
              className="bg-gray-400 text-white w-1/2 py-2 rounded hover:bg-gray-500"
            >
              Vaciar
            </button>
            <button
              onClick={handleFinalizar}
              className="bg-gomesamaRed text-white w-1/2 py-2 rounded hover:bg-gomesamaGold"
            >
              Finalizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
