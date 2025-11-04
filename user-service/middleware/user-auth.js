import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "No or invalid token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Dùng ACCESS_TOKEN_SECRET thay vì JWT_SECRET
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in userAuth middleware:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Access token expired" });
    }

    res
      .status(401)
      .json({ success: false, message: "Unauthorized or invalid token" });
  }
};

export default userAuth;
