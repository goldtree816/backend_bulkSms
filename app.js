// app.js
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const userontact = require("./routes/userRelationRoutes");
const twilioRoutes = require("./routes/twilioRoutes");
const groupRoutes = require("./routes/groupRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes")
const cors = require("cors");
const db = require("./models/db");
require("./seeders/userSeeder");
require("./seeders/contactSeeder");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/users", userRoutes);
app.use("/usersContact", userontact);
app.use("/numbers", twilioRoutes )
app.use("/groups", groupRoutes )
app.use("/userSubscription", subscriptionRoutes)
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  // Uncomment the line below to run the seeder only once
  // require('./seeders/userSeeder');
});
