// routes/ContactsRoutes.js
const express = require("express");
const {
  getAllContacts,
  getContactById,
  createContacts,
  updateContacts,
  deleteContacts,
} = require("../controllers/userRelationContact");
const {
  UserContactValidation,
  validate,
} = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware"); // Import your middleware

const router = express.Router();

// Apply middleware before route handlers
router.get("/contacts", getAllContacts);

router.get("/:id", getContactById);

router.post(
  "/",

  UserContactValidation,
  validate,
  createContacts
);

router.put(
  "/:id",
  authMiddleware,
  UserContactValidation,
  validate,
  updateContacts
);

router.delete("/:id", authMiddleware, deleteContacts);

module.exports = router;
