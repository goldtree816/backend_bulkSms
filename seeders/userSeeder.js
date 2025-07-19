const db = require("../models/db");

const createUsersTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(50) NOT NULL,
        l_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        confirmPassword VARCHAR(255) NOT NULL
      );
    `);
    console.log("Users table created or already exists.");
  } catch (error) {
    console.error("Error creating users table:", error.message);
  }
};

const seedUsers = async () => {
  const users = [
    {
      f_name: "jf",
      l_name: "Doe",
      email: "john.dae@example.com",
      password: "password1234",
      confirmPassword: "password1234",
    },
    {
      f_name: "Jane",
      l_name: "Doe",
      email: "janee.dos@example.com",
      password: "password1234",
      confirmPassword: "password1234",
    },
  ];

  try {
    await createUsersTable(); // Ensure the table exists before inserting data

    for (const user of users) {
      await db.execute(
        "INSERT INTO users (f_name, l_name, email, password,confirmPassword) VALUES (?, ?, ?, ?,?)",
        [
          user.f_name,
          user.l_name,
          user.email,
          user.password,
          user.confirmPassword,
        ]
      );
    }
    console.log("Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  }
};

seedUsers();
