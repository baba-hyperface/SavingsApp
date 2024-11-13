import express from "express";
import User from "../models/usermodel.js";
import SavingPot from "../models/potsmodel.js";
import mongoose from "mongoose";
import Transaction from "../models/historymodel.js";
import { authorize, protect } from "../middleware/auth.js";

const savingPlanRouter = express.Router();
savingPlanRouter.get(
  "/users/:userId/savingplan/:potId",
  protect,
  async (req, res) => {
    const { potId } = req.params;
    try {
      const pot = await SavingPot.findById(potId);
      if (!pot) {
        res.send("pot is not There");
      }
      res.send(pot);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  }
);

savingPlanRouter.patch(
  "/users/:userId/savingplanupdateplandeduction/:potId",
  protect,
  authorize(["user","admin"]),
  async (req, res) => {
    const { userId, potId } = req.params;
    const {
      autoDeduction,
      endDate,
      dailyAmount,
      frequency,
      dayOfWeek,
      dayOfMonth,
    } = req.body;
    try {
      const updatedPlan = await SavingPot.findByIdAndUpdate(
        potId,
        {
          autoDeduction,
          endDate,
          dailyAmount,
          frequency,
          dayOfWeek,
          dayOfMonth,
        },
        { new: true }
      );

      if (!updatedPlan) {
        return res.status(404).send("Saving plan not found");
      }

      res.status(200).json(updatedPlan);
    } catch (error) {
      console.error("Error updating saving plan:", error);
      res.status(500).send("Internal server error");
    }
  }
);

savingPlanRouter.post(`/user/:userId/savingplan`, protect,authorize(["user","admin"]), async (req, res) => {
  let {
    potPurpose,
    targetAmount,
    currentBalance,
    imoji,
    color,
    category,
    autoDeduction,
    dailyAmount,
    endDate,
    frequency,
    dayOfWeek,
    dayOfMonth,
  } = req.body;

  console.log("potporpose", potPurpose);
  console.log("targetamount", targetAmount);
  console.log("currentBalence", currentBalance);
  console.log(imoji);
  console.log("color", color);
  console.log("category", category);
  console.log("autoDeduction", autoDeduction);
  console.log("dailyamount", dailyAmount);
  console.log("enddate", endDate);
  console.log("frequency", frequency);
  console.log("dayofweek", dayOfWeek);
  console.log("dayofmonth", dayOfMonth);

  // Default currentBalance to 0 if not provided
  if (!currentBalance) {
    currentBalance = 0;
  }
  let autoDeductionStatus = false;
  if (autoDeduction) {
    autoDeductionStatus = true;
  }
  try {
    const user = await User.findOne({ email: req.user.email });

    console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const startDate = new Date();
    const savingPotData = {
      potPurpose,
      targetAmount,
      currentBalance,
      autoDeductionStatus,
      category,
      imoji,
      color,
      frequency,
      dayOfWeek,
      dayOfMonth,
      autoDeduction,
      dailyAmount,
      startDate,
      user: req.params.userId,
    };

    // Add endDate only if it's provided
    if (endDate) {
      savingPotData.endDate = endDate;
    }

    const newSaving = new SavingPot(savingPotData);
    console.log("new pot ceated one", newSaving);
    const savedPot = await newSaving.save();
    user.pots.push(savedPot._id);

    // Create a transaction for the initial amount added to the saving pot
    const transaction = new Transaction({
      email: req.user.email,
      type: "pot creation",
      amount: currentBalance,
      from: "wallet",
      to: "saving_pot",
      date: new Date(),
    });
    await transaction.save();
    user.history.push(transaction);
    console.log("traansaction post", transaction);
    await user.save();

    res.status(201).json({ message: "Saving plan created", pot: savedPot });
    console.log("posted", newSaving);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: err.message });
  }
});

