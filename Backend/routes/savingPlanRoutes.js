import express from 'express'
import User from '../models/usermodel.js';
import SavingPot from '../models/potsmodel.js';
import mongoose from 'mongoose';
import Transaction from '../models/historymodel.js';
import { protect } from '../middleware/auth.js';

const savingPlanRouter = express.Router();

savingPlanRouter.post(`/user/:userId/savingplan`, protect, async (req, res) => {
    let { potPurpose, targetAmount, currentBalance, imoji, color, category, autoDeduction, dailyAmount, days } = req.body;

    // Default currentBalance to 0 if not provided
    if (!currentBalance) {
        currentBalance = 0;
    }

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const startDate = new Date();
        let endDate;
        if (days) {
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + Number(days)); 
        }
        const newSaving = new SavingPot({
            potPurpose,
            targetAmount,
            currentBalance,
            category,
            imoji,
            color,
            autoDeduction,
            dailyAmount,
            startDate,  // Start date is automatically set to the current date
            endDate,    // Calculated end date
            user: req.params.userId
        });

        const savedPot = await newSaving.save();
        user.pots.push(savedPot._id);

        // Create a transaction for the initial amount added to the saving pot
        const transaction = new Transaction({
            email: req.user.email,
            type: "transfer",
            amount: currentBalance,
            from: "wallet",
            to: "saving_pot",
            date: new Date()
        });
        await transaction.save();
        user.history.push(transaction);
        console.log("traansaction post",transaction);
        await user.save();

        res.status(201).json({ message: 'Saving plan created', pot: savedPot });
        console.log("posted", newSaving)
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
        console.log(currentBalance)

        const transaction = new Transaction({
            email:req.user.email,
            type: "added money to saving plan", 
            amount: currentBalance,
            from: "walete", 
            to: "saving_pot",
            potId: potId,
            date: new Date()
        });
        console.log("traansaction patch",transaction);
        await transaction.save();
        await user.save(); 

        if (currentBalance !== undefined) {
            pot.currentBalance += currentBalance;
        } else {
            return res.status(400).json({ message: 'currentBalance is required' });
        }
        // console.log("creting transaction");
        
        user.history.push(transaction);
            
        await transaction.save();
        await user.save(); 
        // console.log("user after saved",user);

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

savingPlanRouter.patch('/user/:userId/savingsplanActivatingAutodeduct/:selectedPlanId',protect, async (req, res) => {
    const { selectedPlanId, userId } = req.params;
    const {deductionAmount} =req.body;
    console.log("potid",selectedPlanId);
    console.log(deductionAmount);

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const pot = await SavingPot.findById(selectedPlanId);
        console.log("pot update",pot);
        if (!pot) return res.status(404).json({ message: 'Saving plan not found' });

        pot.autoDeductionStatus =true;
        pot.autoDeduction=true;
        pot.dailyAmount = deductionAmount;
        console.log("pot updated daily amount",pot.dailyAmount);

        console.log("autodetucion starts from now",pot.autoDeductionStatus);
    
        await pot.save();
        console.log("afterpot save");
        await user.save(); 
        console.log("user saving",pot);

        res.status(200).json({ message: 'Saving plan autodetuction Activeted & Daily-amount updated',status: pot.autoDeduction});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

savingPlanRouter.get('/user/:userId/savingplan',protect, async (req, res) => {
    // const { userId } = req.params;
    const userId=req.user._id;
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


savingPlanRouter.get('/user/:userId/savingplan/:potId',protect, async (req, res) => {
    const { userId, potId } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        const user = await User.findById(userId).populate('pots');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!mongoose.Types.ObjectId.isValid(potId)) {
            return res.status(400).json({ message: 'Invalid pot ID' });
        }
        const pot = user.pots.find(pot => pot._id.toString() === potId);
        if (!pot) {
            return res.status(404).json({ message: 'Pot not found for this user' });
        }
        res.status(200).json(pot);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




savingPlanRouter.patch('/user/:userId/savingplandeactivate/:potId', protect, async (req, res) => {
    const { potId, userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).send("User not found");

        const pot = await SavingPot.findById(potId);
        if (!pot) return res.status(404).json({ message: 'Saving plan not found' });

        const previousStatus = pot.potStatus;
        pot.potStatus = !pot.potStatus;

        const transactionType = pot.potStatus ? "reopen pot" : "closing pot";

        const transaction = new Transaction({
            email: req.user.email,
            type: transactionType,
            amount: previousStatus ? pot.currentBalance : 0, 
            from: "saving_pot",
            to: "Bank",
            potId: potId,
            date: new Date()
        });

        if (!pot.potStatus) {
            user.totalBalance += pot.currentBalance;
            pot.currentBalance = 0;
        }

        await pot.save();
        user.history.push(transaction);
        await user.save();

        res.json({ message: 'Saving plan status updated successfully', transaction,potStatus:pot.potStatus});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default savingPlanRouter;