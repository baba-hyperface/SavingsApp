import jwt from 'jsonwebtoken';
import {} from 'dotenv/config';
import User from '../models/usermodel.js';

export const protect = async(req, res, next) => {

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
    if (!token) {
        console.log("is not defined token",token);
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoded",decoded);
      const user=await User.findById(decoded.id);

      // console.log("user",user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Attach full user details to req.user (including email)
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};