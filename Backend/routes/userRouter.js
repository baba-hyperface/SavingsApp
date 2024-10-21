import express from 'express'
import SavingPot from '../models/potsmodel.js';
import User from '../models/usermodel.js';
import Transaction from '../models/historymodel.js';
import { protect } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.get('/user',protect, async (req, res) => {
    try {
        const users = await User.find().populate('pots').populate('history');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.get('/user/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('pots').populate('history');
        if (!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.post('/user',protect, async (req, res) => {
    const {name, email, password, accountNumber, totalBalance, pots, history} = req.body;
    const newUser = new User({
        name,
        email,
        password,
        accountNumber,
        totalBalance,
        pots,
        history,
    });

    try{    
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    }catch(err){
        res.status(400).json({ message: err.message });
    }
});

userRouter.patch('/user/:id', protect,async (req, res) => {
    const { totalBalance, potId, potBalance, targetAmount } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if(!user) res.status(404).json({message: "user not found"});
        if(totalBalance){
            user.totalBalance = totalBalance;
        }
        if (potId && (potBalance || targetAmount)) {
            const pot = await SavingPot.findById(potId);

            if(!pot) return res.status(404).json({message: "Saving plan not found"});
            // if (potBalance !== undefined) pot.balance = potBalance;
            // if (targetAmount !== undefined) pot.target = targetAmount;
            // await pot.save();
            // await user.save(); 

            const transaction = new Transaction({
                email:req.user.email,
                type: "transfer", 
                amount:totalBalance,
                from: "Bank and deposite Or adding", 
                to: "walete",
                potId: potId,
                date: new Date()
            });
            console.log("traansaction",transaction);
            
            user.history.push(transaction);
                
            await user.save(); 

            res.json({ message: 'User or Saving plan updated successfully', user });
        }
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
})

userRouter.delete('/users/:id',protect, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      await user.remove();
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  userRouter.patch('/user/:id/balance',protect, async (req, res) => {
    const userId = req.params.id;
    const {balance} = req.body;
    try {
        const updateBalance = await User.findByIdAndUpdate(userId, {totalBalance : balance}, {new: true});

        if(updateBalance){
            
        const transaction = new Transaction({
            email:req.user.email,
            type: "transfer", 
            amount:balance,
            from: "walete", 
            to: "saving_pot",
            date: new Date()
        });
        console.log("traansaction",transaction);
        
        updateBalance.history.push(transaction);
            
        await updateBalance.save();

            res.status(200).json({ message: 'Balance updated successfully', user: updateBalance });
            
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ message: 'Server error' });
    }
  })

  export default userRouter;