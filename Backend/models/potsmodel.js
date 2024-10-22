
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
  category:{
    type:String,
    enum:[
      "travel",
      "health",
      "home",
      "business",
      "education",
      "gadgets",
      "vehicle",
      "gifts",
      "emergency",
      "retirement",
      "hobbies",
      "clothing",
      "charity",
      "misc"],
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
  }
}, { timestamps: true });

const SavingPot = mongoose.model('SavingPot', savingPotSchema);

export default SavingPot;


