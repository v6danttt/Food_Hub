const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Restaurant = require("./models/Restaurant");
const MenuItem = require("./models/MenuItem");

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await User.deleteMany();
  await Restaurant.deleteMany();
  await MenuItem.deleteMany();

  console.log("Creating demo users...");
  const owner = await User.create({
    name: "Ramesh Kumar",
    email: "owner@demo.com",
    password: "password123",
    role: "restaurant",
    phone: "9876543210",
    address: "Restaurant Row, Nagpur",
  });

  await User.create({
    name: "Priya Sharma",
    email: "customer@demo.com",
    password: "password123",
    role: "customer",
    phone: "9123456780",
    address: "MG Road, Nagpur",
  });

  console.log("Creating demo restaurants...");
  const restaurant1 = await Restaurant.create({
    owner: owner._id,
    name: "Spice Junction",
    description: "Authentic North Indian cuisine with rich flavours",
    cuisine: "North Indian",
    address: "Civil Lines, Nagpur",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    rating: 4.5,
  });

  const restaurant2 = await Restaurant.create({
    owner: owner._id,
    name: "Pizza Point",
    description: "Wood-fired pizzas and Italian favourites",
    cuisine: "Italian",
    address: "Sadar, Nagpur",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
    rating: 4.2,
  });

  console.log("Creating demo menu items...");
  await MenuItem.insertMany([
    {
      restaurant: restaurant1._id,
      name: "Paneer Butter Masala",
      description: "Cottage cheese cubes in rich tomato gravy",
      price: 220,
      category: "Main Course",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    },
    {
      restaurant: restaurant1._id,
      name: "Butter Naan",
      description: "Soft leavened bread with butter",
      price: 45,
      category: "Breads",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400",
    },
    {
      restaurant: restaurant1._id,
      name: "Chicken Biryani",
      description: "Fragrant basmati rice cooked with spiced chicken",
      price: 260,
      category: "Main Course",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400",
    },
    {
      restaurant: restaurant2._id,
      name: "Margherita Pizza",
      description: "Classic pizza with mozzarella and basil",
      price: 250,
      category: "Pizza",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    },
    {
      restaurant: restaurant2._id,
      name: "Pepperoni Pizza",
      description: "Loaded with pepperoni and mozzarella",
      price: 320,
      category: "Pizza",
      isVeg: false,
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
    },
    {
      restaurant: restaurant2._id,
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter and herbs",
      price: 120,
      category: "Starters",
      isVeg: true,
      image: "https://images.unsplash.com/photo-1619535860434-ba1d8fa32b56?w=400",
    },
  ]);

  console.log("Seed data created successfully!");
  console.log("Restaurant owner login -> email: owner@demo.com | password: password123");
  console.log("Customer login          -> email: customer@demo.com | password: password123");
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});