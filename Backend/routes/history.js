import Router from 'express';
import { protect } from '../middleware/auth.js';
import Transaction from '../models/historymodel.js';

const historyrouter=Router();
historyrouter.get('/history', protect, async (req, res) => {
    try {
        const historydata = await Transaction.find({ email: req.user.email });
        console.log("history data",historydata);

        if (!historydata.length) {
            return res.json({ message: 'No transaction history found for this user' });
        }
        
        res.status(200).json({ historydata });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default historyrouter;
