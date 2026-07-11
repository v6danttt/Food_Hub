const pool = require('../config/db');

// @route  GET /api/cart  (protected) - get logged-in user's cart with item details + total
exports.getCart = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ci.id AS cart_item_id, ci.quantity, m.id AS menu_item_id, m.name, m.price,
              m.image_url, m.discount_percent,
              ROUND(m.price * (1 - m.discount_percent / 100), 2) AS unit_price
       FROM cart_items ci
       JOIN menu_items m ON ci.menu_item_id = m.id
       WHERE ci.user_id = ?
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    const items = rows.map((r) => ({ ...r, line_total: +(r.unit_price * r.quantity).toFixed(2) }));
    const total = items.reduce((sum, item) => sum + item.line_total, 0);

    res.json({ items, total: +total.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
};

// @route  POST /api/cart  (protected) - add item to cart, or bump quantity if already present
exports.addToCart = async (req, res) => {
  try {
    const { menu_item_id, quantity } = req.body;
    const qty = quantity && quantity > 0 ? quantity : 1;

    if (!menu_item_id) {
      return res.status(400).json({ message: 'menu_item_id is required' });
    }

    const [item] = await pool.query('SELECT id FROM menu_items WHERE id = ?', [menu_item_id]);
    if (item.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await pool.query(
      `INSERT INTO cart_items (user_id, menu_item_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, menu_item_id, qty]
    );

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
};

// @route  PUT /api/cart/:cartItemId  (protected) - set exact quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1 (use DELETE to remove)' });
    }

    const [result] = await pool.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.cartItemId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating cart item' });
  }
};

// @route  DELETE /api/cart/:cartItemId  (protected)
exports.removeCartItem = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [req.params.cartItemId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error removing cart item' });
  }
};

// @route  DELETE /api/cart  (protected) - clear entire cart
exports.clearCart = async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error clearing cart' });
  }
};
