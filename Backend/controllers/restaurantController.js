const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// @desc    Get all restaurants (with optional search)
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const { search, cuisine } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: "i" };
    }

    const restaurants = await Restaurant.find(query).sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant with its menu
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const menu = await MenuItem.find({ restaurant: restaurant._id });
    res.json({ restaurant, menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a restaurant (restaurant-role users only)
// @route   POST /api/restaurants
// @access  Private/Restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, description, cuisine, address, image } = req.body;

    if (!name || !cuisine || !address) {
      return res.status(400).json({ message: "Name, cuisine and address are required" });
    }

    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      description,
      cuisine,
      address,
      image,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a restaurant (must be the owner)
// @route   PUT /api/restaurants/:id
// @access  Private/Restaurant
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this restaurant" });
    }

    Object.assign(restaurant, req.body);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurants owned by logged-in user
// @route   GET /api/restaurants/mine/list
// @access  Private/Restaurant
const getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user._id });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  getMyRestaurants,
};
