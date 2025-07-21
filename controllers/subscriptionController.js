require("dotenv").config();

const db = require("../models/db");
const jwt = require("jsonwebtoken");

exports.createSubscription = async (req, res) => {
    console.log("Request body is:", req.body);

    const {
        plan,
        numberOfMsgs,
        price,
        subscribedAt
    } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("Missing authorization while subscribing");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let createdBy;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        createdBy = decoded.email;
    } catch (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }

    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                plan VARCHAR(255),
                numberOfMsgs INT,
                remainingMsgs INT,
                msgsSent INT,
                price INT,
                numberOfSubscription INT,
                createdBy VARCHAR(255),
                subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        const [countRows] = await db.execute(
            `SELECT COUNT(*) AS count FROM subscriptions WHERE createdBy = ?`,
            [createdBy]
        );

        const numberOfSubscription = (countRows[0].count ?? 0) + 1;
        const msgsSent = 0;
        const remainingMsgs = numberOfMsgs ?? 0;

        const [result] = await db.execute(
            `INSERT INTO subscriptions 
            (plan, numberOfMsgs, remainingMsgs, msgsSent, price, numberOfSubscription, createdBy, subscribedAt) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                plan ?? null,
                numberOfMsgs ?? null,
                remainingMsgs,
                msgsSent,
                price ?? null,
                numberOfSubscription,
                createdBy ?? null,
                subscribedAt ? new Date(subscribedAt) : new Date()
            ]
        );

        console.log("Subscription inserted into DB. ID:", result.insertId);

        res.status(201).json({
            message: "Subscription Created",
            subscriptionId: result.insertId,
        });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
