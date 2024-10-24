import cron from 'node-cron';
import User from '../models/usermodel.js';

import nodemailer from 'nodemailer';
import Transaction from '../models/historymodel.js';

// // '0 0 * * *'
cron.schedule('1,15,30,45,59 * * * * *', async () => {
    console.log('Cron job running every minite 1,15,30,45 and 59 seconds');
});

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});


const sendInsufficientFundsEmail = async (user, pot) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Insufficient Funds for Auto-Deduction',
    text: `Dear ${user.name},\n\nWe understand that you may not always have sufficient funds available. Currently, you do not have enough balance in your account for the auto-deduction towards the "${pot.potPurpose}" saving pot. Please add sufficient funds to continue your daily savings plan.\n\nIf you’re facing financial difficulties, you can pause the auto-deduction for this saving pot directly from your dashboard until you're ready to resume.\n\nThank you for trusting us with your savings.\n\nBest regards,\nYour Savings App Team`

  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email} regarding insufficient funds for pot: ${pot.potPurpose}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};
  
cron.schedule('0 1 * * *', async () => {
  try {
    const users = await User.find({}).populate({
      path: 'pots' 
    });

    console.log("Processing users:", users);
    let totalUsersProcessed = 0;
    let totalPotsProcessed = 0;
    let totalPotsUpdated = 0;

    const interestRate = 0.005; // 0.5% interest rate

    for (const user of users) {
      console.log(`Processing user: ${user.name}, Total Balance: ${user.totalBalance}`);
      
      totalUsersProcessed++;

      let potsUpdated = false;

      for (const pot of user.pots) {
        totalPotsProcessed++;

        // Calculate interest for every pot regardless of autoDeduction
        if (pot.currentBalance > 0) {
          const interest = pot.currentBalance * interestRate;
          pot.interestAmount += interest; // Add interest to interestAmount only
          console.log(`Interest of ${interest} calculated for pot: ${pot.potPurpose}, Total Interest: ${pot.interestAmount}`);
        }

        // Auto-Deduction Logic (only if autoDeduction is true)
        const now = new Date();
        const lastDeduction = pot.lastAutoDeductionDate;

        if (pot.autoDeduction & pot.autoDeductionStatus) {
          if (!lastDeduction || (now.getDate() !== lastDeduction.getDate())) {
            if (user.totalBalance >= pot.dailyAmount) {
              user.totalBalance -= pot.dailyAmount;
              pot.currentBalance += pot.dailyAmount;
              pot.lastAutoDeductionDate = now; 
              potsUpdated = true;

              totalPotsUpdated++;
              console.log(`Deducted ${pot.dailyAmount} from user: ${user.name} for pot: ${pot.potPurpose}, Current Balance: ${pot.currentBalance}`);
              const transaction = new Transaction({
                email: user.email,
                type: 'Auto-Deduction',
                amount: pot.dailyAmount,
                from: 'Total Balance',
                to: pot.potPurpose,
                potId: pot._id,
              });

              await transaction.save();
              user.history.push(transaction._id);
              await pot.save();
            } else {
              await sendInsufficientFundsEmail(user, pot);
              console.log(`User ${user.name} has insufficient balance for auto-deduction for pot: ${pot.potPurpose}`);
            }
          } else {
            console.log(`No deduction needed for pot: ${pot.potPurpose}, as deduction was already made today.`);
          }
        }
        await pot.save();
      }

      if (potsUpdated) {
        await user.save();
        console.log(`User ${user.name} has been updated with new balances.`);
      }
    }

    console.log(`Auto-deduction and interest calculation process completed for ${totalUsersProcessed} users.`);
    console.log(`${totalPotsProcessed} pots processed in total.`);
    console.log(`${totalPotsUpdated} pots were successfully updated with daily deduction.`);
    
  } catch (error) {
    console.error('Error in auto-deduction and interest calculation process:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"
});


cron.schedule('0 1 1 * *', async () => {  // Runs at 1:00 AM on the 1st of every month
  try {
    const users = await User.find({}).populate({
      path: 'pots',
    });

    console.log("Processing users:", users);
    let totalUsersProcessed = 0;
    let totalPotsProcessed = 0;
    let totalPotsUpdated = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();  // Get the current month
    const currentYear = currentDate.getFullYear();  // Get the current year

    for (const user of users) {
      console.log(`Processing user: ${user.name}, Total Balance: ${user.totalBalance}`);
      totalUsersProcessed++;

      let potsUpdated = false;

      for (const pot of user.pots) {
        totalPotsProcessed++;

        // Get the month and year from the lastInterestAddedDate
        const lastInterestAddedDate = pot.lastInterestAddedDate;
        let lastInterestMonth = null;
        let lastInterestYear = null;

        if (lastInterestAddedDate) {
          lastInterestMonth = lastInterestAddedDate.getMonth();
          lastInterestYear = lastInterestAddedDate.getFullYear();
        }

        // Check if the interest for this month has already been added
        if (lastInterestYear === currentYear && lastInterestMonth === currentMonth) {
          console.log(`Interest for pot: ${pot.potPurpose} has already been added for this month.`);
          continue;  // Skip this pot if interest has already been added this month
        }

        // Calculate and add interest if the currentBalance is eligible
        const interest = Math.floor(pot.interestAmount);
        if (interest > 0) {
          pot.currentBalance += interest;  // Add floored interest to currentBalance
          pot.interestAmount = 0;  
          pot.lastInterestAddedDate = currentDate;  
          await pot.save();  
          potsUpdated = true;
          totalPotsUpdated++;
          console.log(`Added interest of ${interest} to pot: ${pot.potPurpose}, New Balance: ${pot.currentBalance}`);

          const transaction = new Transaction({
            email: user.email,
            type: 'Interest Added',
            amount: interest,
            from: 'Interest Amount',
            to: pot.potPurpose,
            potId: pot._id,
          });

          await transaction.save();
          user.history.push(transaction._id);
          
        }
      }

      if (potsUpdated) {
        await user.save();  // Save the user if any pots were updated
        console.log(`User ${user.name} has been updated with new balances.`);
      }
    }

    console.log(`Interest transfer process completed for ${totalUsersProcessed} users.`);
    console.log(`${totalPotsProcessed} pots processed in total.`);
    console.log(`${totalPotsUpdated} pots were successfully updated with interest.`);
    
  } catch (error) {
    console.error('Error in interest transfer process:', error);
  }
}, {
  scheduled: true,
  timezone: "Asia/Kolkata"  // Correct timezone for India
});
