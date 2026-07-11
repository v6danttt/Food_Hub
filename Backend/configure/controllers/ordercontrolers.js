const pool = require('../config/db');

// @route  POST /api/orders/checkout  (protected)
// Turns the logged-in user's cart into an order, then clears the cart.
exports.checkout = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { delivery_address, phone, payment_method } = req.body;

    if (!delivery_address || !phone) {
      connection.release();
      return res.status(400).json({ message: 'delivery_address and phone are required' });
    }

    const [cartRows] = await connection.query(
      `SELECT ci.menu_item_id, ci.quantity,
              ROUND(m.price * (1 - m.discount_percent / 100), 2) AS unit_price
       FROM cart_items ci
       JOIN menu_items m ON ci.menu_item_id = m.id
       WHERE ci.user_id = ?`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      connection.release();
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const totalAmount = cartRows.reduce((sum, r) => sum + r.unit_price * r.quantity, 0);

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (user_id, total_amount, delivery_address, phone, payment_method, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [req.user.id, totalAmount.toFixed(2), delivery_address, phone, payment_method || 'cod']
    );

    const orderId = orderResult.insertId;

    const orderItemValues = cartRows.map((r) => [orderId, r.menu_item_id, r.quantity, r.unit_price]);
    await connection.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ?',
      [orderItemValues]
    );

    await connection.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Order placed successfully',
      order_id: orderId,
      total_amount: +totalAmount.toFixed(2)
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    res.status(500).json({ message: 'Server error during checkout' });
  }
};

// @route  GET /api/orders/my  (protected) - logged-in user's own orders
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.quantity, oi.price, m.name, m.image_url
         FROM order_items oi
         JOIN menu_items m ON oi.menu_item_id = m.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @route  GET /api/orders/:id  (protected) - single order, owner or admin only
exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];
    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    const [items] = await pool.query(
      `SELECT oi.quantity, oi.price, m.name, m.image_url
       FROM order_items oi
       JOIN menu_items m ON oi.menu_item_id = m.id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// @route  GET /api/orders  (admin only) - all orders, optional ?status= filter
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT o.*, u.name AS customer_name, u.email AS customer_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;
    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const [orders] = await pool.query(query, params);
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @route  PUT /api/orders/:id/status  (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
