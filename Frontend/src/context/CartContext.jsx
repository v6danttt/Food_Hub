import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // cart shape: { restaurantId, restaurantName, items: [{ menuItem, name, price, quantity }] }
  const [cart, setCart] = useState(null);

  const addToCart = (restaurantId, restaurantName, item) => {
    setCart((prev) => {
      // Starting a cart from a different restaurant clears the old one
      if (prev && prev.restaurantId !== restaurantId) {
        const shouldReplace = window.confirm(
          "Your cart has items from another restaurant. Start a new cart?"
        );
        if (!shouldReplace) return prev;
        return {
          restaurantId,
          restaurantName,
          items: [{ ...item, quantity: 1 }],
        };
      }

      const base = prev || { restaurantId, restaurantName, items: [] };
      const existing = base.items.find((i) => i.menuItem === item.menuItem);

      const items = existing
        ? base.items.map((i) =>
            i.menuItem === item.menuItem ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...base.items, { ...item, quantity: 1 }];

      return { ...base, items };
    });
  };

  const updateQuantity = (menuItemId, delta) => {
    setCart((prev) => {
      if (!prev) return prev;
      const items = prev.items
        .map((i) =>
          i.menuItem === menuItemId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0);
      return items.length ? { ...prev, items } : null;
    });
  };

  const clearCart = () => setCart(null);

  const cartTotal =
    cart?.items.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0;

  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, clearCart, cartTotal, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);