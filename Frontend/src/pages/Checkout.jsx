import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!cart) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/orders", {
        restaurant: cart.restaurantId,
        items: cart.items,
        deliveryAddress: address,
        paymentMethod,
      });
      clearCart();
      navigate("/my-orders");
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4">{error}</div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-5">
        <div className="bg-white border border-orange-100 rounded-2xl p-4">
          <h2 className="font-semibold text-sm mb-3">Order Summary</h2>
          {cart.items.map((item) => (
            <div key={item.menuItem} className="flex justify-between text-sm py-1">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-sm mt-2 pt-2 border-t border-orange-50">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Delivery Address</label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-1 border border-orange-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Payment Method</label>
          <div className="flex gap-3">
            {["COD", "Card", "UPI"].map((method) => (
              <button
                type="button"
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  paymentMethod === method
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-orange-200 text-ink/70"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-full text-sm transition-colors disabled:opacity-60"
        >
          {loading ? "Placing order..." : `Place Order · ₹${cartTotal}`}
        </button>
      </form>
    </div>
  );
};

export default Checkout;