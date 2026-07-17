import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="font-display text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-ink/60 mb-6">Browse restaurants and add something tasty.</p>
        <Link
          to="/"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold mb-1">Your Cart</h1>
      <p className="text-sm text-ink/60 mb-6">Ordering from {cart.restaurantName}</p>

      <div className="bg-white border border-orange-100 rounded-2xl divide-y divide-orange-50">
        {cart.items.map((item) => (
          <div key={item.menuItem} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-ink/50">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(item.menuItem, -1)}
                className="w-7 h-7 rounded-full border border-orange-200 text-brand-600 font-bold"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuItem, 1)}
                className="w-7 h-7 rounded-full border border-orange-200 text-brand-600 font-bold"
              >
                +
              </button>
              <span className="w-16 text-right font-semibold text-sm">
                ₹{item.price * item.quantity}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white border border-orange-100 rounded-2xl p-4 flex items-center justify-between">
        <span className="font-display font-semibold">Total</span>
        <span className="font-display font-bold text-lg">₹{cartTotal}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-full text-sm transition-colors"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;