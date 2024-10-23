import express from 'express'
import User from '../models/usermodel.js';
import SavingPot from '../models/potsmodel.js';
import mongoose from 'mongoose';
import Transaction from '../models/historymodel.js';
import { protect } from '../middleware/auth.js';

const savingPlanRouter = express.Router();

savingPlanRouter.post(`/user/:userId/savingplan`, protect,async (req, res) => {
    const { potPurpose, targetAmount, currentBalance, imoji, color,category,autoDeduction,dailyAmount } = req.body;
    if(!currentBalance){
        currentBalance=0;
    }
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User Not found" });
        }

        const newSaving = new SavingPot({
            potPurpose,
            targetAmount,
            currentBalance,
            category:category,
            imoji,
            color,
            autoDeduction,
            dailyAmount,
            user: req.params.userId
        });

        const savedPot = await newSaving.save();
        user.pots.push(savedPot._id);
    //     const transaction = new Transaction({
    //         email:req.user.email,
    //         type: "transfer", 
    //         amount:currentBalance,
    //         from: "walete", 
    //         to: "saving_pot",
    //         date: new Date()
    //     });
    //     console.log("traansaction",transaction);
        
    //     user.history.push(transaction); 
    //   await transaction.save();       
        await user.save();

        res.status(201).json({ message: 'Saving plan created', pot: savedPot });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

savingPlanRouter.patch('/user/:userId/savingplan/:potId',protect, async (req, res) => {
    const { potId, userId } = req.params;
    const { currentBalance } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const pot = await SavingPot.findById(potId);
        console.log("pot update",pot);
        if (!pot) return res.status(404).json({ message: 'Saving plan not found' });

        if (currentBalance !== undefined) {
            pot.currentBalance += currentBalance;
        } else {
            return res.status(400).json({ message: 'currentBalance is required' });
        }
        console.log("creting transaction");
        const transaction = new Transaction({
            email:req.user.email,
            type: "deposit", 
            amount:currentBalance,
            from: "walete", 
            to: "saving_pot",
            potId: potId,
            date: new Date()
        });
        console.log("traansaction patch",transaction);
        
        user.history.push(transaction);
            
        await transaction.save();
        await user.save(); 
        console.log("user after saved",user);

        await pot.save();


        res.json({ message: 'Saving plan balance updated', pot,transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

savingPlanRouter.patch('/user/:userId/savingplanstatus/:potId',protect, async (req, res) => {
    const { potId, userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const pot = await SavingPot.findById(potId);
        console.log("pot update",pot);
        if (!pot) return res.status(404).json({ message: 'Saving plan not found' });

            pot.autoDeductionStatus =!pot.autoDeductionStatus;
            console.log("autodetucionstatus updated",pot.autoDeductionStatus);
        
        await pot.save();
        await user.save(); 

        res.status(200).json({ message: 'Saving plan autodetuctionstatus balance updated',status: pot.autoDeductionStatus});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// savingPlanRouter.get('/user/:userId/savingplan',protect, async (req, res) => {
//     const { userId, potId } = req.params;

//     try {
//         if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(potId)) {
//             return res.status(400).json({ message: 'Invalid user ID or pot ID' });
//         }
//         const user = await User.findById(userId).populate('pots');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         const pot = user.pots.find(pot => pot._id.toString() === potId);
//         if (!pot) {
//             return res.status(404).json({ message: 'Saving plan not found' });
//         }
//         res.json(pot);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
savingPlanRouter.get('/user/:userId/savingplan', async (req, res) => {
    const { userId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findById(userId).populate('pots');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.pots);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




savingPlanRouter.patch('/user/:userId/savingplandeactivate/:potId', protect,async (req, res) => {
    const {potId, userId} = req.params;
    try {
        const user = await User.findById(userId);
        if(!user) res.status(404).send("user not found");
        const pot = await SavingPot.findById(potId);
        if (!pot) return res.status(404).json({ message: 'Saving plan not found' });
        // await SavingPot.deleteOne({ _id: potId });
        pot.potStatus=false;
        console.log("pot currentcode",pot.currentBalance);

        // user.pots = user.pots.filter(potId => potId.toString() !== pot._id.toString());
        
        const transaction = new Transaction({
            email:req.user.email,
            type: "credit", 
            amount:pot.currentBalance,
            from: "saving_pot", 
            to: "Bank",
            potId: potId,
            date: new Date()
        });
        console.log("traansaction",transaction);
        user.totalBalance+=pot.currentBalance;
        pot.currentBalance=0;
        await pot.save();

        user.history.push(transaction);
            
        await user.save(); 
        console.log(user);  

        res.json({ message: 'Saving plan deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } 
});

export default savingPlanRouter;