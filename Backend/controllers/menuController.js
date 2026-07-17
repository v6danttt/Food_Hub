const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

// helper to confirm the logged-in user owns the restaurant
const verifyOwnership = async (restaurantId, userId) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return { error: "Restaurant not found", status: 404 };
  if (restaurant.owner.toString() !== userId.toString()) {
    return { error: "Not authorized to modify this restaurant's menu", status: 403 };
  }
  return { restaurant };
};

// @desc    Add a menu item to a restaurant
// @route   POST /api/restaurants/:id/menu
// @access  Private/Restaurant
const addMenuItem = async (req, res) => {
  try {
    const { error, status } = await verifyOwnership(req.params.id, req.user._id);
    if (error) return res.status(status).json({ message: error });

    const { name, description, price, category, image, isVeg } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    const item = await MenuItem.create({
      restaurant: req.params.id,
      name,
      description,
      price,
      category,
      image,
      isVeg,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:itemId
// @access  Private/Restaurant
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    const { error, status } = await verifyOwnership(item.restaurant, req.user._id);
    if (error) return res.status(status).json({ message: error });

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:itemId
// @access  Private/Restaurant
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    const { error, status } = await verifyOwnership(item.restaurant, req.user._id);
    if (error) return res.status(status).json({ message: error });

    await item.deleteOne();
    res.json({ message: "Menu item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMenuItem, updateMenuItem, deleteMenuItem };