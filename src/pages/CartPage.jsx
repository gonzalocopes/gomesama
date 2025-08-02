import { useCart } from "../context/CartContext";
import axios from "axios";

export default function CartPage() {
  const { cart, clearCart } = useCart();

  const telefono = "5491136424020";
  const mensaje = encodeURIComponent(
    `Hola, quiero pedir:\n${cart.map((i) => `- ${i.nombre} x${i.cantidad}`).join("\n")}\nTotal: $${cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0)}`
  );

  const enviarPedido = async () => {
    try {
      // Armamos datos del pedido
      const pedidoData = {
        nombre_cliente: "Cliente Web",  // Luego podrías pedir nombre real
        telefono_cliente: telefono,
        productos: JSON.stringify(cart.map(i => ({
          id: i.id,
          nombre: i.nombre,
          cantidad: i.cantidad
        }))),
        total: cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
        completado: false
      };

      // Enviar a Django
      await axios.post("http://127.0.0.1:8000/api/pedidos/", pedidoData);
      
      // Abrir WhatsApp
      window.open(`https://wa.me/${telefono}?text=${mensaje}`, "_blank");

      // Limpiar carrito
      clearCart();
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("Hubo un error al enviar el pedido.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gomesamaRed mb-6">Carrito</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Tu carrito está vacío</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-3 border-b pb-2">
              <span>{item.nombre} x{item.cantidad}</span>
            </div>
          ))}
          <div className="mt-6 flex gap-4">
            <button
              onClick={enviarPedido}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Finalizar pedido por WhatsApp
            </button>
            <button 
              onClick={clearCart} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
}
