const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    cuisine: {
      type: String,
      required: [true, "Cuisine type is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
