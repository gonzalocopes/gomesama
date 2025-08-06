import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import instagramLogo from "../assets/instagram.png";

export default function Home() {
  const [destacados, setDestacados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://gomesama-backend.fly.dev/api/productos/")
      .then((res) => {
        const productosRandom = res.data
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setDestacados(productosRandom);
      })
      .catch((err) => console.error("Error cargando productos destacados:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-red-50 text-center">
      <main className="flex-grow py-10 px-4 pt-24 md:pt-28">
        <motion.img
          src={logo}
          alt="Gomesama Logo"
          className="w-24 md:w-32 mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.h1
          className="text-2xl md:text-4xl font-bold text-gomesamaRed mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Bienvenido a Gomesama
        </motion.h1>

        <motion.p
          className="text-gray-700 max-w-xl mx-auto mb-6 text-sm md:text-base px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          La Tiendita China con los mejores productos importados y snacks asiáticos.
          Realizamos envíos a Zona Sur y alrededores. ¡Pedí fácil, rápido y por WhatsApp!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Link
            to="/catalogo"
            className="bg-gomesamaBright text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow hover:bg-gomesamaGold transition text-sm md:text-base"
          >
            Ver Catálogo
          </Link>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-gomesamaRed mb-6">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2 sm:px-4">
            {destacados.map((p, index) => (
              <motion.div
                key={p.id}
                onClick={() => navigate("/catalogo")}
                className="border rounded-lg shadow bg-white hover:shadow-xl overflow-hidden cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-white">
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm md:text-lg font-bold">{p.nombre}</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    ${p.precio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-8 bg-white shadow-lg rounded-lg p-4 max-w-md mx-auto border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p className="text-sm md:text-base text-gray-700 font-medium">
            🚚 Consultá precios de envío en tu zona por WhatsApp 📲
          </p>
        </motion.div>
      </main>

      <motion.footer
        className="bg-gomesamaRed text-white py-4 mt-auto text-xs md:text-sm text-center px-2"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <p>© {new Date().getFullYear()} Gomesama - Todos los derechos reservados</p>
        <p>
          Desarrollado por{" "}
          <a
            href="https://portafolio-gonzalo-copes.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gomesamaGold hover:underline"
          >
            Gonzalo Copes
          </a>
        </p>
        <p className="mt-3 flex justify-center items-center gap-2">
          <a
            href="https://www.instagram.com/gomesama.tiendachina/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gomesamaGold hover:underline"
          >
            <img src={instagramLogo} alt="Instagram" className="w-4 h-4" />
            Seguinos en Instagram
          </a>
        </p>
      </motion.footer>
    </div>
  );
}
