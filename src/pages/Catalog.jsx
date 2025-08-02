import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";


export default function Catalog() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const REFRESH_INTERVAL = 10; // segundos

  const fetchProductos = () => {
    axios
      .get("http://127.0.0.1:8000/api/productos/")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error cargando productos:", err));
  };

  useEffect(() => {
    fetchProductos();
    const interval = setInterval(fetchProductos, REFRESH_INTERVAL * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCantidadChange = (id, value) => {
    setCantidades({
      ...cantidades,
      [id]: Math.min(
        Math.max(1, value),
        productos.find((p) => p.id === id)?.stock || 1
      ),
    });
  };

  // 🔍 Filtrar productos según categoría y búsqueda mejorada
  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria =
      categoriaSeleccionada === "Todos" ||
      p.categoria?.toLowerCase() === categoriaSeleccionada.toLowerCase();

    const terminoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(terminoBusqueda) ||
      p.descripcion?.toLowerCase().includes(terminoBusqueda) ||
      p.categoria?.toLowerCase().includes(terminoBusqueda);

    return coincideCategoria && coincideBusqueda;
  });

  const categorias = [
    "Todos",
    "Golosinas",
    "Salados",
    "Gaseosas",
    "Galletitas",
    "Ramen",
    "Postres",
  ];

  return (
    <div className="pt-24 md:pt-28 px-4">
      {/* Barra de búsqueda */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:w-1/2 md:w-1/3 border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-gomesamaGold"
        />
      </div>

      {/* Filtros de categorías */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
              categoriaSeleccionada === cat
                ? "bg-gomesamaBright text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gomesamaGold hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mostrar mensaje si no hay productos */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center text-gray-600 text-lg font-semibold mt-10">
          No hay productos disponibles
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productosFiltrados.map((p, index) => (
            <motion.div
              key={p.id}
              className="border rounded-xl shadow bg-white relative flex flex-col overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
            >
              {/* Imagen */}
              <div className="relative w-full h-60 flex justify-center items-center bg-white">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
                {p.stock === 0 && (
                  <div className="absolute top-4 -right-14 w-40 bg-red-600 text-white text-center font-bold rotate-45 shadow-lg">
                    SIN STOCK
                  </div>
                )}
              </div>

              {/* Info producto */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-bold text-gomesamaRed">{p.nombre}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {p.descripcion || "Producto sin descripción"}
                  </p>
                  <p className="text-gray-700 font-semibold mb-1">${p.precio}</p>
                  <p className="text-xs text-gray-500 mb-2">
                    Stock disponible: {p.stock}
                  </p>
                </div>

                {/* Selector de cantidad */}
                <div className="flex items-center gap-2 mt-auto">
                  <input
                    type="number"
                    min="1"
                    max={p.stock}
                    value={cantidades[p.id] || 1}
                    onChange={(e) =>
                      handleCantidadChange(p.id, parseInt(e.target.value))
                    }
                    disabled={p.stock === 0}
                    className="w-16 border rounded px-2 py-1 text-center"
                  />
                  <button
                    onClick={() =>
                      addToCart({ ...p, cantidad: cantidades[p.id] || 1 })
                    }
                    disabled={p.stock === 0}
                    className={`flex-1 py-2 rounded text-white font-semibold transition ${
                      p.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gomesamaBright hover:bg-gomesamaGold"
                    }`}
                  >
                    {p.stock === 0 ? "No disponible" : "Agregar"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
