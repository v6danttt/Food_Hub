import { useEffect, useState } from "react";
 import api from "../api/axios";
   import RestaurantCard from "../components/RestaurentCard";
    

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRestaurants = async (query = "") => {
    try {
      setLoading(true);
      const { data } = await api.get("/restaurants", {
        params: query ? { search: query } : {},
      });
      setRestaurants(data);
      setError("");
    } catch (err) {
      setError("Could not load restaurants. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(search);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl px-8 py-14 text-white mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold max-w-lg">
          Order food from the best restaurants near you
        </h1>
        <p className="mt-3 text-white/90 max-w-md">
          Fresh meals, fast delivery, and every craving covered.
        </p>
        <form onSubmit={handleSearch} className="mt-6 flex max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants or cuisines..."
            className="flex-1 rounded-l-full px-5 py-3 text-gray-900 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 rounded-r-full font-semibold text-sm hover:bg-black transition-colors"
          >
            Search
          </button>
        </form>
      </section>

      <h2 className="font-display text-xl font-semibold mb-4">All Restaurants</h2>

      {loading && <p className="text-ink/60">Loading restaurants...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && restaurants.length === 0 && (
        <p className="text-ink/60">
          No restaurants found. Run <code>npm run seed</code> in the backend folder to add demo data.
        </p>
      )}

      {/* Restaurant Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
  {restaurants.map((r) => (
    <RestaurantCard key={r._id} restaurant={r} />
  ))}
</div>

{/* Why Choose TastyTrack */}
<section className="mt-20">
  <h2 className="text-4xl font-bold text-center mb-10">
    Why Choose TastyTrack?
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <div className="text-5xl">🚀</div>
      <h3 className="text-xl font-bold mt-4">Fast Delivery</h3>
      <p className="text-gray-600 mt-2">
        Get food delivered in under 30 minutes.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <div className="text-5xl">🍔</div>
      <h3 className="text-xl font-bold mt-4">Fresh Food</h3>
      <p className="text-gray-600 mt-2">
        Prepared fresh after every order.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <div className="text-5xl">💳</div>
      <h3 className="text-xl font-bold mt-4">Easy Payments</h3>
      <p className="text-gray-600 mt-2">
        UPI, Cards & Cash on Delivery.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6 text-center">
      <div className="text-5xl">⭐</div>
      <h3 className="text-xl font-bold mt-4">Top Rated</h3>
      <p className="text-gray-600 mt-2">
        Trusted by thousands of customers.
      </p>
    </div>
  </div>
</section>

    {/* Customer Reviews */}
<section className="mt-20">
  <h2 className="text-3xl font-bold text-center mb-10">
    ⭐ What Our Customers Say
  </h2>

  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold">Rahul Sharma</h3>
      <p className="text-yellow-500 text-lg">★★★★★</p>
      <p className="text-gray-600 mt-2">
        Amazing food quality and super fast delivery. Highly recommended!
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold">Priya Patel</h3>
      <p className="text-yellow-500 text-lg">★★★★★</p>
      <p className="text-gray-600 mt-2">
        Best food delivery app. Easy ordering experience.
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-bold">Amit Verma</h3>
      <p className="text-yellow-500 text-lg">★★★★☆</p>
      <p className="text-gray-600 mt-2">
        Delicious food and quick service. Will order again.
      </p>
    </div>
  </div>
</section>

   <section className="mt-20 bg-orange-500 text-white rounded-2xl p-10 text-center">
  <h2 className="text-4xl font-bold">
    🚀 Fastest Delivery in Your City
  </h2>

  <p className="mt-4 text-lg">
    Fresh food delivered to your doorstep in just
    <span className="font-bold"> 30 Minutes</span>.
  </p>

  <div className="grid grid-cols-3 gap-6 mt-10">
    <div>
      <h1 className="text-5xl">🍔</h1>
      <p className="mt-2 font-semibold">1000+ Restaurants</p>
    </div>

    <div>
      <h1 className="text-5xl">🛵</h1>
      <p className="mt-2 font-semibold">Fast Delivery</p>
    </div>

    <div>
      <h1 className="text-5xl">⭐</h1>
      <p className="mt-2 font-semibold">4.9 Customer Rating</p>
    </div>
  </div>
</section>
     <section className="mt-20 bg-gray-100 rounded-xl p-10">
  <h2 className="text-3xl font-bold mb-6">
    📞 Contact Us
  </h2>

  <div className="space-y-3 text-lg">
    <p>📍 Nagpur, Maharashtra, India</p>
    <p>📞 +91 9423685170</p>
    <p>✉ support@tastytrack.com</p>
    <p>🕒 Mon - Sun : 9:00 AM - 11:00 PM</p>
  </div>
</section>
    
    <footer className="mt-20 bg-gray-900 text-white py-8 rounded-t-xl">
  <div className="text-center">
    <h2 className="text-2xl font-bold">
      TastyTrack
    </h2>

    <p className="mt-3 text-gray-400">
      Delicious food delivered at your doorstep.
    </p>

    <p className="mt-5 text-gray-500">
      © {new Date().getFullYear()} TastyTrack. All Rights Reserved.
    </p>
  </div>
</footer>
   
      </div>
  );
};

export default Home;