import Router from 'express';
import { register, login, logout } from '../controllers/login.js';
import { protect } from '../middleware/auth.js';

export const loginrouter=Router();

loginrouter.post('/register',register);
loginrouter.post('/login', login );
loginrouter.post('/logout',protect,logout);