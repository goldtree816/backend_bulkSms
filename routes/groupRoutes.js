const express= require('express');
const{
    createGroup,
    getAllGroups,
    getGroupById,
    editGroupById,
    deleteGroupById
} = require("../controllers/groupController");

const multer = require('multer');
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { validate, createGroupValidation } = require('../middleware/validationMiddleware');

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

router.post("/", createGroupValidation, validate, createGroup);
router.get("/getGroups", getAllGroups);
router.get("/:id", getGroupById); 

// PUT to update group
router.put("/:id", editGroupById);
router.delete("/:id", deleteGroupById);





module.exports= router;