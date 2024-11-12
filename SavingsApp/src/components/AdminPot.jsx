import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import '../styles/AdminPot.css';

export const AdminPot = () => {
  const [potData, setPotData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedPot, setSelectedPot] = useState(null);
  const [formData, setFormData] = useState({
    autoDeduction: false,
    endDate: '',
    dailyAmount: 0,
    frequency: '',
    dayOfWeek: '',
    dayOfMonth: '',
  });

  const { id } = useParams();

  // Open Edit Modal with selected pot data
  const openEditModal = (pot) => {
    setSelectedPot(pot);
    setFormData({
      autoDeduction: pot.autoDeduction || false,
      endDate: pot.endDate || '',
      dailyAmount: pot.dailyAmount || 0,
      frequency: pot.frequency || '',
      dayOfWeek: pot.dayOfWeek || '',
      dayOfMonth: pot.dayOfMonth || '',
    });
    setModalOpen(true); // Open modal when editing a pot
  };

  // Fetch the user saving plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get(`/user/${id}/savingplan`);
        setPotData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlan();
  }, [id]);

  // Handle delete operation for a pot
  const handleDelete = async (potId) => {
    try {
      await api.delete(`/api/savingpot/${potId}`);
      setPotData(potData.filter((pot) => pot._id !== potId));
    } catch (error) {
      console.error('Error deleting pot', error);
    }
  };

  // Handle form submit for updating the pot data
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending PUT request to update the saving pot
      const res = await api.put(`/user/${id}/savingplanupdateplandeduction/${selectedPot._id}`, formData);

      // Update the potData state with the updated data
      setPotData(potData.map((pot) => (pot._id === selectedPot._id ? res.data : pot)));

      // Close the modal after successful update
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating saving pot', error);
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
      {modalOpen && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <h2>Edit Saving Plan</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-field">
                <label>Auto Deduction</label>
                <input
                  type="checkbox"
                  checked={formData.autoDeduction}
                  onChange={(e) => setFormData({ ...formData, autoDeduction: e.target.checked })}
                />
              </div>
              <div className="form-field">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Daily Amount</label>
                <input
                  type="number"
                  value={formData.dailyAmount}
                  onChange={(e) => setFormData({ ...formData, dailyAmount: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Frequency</label>
                <input
                  type="text"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Day of Week</label>
                <input
                  type="text"
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Day of Month</label>
                <input
                  type="text"
                  value={formData.dayOfMonth}
                  onChange={(e) => setFormData({ ...formData, dayOfMonth: e.target.value })}
                />
              </div>
              <button type="submit">Update Plan</button>
              <button type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPot;
