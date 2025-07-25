const express = require("express");
const{
    createSubscription,
    countSubscription,
    editSubscription
} = require("../controllers/subscriptionController")
const router = express.Router();

router.post("/createSubscription", createSubscription)
router.get("/subscriptionByUser", countSubscription)
router.put("/:id/editSunscription" , editSubscription)


module.exports= router;