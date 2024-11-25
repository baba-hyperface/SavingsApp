import Router from 'express';
import { register, login, logout, checklogin, generateUsers, deleteLastMillionUsers } from '../controllers/login.js';
import { protect } from '../middleware/auth.js';

export const loginrouter=Router();

loginrouter.post('/register',register);
loginrouter.post('/login', login );
loginrouter.post('/logout',protect,logout);
loginrouter.get('/api/auth/check',checklogin);
loginrouter.post('/generate-users',protect,generateUsers);
loginrouter.get('/delete',deleteLastMillionUsers);