// controllers/userController.js
const db = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Get all Contacts
exports.getAllContacts = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM contacts");
    res.json({ Contacts: rows });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching Contacts", error: err.message });
  }
};

// Get user by ID
exports.getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute("SELECT * FROM contacts WHERE id = ?", [
      id,
    ]);
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
exports.createContacts = async (req, res) => {
  const { user_id, f_name, l_name, address, phoneNumber } = req.body;

  const [rows] = await db.execute("SELECT id FROM contacts WHERE id = ?", [
    user_id,
  ]);
  if (rows.length < 0) {
    res.status(500).json({ message: "User id is not found" });
  }

  try {
    const [result] = await db.execute(
      "INSERT INTO contacts (f_name, l_name, email, address, phoneNumber) VALUES (?, ?, ?, ?,?)",
      [user_id, f_name, l_name, email, address, phoneNumber]
    );
    res.status(201).json({ message: "User created", userId: result.insertId });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// Update a user
exports.updateContacts = async (req, res) => {
  const { id } = req.params;
  const { user_id, f_name, l_name, email, address, phoneNumber } = req.body;

  try {
    const [result] = await db.execute(
      "UPDATE Contacts SET f_name = ?, l_name = ?, email = ?, password = ? ,confirmPassword=? WHERE id = ?",
      [user_id, f_name, l_name, email, address, phoneNumber]
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
exports.deleteContacts = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM Contacts WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};
