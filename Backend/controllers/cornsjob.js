import cron from 'node-cron';
import User from '../models/usermodel.js';

// '0 0 * * *'
cron.schedule('1,15,30,45,59 * * * * *', async () => {
    console.log('Cron job running every minite 1,15,30,45 and 59 seconds');
    try {
        const len=await User.countDocuments();
        if(len<=0){
            return console.log("user are not present");
        }
        const users = await User.find({
            Detuctionamount: { $gt: 0 },          
            totalBalance: { $gte: Detuctionamount } 
        });
        
        for (let user of users) {
            user.helthcareamount += user.Detuctionamount; 
            user.totalBalance -= user.Detuctionamount;    
            
            await user.save(); 
        }

        console.log(`${users.length} users had their Detuctionamount processed and balances updated.`);
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});