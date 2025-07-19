require("dotenv").config();
const db = require("../models/db");
const jwt = require("jsonwebtoken");

exports.createGroup = async (req, res) => {
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body);

    const { groupName, fileName, contactList, groupType } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("Missing Authorization Header");
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let createdBy;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        createdBy = decoded.email;
        console.log("Token decoded. CreatedBy:", createdBy);
    } catch (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS groups (
                id INT AUTO_INCREMENT PRIMARY KEY,
                groupName VARCHAR(255),
                fileName VARCHAR(255),
                contactList JSON,
                groupType VARCHAR(255), 
                createdBy VARCHAR(255),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        const [result] = await db.execute(
            "INSERT INTO groups (groupName, fileName, contactList, groupType, createdBy) VALUES (?, ?, ?, ?, ?)",
            [groupName, fileName, JSON.stringify(contactList), groupType, createdBy]
        );


        console.log("Group inserted into DB. ID:", result.insertId);
        res.status(201).json({
            message: "Group Created",
            groupId: result.insertId,
        });
    } catch (err) {
        console.log("DB error:", err.message);
        res.status(500).json({
            message: "Error creating group",
            error: err.message,
        });
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM groups");
        res.json({ groups: rows });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error fetching users", error: err.message });
    }
};

exports.getGroupById = async (req, res) => {
    const { id } = req.params;
    try {
        const [data] = await db.execute(`SELECT * FROM groups WHERE id = ?`, [id]);
        console.log("the data is:", [data])
        if (data.length === 0) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.json(data[0]);
    } catch (error) {
        console.error("Error fetching group by ID:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.editGroupById = async (req, res) => {
    const { id } = req.params;
    const { groupName, fileName, contactList } = req.body;

    try {
        const [result] = await db.execute(
            `UPDATE groups SET groupName = ?, fileName = ?, contactList = ? WHERE id = ?`,
            [groupName, fileName, JSON.stringify(contactList), id]
        );
        res.json({ message: "Group updated successfully" });
    } catch (error) {
        console.error("Error updating group:", error);
        res.status(500).json({ message: "Failed to update group" });
    }
};

exports.deleteGroupById = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.execute(`DELETE FROM groups WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error("Error deleting group:", error);
        res.status(500).json({ message: "Failed to delete group" });
    }
};

