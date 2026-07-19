import{ Link }from"react-router-dom";
import react from"react";
const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="*:group block bg-white border border-orange-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-ink">{restaurant.name}</h3>
          <span className="flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ★ {restaurant.rating?.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-ink/60 mt-1">{restaurant.cuisine}</p>
        <p className="text-xs text-ink/40 mt-1 truncate">{restaurant.address}</p>
        {!restaurant.isOpen && (
          <span className="inline-block mt-2 text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            Currently Closed
          </span>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;