import express from 'express'
import SavingPot from '../models/potsmodel.js';
import User from '../models/usermodel.js';
import Transaction from '../models/historymodel.js';
import { authorize, protect } from '../middleware/auth.js';

const userRouter = express.Router();
userRouter.get('/searchusers/:searchTerm', protect, authorize(["admin"]), async (req, res) => {
    try {
        const { searchTerm } = req.params;
        const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit of 10

        const skip = (page - 1) * limit;

        // Perform the search with pagination
        const users = await User.find({
            email: { $regex: searchTerm, $options: 'i' } // Case-insensitive match
        })
            .skip(skip)
            .limit(Number(limit)); // Convert limit to a number

        // Count total matching users (for pagination)
        const totalUsers = await User.countDocuments({
            email: { $regex: searchTerm, $options: 'i' }
        });

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found with the provided email." });
        }

        res.status(200).json({
            users,
            totalUsers, // Total number of matching users
            totalPages: Math.ceil(totalUsers / limit), // Total number of pages
            currentPage: Number(page) // Current page
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error occurred." });
    }
});


userRouter.get('/user',protect,authorize(["admin"]), async (req, res) => {
    try {
        const users = await User.find().populate('pots').populate('history');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.get('/users', protect, authorize(["admin"]), async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Defaults to page 1 and 10 users per page

    try {
        const totalUsers = await User.countDocuments(); // Total number of users
        const users = await User.find()
            .populate('pots')
            .populate('history')
            .skip((page - 1) * limit) // Skip documents from previous pages
            .limit(Number(limit)); // Limit the number of documents per page

        console.log(`Page: ${page}, Users sent: ${users.length}, Total Users: ${totalUsers}`);

        res.json({
            users,          // Paginated users
            totalUsers,     // Total number of users (for frontend to calculate pages)
            totalPages: Math.ceil(totalUsers / limit), // Total pages for frontend navigation
            currentPage: Number(page), // Current page number
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.get('/user/:id', protect,authorize(["user","admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('pots').populate('history');
        if (!user) return res.status(404).json({message: "User not found"});
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

userRouter.post('/user', async (req, res) => {
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

userRouter.patch('/user/:id', protect ,authorize(["user","admin"]), async (req, res) => {
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

            const transaction = new Transaction({
                email:req.user.email,
                type: "transfer", 
                amount:totalBalance,
                from: "Bank and deposite Or adding", 
                to: "walete",
                potId: potId,
                date: new Date()
            });
            console.log("traansaction patched 5",transaction);
            
            user.history.push(transaction);
                
            await transaction.save();
            await user.save(); 

            res.json({ message: 'User or Saving plan updated successfully', user });
        }
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
})

userRouter.delete('/users/:id',protect,authorize(["admin"]), async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
    //   await user.save();
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err)
      res.status(500).json({ message: err.message });
    }
  });

  userRouter.patch('/user/:id/balance',protect,authorize(["user","admin"]), async (req, res) => {
    const userId = req.params.id || req.user.id;
    const {balance} = req.body;
    
    try {

        const updateBalance = await User.findByIdAndUpdate(userId, {totalBalance : balance}, {new: true});
        if(updateBalance){
        const user=await User.findOne({email:req.user.email});
        const transaction = new Transaction({
            email:req.user.email,
            type: "transfer", 
            amount:balance,
            from: "walete", 
            to: "saving_pot",
            date: new Date()
        });
        console.log("traansaction pache wallete 5",transaction);
        
        user.history.push(transaction); 
      await transaction.save();      
      await user.save();   

            res.status(200).json({ message: 'Balance updated successfully', user: updateBalance });
            
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ message: 'Server error' });
    }
  })
  
  
  userRouter.put('/user/:id', protect,authorize(["admin"]), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

userRouter.get("/userspots/all-potsfetch",protect,authorize(["admin"]), async (req, res) => {
    
    try {
      const usersWithPots = await User.find({ pots: { $exists: true, $ne: [] } }).populate("pots");
  
      const allPots = usersWithPots.reduce((acc, user) => {
        acc.push(...user.pots);
        return acc;
      }, []);
  
      res.status(200).json(allPots);
    } catch (error) {
      console.error("Error fetching pots:", error);
      res.status(500).json({ message: "Server error occurred.", error: error.message });
    }
  });
  

  export default userRouter;