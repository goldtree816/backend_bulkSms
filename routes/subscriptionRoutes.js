const express = require("express");
const{
    createSubscription
} = require("../controllers/subscriptionController")
const router = express.Router();

router.post("/createSubscription", createSubscription)


module.exports= router;