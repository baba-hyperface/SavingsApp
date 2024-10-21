import Router from 'express';
import { register, login } from '../controllers/login.js';

export const loginrouter=Router();

loginrouter.post('/register',register);
loginrouter.post('/login', login );

export const updateDetuctionAmount = async (req,res) => {
    const {newDetuctionAmount}=req.body;
    const {userId}=req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { Detuctionamount: newDetuctionAmount }, 
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return console.log('User not found');
    }

    res.status(200).json(`Detuctionamount updated successfully for user ${updatedUser.name} Detuctionamount: ${updatedUser.Detuctionamount} your helthcare is activated`);
  } catch (error) {
    console.error('Error updating Detuctionamount:', error);
  }
};
