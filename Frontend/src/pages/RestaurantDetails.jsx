import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data.restaurant);
        setMenu(data.menu);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAdd = (item) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(restaurant._id, restaurant.name, {
      menuItem: item._id,
      name: item.name,
      price: item.price,
    });
  };

  if (loading) return <p className="max-w-6xl mx-auto px-4 py-10 text-ink/60">Loading...</p>;
  if (!restaurant)
    return <p className="max-w-6xl mx-auto px-4 py-10 text-ink/60">Restaurant not found.</p>;

  // Group menu items by category for cleaner display
  const grouped = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="rounded-2xl overflow-hidden mb-8 h-56 relative">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-white font-display text-3xl font-extrabold">{restaurant.name}</h1>
          <p className="text-white/80 text-sm mt-1">
            {restaurant.cuisine} · {restaurant.address}
          </p>
        </div>
      </div>

      {Object.keys(grouped).length === 0 && (
        <p className="text-ink/60">This restaurant hasn't added any menu items yet.</p>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-3">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 bg-white border border-orange-100 rounded-xl p-3 items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 border-2 rounded-sm flex-shrink-0 ${
                        item.isVeg ? "border-green-600" : "border-red-600"
                      }`}
                    >
                      <span
                        className={`block w-1.5 h-1.5 m-auto mt-[1px] rounded-full ${
                          item.isVeg ? "bg-green-600" : "bg-red-600"
                        }`}
                      />
                    </span>
                    <h3 className="font-semibold text-sm">{item.name}</h3>
                  </div>
                  <p className="text-xs text-ink/50 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold text-sm">₹{item.price}</span>
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.available}
                      className="text-xs font-semibold bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white px-3 py-1.5 rounded-full transition-colors"
                    >
                      {item.available ? "Add" : "Unavailable"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantDetail;
