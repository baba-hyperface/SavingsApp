import Router from 'express';
import { register, login } from '../controllers/login.js';

export const loginrouter=Router();

loginrouter.post('/register',register);
loginrouter.post('/login', login );