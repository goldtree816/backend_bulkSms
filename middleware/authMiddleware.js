const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== "Bearer mysecrettoken") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next(); // Proceed if authorized
};

module.exports = authMiddleware;
