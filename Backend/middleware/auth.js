import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';
import User from '../models/usermodel.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.cookies.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log("Token is not defined", token);
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: insufficient rights' });
  }
  next();
};
