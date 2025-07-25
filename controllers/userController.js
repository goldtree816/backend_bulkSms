// controllers/userController.js
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json({ users: rows });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ user: rows[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { f_name, l_name, email, password, confirmPassword } = req.body;
  const token = jwt.sign(req.body, process.env.JWT_SECRET, { expiresIn: "1h" });
  console.log("token", token);
  try {
    const [result] = await db.execute(
      "INSERT INTO users (f_name, l_name, email, password, confirmPassword, image_url) VALUES (?, ?, ?, ?, ?, ?)",
      [f_name, l_name, email, password, confirmPassword, null]
    );

    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { f_name, l_name, email, password, confirmPassword } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE users SET f_name = ?, l_name = ?, email = ?, password = ? ,confirmPassword=? WHERE id = ?",
      [f_name, l_name, email, password, id, confirmPassword]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  console.log("ababab", req.body);
  try {
    const { email, password } = req.body;

    // Check if user exists
    const [rows] = await db.execute(
      "SELECT id, email, password, image_url FROM users WHERE email = ?",
      [email]
    );
    console.log("rowssss", rows);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid  mail or password" });
    }

    const user = rows[0];
    console.log("dfjgf", user.password, password);
    if (password != user.password) {
      return res.status(400).json({ message: "Invalid emmml or password" });
    }
    const token = jwt.sign(req.body, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user.id, email: user.email, firstname: user.f_name, lastname: user.l_name, image_url: user.image_url } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.imageUpload = async (req, res) => {
  let connection;
  try {
    console.log("File received:", req.file);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const userId = req.body.userId;

    console.log("ther request is:", req.body)

    console.log("User ID:", userId);
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    connection = await db.getConnection(); // Get a connection from the pool
    console.log("Database connected...");

    const sql = "UPDATE Users SET image_url = ? WHERE id = ?";
    console.log("Executing query...");

    const [result] = await connection.execute(sql, [imageUrl, userId]);
    console.log("Query executed successfully:", result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Sending response...");
    res.json({ message: "Profile image updated successfully", imageUrl });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err });
  } finally {
    if (connection) connection.release(); // Always release the connection
  }
};