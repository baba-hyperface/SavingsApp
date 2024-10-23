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
  potStatus:{
    type:Boolean,
    required:true,
    default: true,
  },
  autoDeduction: {
    type: Boolean,
    required: true,
    default: false,
  },
  autoDeductionStatus: {
    type: Boolean,
    required: true,
    default: false,
  },
  dailyAmount: {
    type: Number,
    default: 0,
    required: true
  },
  lastAutoDeductionDate: {
    type: Date,
    default: null 
  },
  lastInterestAddedDate: { type: Date, default: null },
  category: {
    type: String,
    enum: [
      "travel", "health", "home", "business", "education", "gadgets",
      "vehicle", "gifts", "emergency", "retirement", "hobbies", 
      "clothing", "charity", "misc"
    ],
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  interestAmount: {
    type: Number,
    default: 0, 
    required: true
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
