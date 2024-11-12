import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from './api';
import '../styles/AdminPot.css';

export const AdminPot = () => {
  const [potData, setPotData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState(null);
  const [formData, setFormData] = useState({
    potPurpose: '',
    targetAmount: 0,
    currentBalance: 0,
    potStatus: true,
    autoDeduction: false,
    endDate: '',
    dailyAmount: 0,
    frequency: '',
    dayOfWeek: '',
    dayOfMonth: '',
    interestAmount: 0,
    imoji: '',
    color: '',
    startDate: '',
  });

  const { id } = useParams();

  // Open Edit Modal with selected pot data
  const openEditModal = (pot) => {
    setSelectedPot(pot);
    setFormData({
      potPurpose: pot.potPurpose || '',
      targetAmount: pot.targetAmount || 0,
      currentBalance: pot.currentBalance || 0,
      potStatus: pot.potStatus || true,
      autoDeduction: pot.autoDeduction || false,
      endDate: pot.endDate || '',
      dailyAmount: pot.dailyAmount || 0,
      frequency: pot.frequency || '',
      dayOfWeek: pot.dayOfWeek || '',
      dayOfMonth: pot.dayOfMonth || '',
      interestAmount: pot.interestAmount || 0,
      imoji: pot.imoji || '',
      color: pot.color || '',
      startDate: pot.startDate || '',
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
      {modalOpen && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <h2>Edit Saving Plan</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-field">
                <label>Pot Purpose</label>
                <input
                  type="text"
                  value={formData.potPurpose}
                  onChange={(e) => setFormData({ ...formData, potPurpose: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Target Amount</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Current Balance</label>
                <input
                  type="number"
                  value={formData.currentBalance}
                  onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Status</label>
                <input
                  type="checkbox"
                  checked={formData.potStatus}
                  onChange={(e) => setFormData({ ...formData, potStatus: e.target.checked })}
                />
              </div>
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
              <div className="form-field">
                <label>Interest Amount</label>
                <input
                  type="number"
                  value={formData.interestAmount}
                  onChange={(e) => setFormData({ ...formData, interestAmount: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Emoji</label>
                <input
                  type="text"
                  value={formData.imoji}
                  onChange={(e) => setFormData({ ...formData, imoji: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setModalOpen(false)}>
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
