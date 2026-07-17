import Navbar from "./components/Navbar/navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/home";
import Cart from "./pages/Cart/cart";
import PlaceOrder from "./pages/Place order/place order";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
      </Routes>
    </div>
  );
}

export default App;