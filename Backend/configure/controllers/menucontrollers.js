const pool = require('../config/db');

// @route  GET /api/menu   (public) - list all items, optional ?category= filter
exports.getAllItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT m.*, c.name AS category_name
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
    `;
    const params = [];

    if (category) {
      query += ' WHERE c.name = ?';
      params.push(category);
    }

    query += ' ORDER BY m.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching menu items' });
  }
};

// @route  GET /api/menu/:id  (public)
exports.getItemById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, c.name AS category_name
       FROM menu_items m
       LEFT JOIN categories c ON m.category_id = c.id
       WHERE m.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching menu item' });
  }
};

// @route  POST /api/menu  (admin only)
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, discount_percent, is_available } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO menu_items (name, description, price, image_url, category_id, discount_percent, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        image_url || null,
        category_id || null,
        discount_percent || 0,
        is_available === undefined ? true : is_available
      ]
    );

    res.status(201).json({ message: 'Menu item created', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating menu item' });
  }
};

// @route  PUT /api/menu/:id  (admin only)
exports.updateItem = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id, discount_percent, is_available } = req.body;

    const [existing] = await pool.query('SELECT id FROM menu_items WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await pool.query(
      `UPDATE menu_items
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           image_url = COALESCE(?, image_url),
           category_id = COALESCE(?, category_id),
           discount_percent = COALESCE(?, discount_percent),
           is_available = COALESCE(?, is_available)
       WHERE id = ?`,
      [name, description, price, image_url, category_id, discount_percent, is_available, req.params.id]
    );

    res.json({ message: 'Menu item updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating menu item' });
  }
};

// @route  DELETE /api/menu/:id  (admin only)
exports.deleteItem = async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM menu_items WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting menu item' });
  }
};

// @route  GET /api/menu/categories/all  (public)
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
};