savingPlanRouter.patch(
  "/user/:userId/savingplan/:potId",
  protect,authorize(["user","admin"]),
  async (req, res) => {
    const { potId, userId } = req.params;
    const { currentBalance } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const pot = await SavingPot.findById(potId);
      console.log("pot update", pot);
      if (!pot)
        return res.status(404).json({ message: "Saving plan not found" });
      console.log(currentBalance);

      const transaction = new Transaction({
        email: req.user.email,
        type: "added money to saving plan",
        amount: currentBalance,
        from: "walete",
        to: "saving_pot",
        potId: potId,
        date: new Date(),
      });
      console.log("traansaction patch", transaction);
      await transaction.save();
      await user.save();

      if (currentBalance !== undefined) {
        pot.currentBalance += currentBalance;

        if (pot.autoDeduction) {
          let requiredAmountPerPeriod = 0;
          const calculateRequiredAmount = () => {
            const parsedGoal = parseInt(pot.targetAmount);
            const parsedAmount = parseInt(pot.currentBalance);
            const daysLeft = calculateDaysLeft(pot.endDate);

            if (parsedGoal && parsedAmount && daysLeft > 0) {
              const remainingAmount = parsedGoal - parsedAmount;

              switch (pot.frequency) {
                case "daily":
                  requiredAmountPerPeriod = Math.ceil(
                    remainingAmount / daysLeft
                  );
                  break;
                case "weekly":
                  const weeksLeft = Math.ceil(daysLeft / 7);
                  requiredAmountPerPeriod = Math.ceil(
                    remainingAmount / weeksLeft
                  );
                  break;
                case "monthly":
                  const monthsLeft = Math.ceil(daysLeft / 30);
                  requiredAmountPerPeriod = Math.ceil(
                    remainingAmount / monthsLeft
                  );
                  break;
                default:
                  requiredAmountPerPeriod = 0;
              }
            }
          };

          calculateRequiredAmount();
          if (requiredAmountPerPeriod > 0) {
            pot.dailyAmount = requiredAmountPerPeriod;
          }
        }
      } else {
        return res.status(400).json({ message: "currentBalance is required" });
      }
      // console.log("creting transaction");

      user.history.push(transaction);

      await transaction.save();
      await user.save();
      // console.log("user after saved",user);

      await pot.save();

      res.json({ message: "Saving plan balance updated", pot, transaction });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

savingPlanRouter.patch(
  "/user/:userId/savingplanstatus/:potId",
  protect,authorize(["user","admin"]),
  async (req, res) => {
    const { potId, userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const pot = await SavingPot.findById(potId);
      console.log("pot update", pot);
      if (!pot)
        return res.status(404).json({ message: "Saving plan not found" });

      pot.autoDeductionStatus = !pot.autoDeductionStatus;
      console.log("autodetucionstatus updated", pot.autoDeductionStatus);

      await pot.save();
      await user.save();

      res.status(200).json({
        message: "Saving plan autodetuctionstatus balance updated",
        status: pot.autoDeductionStatus,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

savingPlanRouter.patch(
  "/user/:userId/savingsplanActivatingAutodeduct/:selectedPlanId",
  protect,authorize(["user","admin"]),
  async (req, res) => {
    const { selectedPlanId, userId } = req.params;
    const { deductionAmount } = req.body;
    // console.log("potid", selectedPlanId);
    // console.log(deductionAmount);

    try {
      const user = await User.findById(userId);

      if (!user) return res.status(404).json({ message: "User not found" });

      const pot = await SavingPot.findById(selectedPlanId);
      console.log("pot update", pot);
      if (!pot)
        return res.status(404).json({ message: "Saving plan not found" });

      pot.autoDeductionStatus = true;
      pot.autoDeduction = true;
      pot.dailyAmount = deductionAmount;
      console.log("pot updated daily amount", pot.dailyAmount);

      console.log("autodetucion starts from now", pot.autoDeductionStatus);

      await pot.save();
      console.log("afterpot save");
      await user.save();
      console.log("user saving", pot);

      res.status(200).json({
        message: "Saving plan autodetuction Activeted & Daily-amount updated",
        status: pot.autoDeduction,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

savingPlanRouter.get("/user/:userId/savingplan", protect,authorize(["user","admin"]), async (req, res) => {

  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(userId).populate("pots");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.pots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

savingPlanRouter.get(
  "/user/:userId/savingplan/:potId",
  protect,authorize(["user","admin"]),
  async (req, res) => {
    const { userId, potId } = req.params;
    
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      const user = await User.findById(userId).populate("pots");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!mongoose.Types.ObjectId.isValid(potId)) {
        return res.status(400).json({ message: "Invalid pot ID" });
      }
      const pot = user.pots.find((pot) => pot._id.toString() === potId);
      if (!pot) {
        return res.status(404).json({ message: "Pot not found for this user" });
      }
      res.status(200).json(pot);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

savingPlanRouter.patch(
  "/user/:userId/savingplandeactivate/:potId",
  protect,authorize(["user","admin"]),
  async (req, res) => {
    const { potId, userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).send("User not found");

      const pot = await SavingPot.findById(potId);
      if (!pot)
        return res.status(404).json({ message: "Saving plan not found" });

      const previousStatus = pot.potStatus;
      pot.potStatus = !pot.potStatus;

      const transactionType = pot.potStatus ? "reopen pot" : "closing pot";

      const transaction = new Transaction({
        email: req.user.email,
        type: transactionType,
        amount: previousStatus ? pot.currentBalance : 0,
        from: "saving_pot",
        to: "Bank",
        potId: potId,
        date: new Date(),
      });

      if (!pot.potStatus) {
        user.totalBalance += pot.currentBalance;
        pot.currentBalance = 0;
      }

      await pot.save();
      user.history.push(transaction);
      await user.save();
      console.log(Transaction);

      res.json({
        message: "Saving plan status updated successfully",
        transaction,
        potStatus: pot.potStatus,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

savingPlanRouter.put('/user/:userId/savingplandeactivate/:potId', async (req, res) => {
  try {
    
    const updatePot = await SavingPot.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!updatePot) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User updated successfully', updatePot });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

savingPlanRouter.delete('/user/:userId/savingplandeactivate/:potId', async (req, res) => {
  try {
    
    const updatePot = await SavingPot.findByIdAndDelete(req.params.potId)
    if (!updatePot) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User updated successfully', updatePot });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default savingPlanRouter;
