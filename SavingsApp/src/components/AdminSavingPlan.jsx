import React, { useEffect, useState } from 'react'
import api from './api';
import { Link } from 'react-router-dom';
import { AdminNavigation } from './AdminNavigation';

export const AdminSavingPlan = () => {
      const [users, setUsers] = useState([]);
      const[loading, setLoading] = useState(true);
      const arr = [];
      
      useEffect(() => {
            const fetchUsers = async () => {
                try {
                    const res = await api.get(`/user`);
                    setUsers(res.data);
                } catch (error) {
                    console.log("Error fetching users:", error);
                } finally {
                  setLoading(false)
                }
            };
            fetchUsers();
        }, []);

        


        for(let i = 0; i < users.length; i++){
            for(let j = 0; j < users[i].pots.length;j++){
                  arr.push(users[i].pots[j])
            }
        }

        
        if(loading){
            return <p>Loading....</p>
        }


  return (
      <div className="admin-container">
             <div className="admin-navigation">
            <AdminNavigation />
            </div>
            <h1>All Saving plan</h1>
      <h3>Total Saving Plan : {arr.length}</h3>
      <table className="user-table">
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Target Amount</th>
            <th>Current Balance</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Auto Deduction</th>
          </tr>
        </thead>
        <tbody>
          {arr
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((pot) => (
              <tr key={pot._id}>
                <td>{pot.potPurpose}</td>
                <td>{pot.targetAmount}</td>
                <td>{pot.currentBalance}</td>
                <td>{pot.potStatus ? "Active" : "Inactive"}</td>
                <td>{new Date(pot.startDate).toLocaleDateString()}</td>
                <td>
                  {pot.endDate
                    ? new Date(pot.endDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{pot.autoDeduction ? "Enabled" : "Disabled"}</td>
               
              </tr>
            ))}
        </tbody>
      </table>
      </div>
  )
}
