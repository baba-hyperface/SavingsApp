
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'transfer', 'closing_pot'],  
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  from: { 
    type: String, 
    required: true 
  },
  to: { 
    type: String, 
    required: true 
  },
  potId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SavingPot', 
    required: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  time: { 
    type: String, 
    default: function() { 
      return new Date().toLocaleTimeString(); 
    } 
  }
});


const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;