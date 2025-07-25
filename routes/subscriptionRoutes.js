const express = require("express");
const{
    createSubscription,
    countSubscription
} = require("../controllers/subscriptionController")
const router = express.Router();

router.post("/createSubscription", createSubscription)
router.get("/subscriptionByUser", countSubscription)


module.exports= router;