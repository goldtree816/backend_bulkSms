const db = require("../models/db");

const createContactsTable = async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(50) NOT NULL,
        l_name VARCHAR(50) NOT NULL,
        address VARCHAR(100) NOT NULL,
        phoneNumber VARCHAR(255) NOT NULL
      );
    `);
    console.log("Contacts table created or already exists.");
  } catch (error) {
    console.error("Error creating contacts table:", error.message);
  }
};

const seedContacts = async () => {
  const users = [
    {
      f_name: "jf",
      l_name: "Doe",
      address: "djfjdfgjfd",
      phoneNumber: "9824877222",
    },
    {
      f_name: "Jane",
      l_name: "Doe",
      address: "kfmgkdfnjsgn",
      phoneNumber: "9823456783",
    },
  ];

  try {
    await createContactsTable(); // Ensure the table exists before inserting data

    for (const user of users) {
      await db.execute(
        "INSERT INTO contacts (f_name, l_name, address, phoneNumber) VALUES (?, ?, ?, ?)",
        [user.f_name, user.l_name, user.address, user.phoneNumber]
      );
    }
    console.log("Contacts seeded successfully!");
  } catch (error) {
    console.error("Error seeding contacts:", error.message);
  }
};

seedContacts();
