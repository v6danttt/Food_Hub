import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-display font-extrabold text-xl text-brand-600 flex items-center gap-1">
          <span>🍔</span> TastyTrack
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium text-ink">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Restaurants
          </Link>

          {user?.role === "customer" && (
            <>
              <Link to="/cart" className="relative hover:text-brand-600 transition-colors">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/my-orders" className="hover:text-brand-600 transition-colors">
                My Orders
              </Link>
            </>
          )}

          {user?.role === "restaurant" && (
            <Link to="/dashboard" className="hover:text-brand-600 transition-colors">
              Dashboard
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-ink/60 hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-ink text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-black transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-orange-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-brand-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
