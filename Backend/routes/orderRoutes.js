const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("customer"), placeOrder);
router.get("/my", protect, authorize("customer"), getMyOrders);
router.get(
  "/restaurant/:restaurantId",
  protect,
  authorize("restaurant"),
  getRestaurantOrders
);
router.put("/:id/status", protect, authorize("restaurant"), updateOrderStatus);

module.exports = router;
