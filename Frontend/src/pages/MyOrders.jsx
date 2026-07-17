import { useEffect, useState } from "react";
import api from "../api/axios";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-orange-100 text-orange-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-10 text-ink/60">Loading orders...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 && <p className="text-ink/60">You haven't placed any orders yet.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border border-orange-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">{order.restaurant?.name}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-ink/50 mb-2">
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <div className="text-sm text-ink/70">
              {order.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-orange-50 text-sm font-semibold">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;