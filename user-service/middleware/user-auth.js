import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No or invalid token provided' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    console.error('Error in userAuth middleware:', error);
    res.status(401).json({ success: false, message: 'Unauthorized or invalid token' });
  }
};

export default userAuth;
