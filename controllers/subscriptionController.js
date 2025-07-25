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

exports.countSubscription = async (req, res) => {
    console.log("the count subscription by user is:", req.body);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("Missing authorization while fetching the data");
        return res.status(401).json({ message: "Invalid token" });
    }

    const token = authHeader.split(" ")[1];
    let user;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = decoded.email;

        console.log("the logged in user while fetching subscription is:", user)
    } catch (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).json({ message: "Error while verifying token" });
    }
    try {
        const [data] = await db.execute(
            `SELECT * FROM subscriptions WHERE createdBy = ?`,
            [user]
        );
        console.log("User subscriptions:", [data]);
        res.json({ success: true, subscriptions: [data] });
    } catch (dbErr) {
        console.error("Database error:", dbErr.message);
        res.status(500).json({ message: "Database query failed" });
    }

};

exports.editSubscription = async (req, res) => {
    console.log("Edit subscription request:", req.body);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("Missing authorization while editing subscription");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let userEmail;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userEmail = decoded.email;
    } catch (err) {
        console.log("Token verification failed:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }

    const {
        id,        
        plan,
        numberOfMsgs,
        price,
        subscribedAt
    } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Subscription ID is required for editing" });
    }

    try {
        const [rows] = await db.execute(
            `SELECT * FROM subscriptions WHERE id = ? AND createdBy = ?`,
            [id, userEmail]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Subscription not found or unauthorized" });
        }

        const subscription = rows[0];
        const updatedPlan = plan ?? subscription.plan;
        const updatedNumberOfMsgs = numberOfMsgs ?? subscription.numberOfMsgs;
        const updatedPrice = price ?? subscription.price;
        const updatedSubscribedAt = subscribedAt ? new Date(subscribedAt) : new Date(subscription.subscribedAt);
        const updatedRemainingMsgs = updatedNumberOfMsgs - subscription.msgsSent;

        await db.execute(
            `UPDATE subscriptions
            SET plan = ?, numberOfMsgs = ?, remainingMsgs = ?, price = ?, subscribedAt = ?
            WHERE id = ? AND createdBy = ?`,
            [
                updatedPlan,
                updatedNumberOfMsgs,
                updatedRemainingMsgs,
                updatedPrice,
                updatedSubscribedAt,
                id,
                userEmail
            ]
        );

        res.status(200).json({ message: "Subscription updated successfully" });
    } catch (error) {
        console.error("Error updating subscription:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
