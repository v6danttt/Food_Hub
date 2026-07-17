const express = require("express");
const router = express.Router();
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  getMyRestaurants,
} = require("../controllers/restaurantController");
const { addMenuItem } = require("../controllers/menuController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getRestaurants);
router.get("/mine/list", protect, authorize("restaurant"), getMyRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, authorize("restaurant"), createRestaurant);
router.put("/:id", protect, authorize("restaurant"), updateRestaurant);
router.post("/:id/menu", protect, authorize("restaurant"), addMenuItem);

module.exports = router;