const express = require("express");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  imageUpload,
} = require("../controllers/userController");
const {
  createUserValidation,
  validate,
  loginUserValidation,
} = require("../middleware/validationMiddleware");
const authenticateToken = require("../middleware/tokenGenerator");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "uploads");

// Ensure the "uploads" folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure path is absolute
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

router.get("/", getAllUsers);
// router.get("/me", getUserByToken);
router.get("/:id", getUserById);
router.post("/register", createUserValidation, validate, createUser);
router.put("/:id", createUserValidation, validate, updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUserValidation, validate, loginUser);
const upload = multer({ storage: storage });
router.post("/upload", upload.single("image"), imageUpload);

module.exports = router;