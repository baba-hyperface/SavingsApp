import React, { useEffect, useState } from 'react';
import api from './api';
import { useParams } from 'react-router-dom';
import '../styles/AdminPot.css';

export const AdminPot = () => {
  const [potData, setPotData] = useState([]);
  const [editPot, setEditPot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  
  const openEditModal = (pot) => {
    setEditPot(pot);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/user/${id}/savingplan`);
        console.log(res.data);
        setPotData(res.data);
      } catch (error) {
        console.log("Error fetching saving pots:", error);
      }
    };
    fetchPlan();
  }, [id]);

  const handleDelete = async (potId) => {
    try {
      await api.delete(`/api/savingpot/${potId}`);
      setPotData(potData.filter((pot) => pot._id !== potId));
    } catch (error) {
      console.error("Error deleting pot", error);
    }
  };



  const handleUpdate = async () => {
    try {
      await api.put(`/user/${id}/savingplanupdateplandeduction/${editPot._id}`, editPot);
      setPotData(potData.map((pot) => (pot._id === editPot._id ? editPot : pot)));
      setIsModalOpen(false);
      alert('Saving pot updated successfully');
    } catch (error) {
      console.error("Error updating saving pot", error);
    }
  };


  return (
    <div className="admin-container">
      <h1>Manage User Saving Plan</h1>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {potData
            .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
            .map((pot) => (
              <tr key={pot._id}>
                <td>{pot.potPurpose}</td>
                <td>{pot.targetAmount}</td>
                <td>{pot.currentBalance}</td>
                <td>{pot.potStatus ? 'Active' : 'Inactive'}</td>
                <td>{new Date(pot.startDate).toLocaleDateString()}</td>
                <td>{pot.endDate ? new Date(pot.endDate).toLocaleDateString() : 'N/A'}</td>
                <td>{pot.autoDeduction ? 'Enabled' : 'Disabled'}</td>
                <td>
                  <div className="actions">
                    <i className="fa fa-pen-to-square" onClick={() => openEditModal(pot)}></i>
                    <i className="fa fa-trash" onClick={() => handleDelete(pot._id)}></i>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal for editing the saving pot */}
      {isModalOpen && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3>Edit Saving Plan</h3>
            <label>
              Pot Purpose:
              <input
                type="text"
                value={editPot.potPurpose}
                onChange={(e) => setEditPot({ ...editPot, potPurpose: e.target.value })}
              />
            </label>
            <label>
              Target Amount:
              <input
                type="number"
                value={editPot.targetAmount}
                onChange={(e) => setEditPot({ ...editPot, targetAmount: e.target.value })}
              />
            </label>
            <label>
              Current Balance:
              <input
                type="number"
                value={editPot.currentBalance}
                onChange={(e) => setEditPot({ ...editPot, currentBalance: e.target.value })}
              />
            </label>
            <label>
              Status:
              <input
                type="checkbox"
                checked={editPot.potStatus}
                onChange={(e) => setEditPot({ ...editPot, potStatus: e.target.checked })}
              />
            </label>
            <label>
              Auto Deduction:
              <input
                type="checkbox"
                checked={editPot.autoDeduction}
                onChange={(e) => setEditPot({ ...editPot, autoDeduction: e.target.checked })}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={editPot.endDate}
                onChange={(e) => setEditPot({ ...editPot, endDate: e.target.value })}
              />
            </label>
            <button onClick={handleUpdate}>Save Changes</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPot;
