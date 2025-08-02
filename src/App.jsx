import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Catalog from "./pages/Catalog";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/carrito" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
