import Router from 'express';
import { protect } from '../middleware/auth.js';
import Transaction from '../models/historymodel.js';
import User from '../models/usermodel.js';

const historyrouter=Router();
historyrouter.get('/history',protect, async (req, res) => {
    try {
        const historydata = await Transaction.find({ email: req.user.email });

        if (!historydata.length) {
            return res.json({ message: 'No transaction history found for this user' });
        }
        
        res.status(200).json({ historydata });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


historyrouter.post('/history',protect, async (req, res) => {
    try {
      const { email, type, amount, from, to, date} = req.body;
      const newTransaction = new Transaction({
        email,
        type,
        amount,
        from,
        to,
        date
      });
  
      await newTransaction.save();

      const user=await User.findOne({email});
      user.history.push(newTransaction);
      await user.save();

      res.status(201).json({ message: 'Transaction saved successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save transaction.' });
    }
  });

  

  historyrouter.get('/history/:potId', async (req, res) => {
        const {potId} = req.params;
    try {
        const historydata = await Transaction.find({potId});
        console.log("got with potId", historydata);
        if (!historydata.length) {
          return res.json({ message: 'No transaction history found for this user' });
      }
      
      res.status(200).json({ historydata });
    } catch (error) {
      res.status(500).json({ message: err.message });
    }
  })


export default historyrouter;
