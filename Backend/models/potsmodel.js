import mongoose from "mongoose";

const savingPotSchema = new mongoose.Schema(
  {
    potPurpose: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: false,
    },
    potStatus: {
      type: Boolean,
      required: true,
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
      required: true,
    },
    lastAutoDeductionDate: {
      type: Date,
      default: null,
    },
    lastInterestAddedDate: { type: Date, default: null },
    category: {
      type: String,
      enum: [
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
        "misc",
      ],
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true, // Making it required, but you can set default: Date.now() if necessary
      default: Date.now, // Automatically sets the start date to the current date when a new pot is created
    },
    endDate: {
      type: Date,
      required: false, // Optional; you can specify it based on user preference
    },
    interestAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    imoji: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    frequency: {
      type: String,
      enum:["daily","weekly","monthly"],
      required: false,
    },
    dayOfWeek: {
      type:String,
      required:false,

    },
    dayOfMonth: { 
      type:String,
      required:false,
    },
  },
  { timestamps: true }
);

const SavingPot = mongoose.model("SavingPot", savingPotSchema);

export default SavingPot;
