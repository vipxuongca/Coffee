const verifyResetToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const token = authHeader.split(" ")[1];

  next();
};

export default verifyResetToken;
