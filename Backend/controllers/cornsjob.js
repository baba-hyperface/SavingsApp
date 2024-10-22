import cron from 'node-cron';
import User from '../models/usermodel.js';

import nodemailer from 'nodemailer';

// // '0 0 * * *'
// cron.schedule('1,15,30,45,59 * * * * *', async () => {
//     console.log('Cron job running every minite 1,15,30,45 and 59 seconds');
// });

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
    text: `Dear ${user.name},\n\nYou do not have enough funds in your account for auto-deduction for the "${pot.potPurpose}" saving pot. Please add sufficient funds to continue your daily savings plan.\n\nThank you,\nYour Savings App`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email} regarding insufficient funds for pot: ${pot.potPurpose}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

cron.schedule('1,15,30,45,59 * * * * *', async () => {
    try {
    const users = await User.find({}).populate({
        path: 'pots',
        match: { autoDeduction: true }  
      });
      
    console.log("User",users);
      let totalUsersProcessed = 0;
      let totalPotsProcessed = 0;
      let totalPotsUpdated = 0;
  
      for (const user of users) {
        console.log(`Processing user: ${user.name}, Total Balance: ${user.totalBalance}`);  
        
        totalUsersProcessed++;
  
        let potsUpdated = false;
  
        for (const pot of user.pots) {
        //   console.log(`Processing pot: ${pot.potPurpose}, AutoDeduction: ${pot.autoDeduction}, DailyAmount: ${pot.dailyAmount}, CurrentBalance: ${pot.currentBalance}`);  // Log each pot
  
          totalPotsProcessed++;
  
          if (pot.autoDeduction) {
            if (user.totalBalance >= pot.dailyAmount) {
              user.totalBalance -= pot.dailyAmount;
              pot.currentBalance += pot.dailyAmount;
              potsUpdated = true;
              totalPotsUpdated++;
              console.log(`Deducted ${pot.dailyAmount} from user: ${user.name} for pot: ${pot.potPurpose} current balence is ${pot.currentBalance}`);
              await pot.save();
            } else {
              await sendInsufficientFundsEmail(user, pot);
              console.log(`User ${user.name} has insufficient balance for auto-deduction for pot: ${pot.potPurpose}`);
            }
          }
        }
  
        if (potsUpdated) {
          await user.save();
          console.log(`User ${user.name} has been updated with new balances.`);
        }
      }
  
      console.log(`Auto-deduction process completed for ${totalUsersProcessed} users.`);
      console.log(`${totalPotsProcessed} pots processed in total.`);
      console.log(`${totalPotsUpdated} pots were successfully updated with daily deduction.`);
      
    } catch (error) {
      console.error('Error in auto-deduction process:', error);
    }
  });