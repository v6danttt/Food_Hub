import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyRestaurantForm = { name: "", description: "", cuisine: "", address: "", image: "" };
const emptyItemForm = { name: "", description: "", price: "", category: "Main Course", image: "", isVeg: true };

const statusOptions = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("menu");

  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState(emptyRestaurantForm);

  const [showItemForm, setShowItemForm] = useState(false);
  const [itemForm, setItemForm] = useState(emptyItemForm);

  const [message, setMessage] = useState("");

  const loadRestaurants = async () => {
    const { data } = await api.get("/restaurants/mine/list");
    setRestaurants(data);
    if (data.length > 0 && !selected) setSelected(data[0]);
  };

  useEffect(() => {
    loadRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) return;
    loadMenu();
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const loadMenu = async () => {
    const { data } = await api.get(`/restaurants/${selected._id}`);
    setMenu(data.menu);
  };

  const loadOrders = async () => {
    const { data } = await api.get(`/orders/restaurant/${selected._id}`);
    setOrders(data);
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/restaurants", restaurantForm);
      setRestaurants((prev) => [...prev, data]);
      setSelected(data);
      setShowRestaurantForm(false);
      setRestaurantForm(emptyRestaurantForm);
      setMessage("Restaurant created!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create restaurant");
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/restaurants/${selected._id}/menu`, {
        ...itemForm,
        price: Number(itemForm.price),
      });
      setShowItemForm(false);
      setItemForm(emptyItemForm);
      loadMenu();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add menu item");
    }
  };

  const handleToggleAvailable = async (item) => {
    await api.put(`/menu/${item._id}`, { available: !item.available });
    loadMenu();
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Remove this item from the menu?")) return;
    await api.delete(`/menu/${itemId}`);
    loadMenu();
  };

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Restaurant Dashboard</h1>
        <button
          onClick={() => setShowRestaurantForm(!showRestaurantForm)}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
        >
          + New Restaurant
        </button>
      </div>

      {message && <p className="text-sm text-brand-700 bg-brand-50 rounded-lg px-3 py-2 mb-4">{message}</p>}

      {showRestaurantForm && (
        <form onSubmit={handleCreateRestaurant} className="bg-white border border-orange-100 rounded-2xl p-5 mb-6 space-y-3">
          <h3 className="font-semibold text-sm mb-1">Create a new restaurant</h3>
          <input required placeholder="Restaurant name" value={restaurantForm.name}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
            className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
          <input required placeholder="Cuisine (e.g. Italian, North Indian)" value={restaurantForm.cuisine}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })}
            className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
          <input required placeholder="Address" value={restaurantForm.address}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, address: e.target.value })}
            className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
          <input placeholder="Image URL (optional)" value={restaurantForm.image}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, image: e.target.value })}
            className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Short description" value={restaurantForm.description}
            onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
            className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
          <button className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-full">Create</button>
        </form>
      )}

      {restaurants.length === 0 ? (
        <p className="text-ink/60">You haven't created a restaurant yet. Click "+ New Restaurant" above to get started.</p>
      ) : (
        <>
          <div className="flex gap-2 mb-6 flex-wrap">
            {restaurants.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelected(r)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selected?._id === r._id ? "bg-ink text-white border-ink" : "border-orange-200 text-ink/70"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-6 border-b border-orange-100">
            {["menu", "orders"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 -mb-px transition-colors ${
                  tab === t ? "border-brand-600 text-brand-600" : "border-transparent text-ink/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "menu" && (
            <div>
              <button
                onClick={() => setShowItemForm(!showItemForm)}
                className="mb-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
              >
                + Add Menu Item
              </button>

              {showItemForm && (
                <form onSubmit={handleAddItem} className="bg-white border border-orange-100 rounded-2xl p-5 mb-6 space-y-3">
                  <input required placeholder="Item name" value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
                  <input required type="number" min="0" placeholder="Price (₹)" value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Category (e.g. Starters, Main Course)" value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Image URL (optional)" value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
                  <textarea placeholder="Description" value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    className="w-full border border-orange-100 rounded-lg px-3 py-2 text-sm" />
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={itemForm.isVeg}
                      onChange={(e) => setItemForm({ ...itemForm, isVeg: e.target.checked })} />
                    Vegetarian
                  </label>
                  <button className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-full">Add Item</button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <div key={item._id} className="bg-white border border-orange-100 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-ink/50">₹{item.price} · {item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAvailable(item)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.available ? "Available" : "Hidden"}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {menu.length === 0 && <p className="text-ink/60 text-sm">No menu items yet.</p>}
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 && <p className="text-ink/60 text-sm">No orders received yet.</p>}
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-orange-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-sm">{order.customer?.name}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs font-semibold border border-orange-200 rounded-full px-2 py-1"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-ink/50 mb-2">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-ink/70">{order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</p>
                  <div className="flex justify-between mt-2 pt-2 border-t border-orange-50 text-sm font-semibold">
                    <span>Total</span>
                    <span>₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;