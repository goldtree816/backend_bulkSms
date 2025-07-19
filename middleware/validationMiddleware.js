// middleware/validationMiddleware.js
const { body, validationResult } = require("express-validator");

exports.createUserValidation = [
  body("f_name").notEmpty().withMessage("First name is required"),
  body("l_name").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.loginUserValidation = [
  body("email")
    .isEmail()
    .notEmpty()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .notEmpty()
    .withMessage("Password must be at least 6 characters"),
];



exports.UserContactValidation = [
  body("user_id").isInt().withMessage("User ID must be an integer"),

  body("f_name").notEmpty().withMessage("First name is required"),

  body("l_name").notEmpty().withMessage("Last name is required"),
  body("address").notEmpty().withMessage("Address is required"),

  body("phoneNumber")
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
];

//group validation

exports.createGroupValidation =[
  body("groupName").notEmpty().withMessage("Group name is required"),
  body("fileName").notEmpty().withMessage("file name is required"),
  body("contactList").notEmpty().withMessage("Contact list cannot be empty"),
  body("groupType").notEmpty().withMessage("group type must be selected")
];