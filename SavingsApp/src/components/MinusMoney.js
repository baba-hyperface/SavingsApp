import axios from 'axios';
export const updateBalance = async (userId, currentBalance, amountToAddOrSubtract, isAddition) => {
  const moneyChange = parseInt(amountToAddOrSubtract, 10);
  if (!isNaN(moneyChange) && moneyChange > 0) {
    const newBalance = isAddition ? currentBalance + moneyChange : currentBalance - moneyChange;
    try {
      const res = await axios.patch(`http://localhost:5000/api/user/${userId}/balance`, {
        balance: newBalance
      });
      // console.log(res.data.user.totalBalance);
      return res.data.user.totalBalance;
    } catch (error) {
      console.error('Error updating balance:', error);
      throw error; 
    }
  } else {
    throw new Error('Invalid amount provided');
  }
};
