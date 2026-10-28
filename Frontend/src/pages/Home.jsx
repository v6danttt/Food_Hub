import { useEffect, useState } from "react";
import api from "../api/axios";
import RestaurantCard from "../components/RestaurentCard";

const foodPhoto =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1100&q=85";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const fetchRestaurants = async (query = "") => {
    try {
      const { data } = await api.get("/restaurants", {
        params: query ? { search: query } : {},
      });
      setRestaurants(data);
      setError("");
    } catch {
      setError("Could not load restaurants. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    api.get("/restaurants").then(({ data }) => {
      if (cancelled) return;
      setRestaurants(data);
      setError("");
    }).catch(() => {
      if (!cancelled) {
        setError("Could not load restaurants. Is the backend server running?");
      }
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    setLoading(true);
    fetchRestaurants(search);
    document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTilt = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({ x: (0.5 - y) * 13, y: (x - 0.5) * 15 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const handleCuisine = (cuisine) => {
    setSearch(cuisine);
    setLoading(true);
    fetchRestaurants(cuisine);
    document.getElementById("restaurants")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="home-page">
      <div className="home-shell">
        <section className="hero-panel" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              GOOD FOOD. GOOD MOOD.
            </div>
            <h1 id="hero-title">
              Your next
              <br />
              <span>craving</span> called.
            </h1>
            <p className="hero-description">
              Big flavor, delivered fresh. Find your new favorite bite from the
              best kitchens around you.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="What are you craving?"
                aria-label="Search restaurants or cuisines"
              />
              <button type="submit">Find food <span aria-hidden="true">→</span></button>
            </form>

            <div className="hero-social-proof">
              <div className="avatar-stack" aria-hidden="true">
                <span>😊</span><span>😎</span><span>🥰</span>
              </div>
              <div>
                <div className="social-stars" aria-label="Rated 4.9 out of 5">★★★★★</div>
                <p>Loved by foodies everywhere</p>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-sparkle sparkle-one" aria-hidden="true">✦</div>
            <div className="hero-sparkle sparkle-two" aria-hidden="true">✧</div>
            <div
              className="hero-food-card"
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <img src={foodPhoto} alt="Juicy gourmet burger with fresh toppings" />
              <div className="food-card-glow" />
            </div>
            <div className="floating-badge delivery-badge">
              <span className="badge-icon">🛵</span>
              <span><strong>Hot & fresh</strong><small>At your door in 30 min</small></span>
            </div>
            <div className="floating-badge rating-badge">
              <span className="rating-star">★</span>
              <span><strong>4.9 / 5</strong><small>Foodie approved</small></span>
            </div>
            <div className="hero-caption">
              <span>THE CROWD FAVORITE</span>
              <strong>Stacked & saucy 🍔</strong>
            </div>
          </div>
          <div className="hero-bottom-note"><span>01</span> YOUR TABLE IS WAITING</div>
        </section>

        <section className="perks-strip" aria-label="TastyTrack benefits">
          <div><span className="perk-icon">⚡</span><span><strong>Fast delivery</strong><small>Good food, no long waits</small></span></div>
          <span className="perks-divider" />
          <div><span className="perk-icon">🥬</span><span><strong>Freshly made</strong><small>Made to order, every time</small></span></div>
          <span className="perks-divider" />
          <div><span className="perk-icon">♡</span><span><strong>Local favorites</strong><small>Handpicked near you</small></span></div>
        </section>

        <section className="restaurant-section" id="restaurants">
          <div className="section-heading">
            <div>
              <span className="section-kicker">A LITTLE SOMETHING FOR EVERYONE</span>
              <h2>Explore the menu<span>.</span></h2>
            </div>
            <a href="#restaurants" className="text-link">Browse all <span aria-hidden="true">↗</span></a>
          </div>
          <div className="cuisine-pills" aria-label="Browse by cuisine">
            <button type="button" className={!search ? "active" : ""} onClick={() => handleCuisine("")}>🍽️ <span>All food</span></button>
            <button type="button" className={search === "Burger" ? "active" : ""} onClick={() => handleCuisine("Burger")}>🍔 <span>Burgers</span></button>
            <button type="button" className={search === "Pizza" ? "active" : ""} onClick={() => handleCuisine("Pizza")}>🍕 <span>Pizza</span></button>
            <button type="button" className={search === "Sushi" ? "active" : ""} onClick={() => handleCuisine("Sushi")}>🍣 <span>Sushi</span></button>
            <button type="button" className={search === "Indian" ? "active" : ""} onClick={() => handleCuisine("Indian")}>🍛 <span>Indian</span></button>
          </div>

          {loading && <p className="status-message">Finding the good stuff...</p>}
          {error && <p className="status-message error-message">{error}</p>}
          {!loading && !error && restaurants.length === 0 && (
            <p className="status-message">
              No restaurants found. Run <code>npm run seed</code> in the backend folder to add demo data.
            </p>
          )}
          {!loading && !error && restaurants.length > 0 && (
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </section>

        <section className="quote-banner">
          <span className="quote-mark" aria-hidden="true">“</span>
          <p>Happiness is just one<br className="mobile-break" /> <em>good meal</em> away.</p>
          <span className="quote-caption">LET’S MAKE TONIGHT DELICIOUS</span>
          <span className="quote-doodle" aria-hidden="true">✳</span>
        </section>

        <section className="reviews-section">
          <div className="section-heading">
            <div>
              <span className="section-kicker">THE PEOPLE HAVE SPOKEN</span>
              <h2>Good food, good words<span>.</span></h2>
            </div>
            <div className="review-summary"><strong>4.9</strong><span>★★★★★<small>from happy humans</small></span></div>
          </div>
          <div className="review-grid">
            <article className="review-card"><div className="review-stars">★★★★★</div><p>“Amazing food quality and super fast delivery. Highly recommended!”</p><div className="review-person"><span className="review-avatar">R</span><strong>Rahul Sharma<small>Food enthusiast</small></strong></div></article>
            <article className="review-card"><div className="review-stars">★★★★★</div><p>“Best food delivery app. Such an easy ordering experience.”</p><div className="review-person"><span className="review-avatar peach">P</span><strong>Priya Patel<small>Happy customer</small></strong></div></article>
            <article className="review-card"><div className="review-stars">★★★★★</div><p>“Delicious food and quick service. Already planning my next order.”</p><div className="review-person"><span className="review-avatar green">A</span><strong>Amit Verma<small>Local foodie</small></strong></div></article>
          </div>
        </section>

        <section className="contact-banner">
          <div><span className="section-kicker">WE’RE HERE FOR THE CRAVINGS</span><h2>Need a hand?</h2><p>Our friendly team is just a message away.</p></div>
          <a href="mailto:support@tastytrack.com">support@tastytrack.com <span aria-hidden="true">↗</span></a>
        </section>

        <footer className="home-footer">
          <a className="footer-brand" href="/">🍔 TastyTrack</a>
          <span>Made for the love of a really good meal.</span>
          <span>© {new Date().getFullYear()} TastyTrack</span>
        </footer>
      </div>
    </main>
  );
};

export default Home;
