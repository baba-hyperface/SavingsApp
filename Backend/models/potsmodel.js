
import mongoose from 'mongoose'; 

const savingPotSchema = new mongoose.Schema({
  potPurpose: { 
    type: String, 
    required: true 
  },
  targetAmount: { 
    type: Number, 
    required: false 
  },
  currentBalance: { 
    type: Number, 
    default: 0 
  },
  imoji: { 
    type: String, 
    required: false 
  },
  color: { 
    type: String, 
    required: false 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

const SavingPot = mongoose.model('SavingPot', savingPotSchema);

export default SavingPot;


