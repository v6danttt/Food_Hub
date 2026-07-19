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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {restaurants.map((r) => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
      </div>
    </div>
  );
};

export default Home;