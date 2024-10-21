import Router from 'express';
import Transaction from '../models/historymodel';

const historyrouter=Router();
historyrouter.get('/history', protect, async (req, res) => {
    try {
        const historydata = await Transaction.find({ email: req.user.email });
        if (!historydata.length) {
            return res.status(404).json({ message: 'No transaction history found for this user' });
        }
        
        res.json({ historydata });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
