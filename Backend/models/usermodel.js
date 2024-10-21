
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email:{
    type : String,
    unique: true,
    required: true
  },
  accountNumber: {
    type: Number, 
    required: true,
    unique: true
  },
  // helthcareamount:{
  //   type:Number,
  //   default:0,
  // },
  // Detuctionamount:{
  //   type: Number,
  //   default:0,
  //   required:true
  // },
  expDate: {
    type: Date, 
    required: false
  },
  totalBalance: {
    type: Number,
    default: 0, 
    required: true
  },
  pots: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SavingPot' 
  }],
  history: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Transaction'
  }]
});

const User = mongoose.model('User', userSchema);

export default User;