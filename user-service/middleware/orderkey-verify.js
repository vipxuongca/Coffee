const verifyOrderKey = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const token = authHeader.split(" ")[1];
  if (token !== process.env.ORDER_SECRET_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

export { verifyOrderKey };
