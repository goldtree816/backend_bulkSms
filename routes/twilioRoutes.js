const express = require('express');
const {
    listAvailablePhoneNumber,
    sendMessage,
    sendWhatsApp,
    sendEmail

} = require("../controllers/buynumber")
const router = express.Router();
router.get("/country", listAvailablePhoneNumber);
router.post("/message", sendMessage)
router.post("/whatsAppMessage",sendWhatsApp)
router.post("/email", sendEmail)

module.exports = router;
