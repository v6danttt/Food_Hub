const express = require("express");
const router = express.Router();
const { updateMenuItem, deleteMenuItem } = require("../controllers/menuController");
const { protect, authorize } = require("../middleware/auth");

router.put("/:itemId", protect, authorize("restaurant"), updateMenuItem);
router.delete("/:itemId", protect, authorize("restaurant"), deleteMenuItem);

module.exports = router;