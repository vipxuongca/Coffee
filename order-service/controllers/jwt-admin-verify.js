import jwt from 'jsonwebtoken';

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'ORDER-ADMIN-Invalid or expired token' });
  }
};

export { verifyAdminToken };