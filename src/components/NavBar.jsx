import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.png";
import instagramLogo from "../assets/instagram.png"; // 👈 tu logo de Instagram
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";

export default function NavBar() {
  const [isCartOpen, setCartOpen] = useState(false);
  const { cart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gomesamaRed px-6 py-3 flex justify-between items-center shadow-lg">
        {/* Logo + Nombre */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <img
              src={logo}
              alt="Gomesama"
              className="w-12 h-12 rounded-full hover:scale-105 transition-transform duration-300"
            />
            <span className="text-lg md:text-2xl font-bold text-white hover:text-gomesamaGold transition">
              Gomesama
            </span>
          </Link>

          {/* Botón menú hamburguesa */}
          <button
            className="text-white md:hidden text-2xl relative z-50"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Menú desktop */}
        <div className="hidden md:flex items-center space-x-6 font-semibold">
          <Link
            to="/"
            className="text-white hover:text-gomesamaGold transition"
          >
            Inicio
          </Link>
          <Link
            to="/catalogo"
            className="text-white hover:text-gomesamaGold transition"
          >
            Catálogo
          </Link>

          {/* Instagram Desktop */}
          <a
            href="https://www.instagram.com/gomesama.tiendachina/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition transform"
            title="Seguinos en Instagram"
          >
            <img
              src={instagramLogo}
              alt="Instagram"
              className="w-6 h-6 object-contain"
            />
          </a>

          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-gomesamaBright px-4 py-2 rounded hover:bg-gomesamaGold transition text-white"
          >
            🛒 Carrito
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Menú hamburguesa (efecto cortina) */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setMenuOpen(false)}
              />

              {/* Cortina desplegable */}
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-14 right-4 bg-gomesamaRed text-white z-50 shadow-lg rounded-lg overflow-hidden w-48 flex flex-col"
              >
                <button
                  className="self-end text-xl px-3 py-1"
                  onClick={() => setMenuOpen(false)}
                >
                  ✖
                </button>
                <Link
                  to="/"
                  className="px-4 py-2 hover:text-gomesamaGold"
                  onClick={handleLinkClick}
                >
                  Inicio
                </Link>
                <Link
                  to="/catalogo"
                  className="px-4 py-2 hover:text-gomesamaGold"
                  onClick={handleLinkClick}
                >
                  Catálogo
                </Link>

                {/* Instagram Mobile */}
                <a
                  href="https://www.instagram.com/gomesama.tiendachina/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 flex items-center gap-2 hover:text-pink-400"
                  onClick={handleLinkClick}
                >
                  <img
                    src={instagramLogo}
                    alt="Instagram"
                    className="w-5 h-5 object-contain"
                  />
                  Instagram
                </a>

                <button
                  onClick={() => {
                    setCartOpen(true);
                    setMenuOpen(false);
                  }}
                  className="relative bg-gomesamaBright mx-4 my-2 px-4 py-2 rounded hover:bg-gomesamaGold transition"
                >
                  🛒 Carrito
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Drawer Carrito */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
