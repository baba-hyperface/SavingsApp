import React, { useEffect, useState } from "react";
import api from "./api";
import { useParams } from "react-router-dom";
import "../styles/AdminPot.css";

export const AdminPot = () => {
  const [potData, setPotData] = useState([]);
  const [editPot, setEditPot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const openEditModal = (pot) => {
    setEditPot(pot);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/user/${id}/savingplan`);
        console.log(res.data);
        setPotData(res.data);
      } catch (error) {
        console.log("Error fetching saving pots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  if (loading) {
    return <p>Loading....</p>;
  }

  const handleUpdate = async () => {
    try {
      await api.put(
        `/user/${id}/savingplanupdateplandeduction/${editPot._id}`,
        editPot
      );
      setPotData(
        potData.map((pot) => (pot._id === editPot._id ? editPot : pot))
      );
      setIsModalOpen(false);
      alert("Saving pot updated successfully");
    } catch (error) {
      console.error("Error updating saving pot", error);
    }
  };

  return (
    <div className="admin-container">
      <h1>Manage User Saving Plans</h1>
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
                <td>{pot.potStatus ? "Active" : "Inactive"}</td>
                <td>{new Date(pot.startDate).toLocaleDateString()}</td>
                <td>
                  {pot.endDate
                    ? new Date(pot.endDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{pot.autoDeduction ? "Enabled" : "Disabled"}</td>
                <td>
                  <div className="actions">
                    <i
                      className="fa fa-pen-to-square"
                      onClick={() => openEditModal(pot)}
                    ></i>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay show">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </span>
            <h3>Edit Saving Plan</h3>
            <label>
              Pot Purpose:
              <input
                type="text"
                value={editPot.potPurpose}
                onChange={(e) =>
                  setEditPot({ ...editPot, potPurpose: e.target.value })
                }
              />
            </label>
            <label>
              Target Amount:
              <input
                type="number"
                value={editPot.targetAmount}
                onChange={(e) =>
                  setEditPot({ ...editPot, targetAmount: e.target.value })
                }
              />
            </label>
            <label>
              Current Balance:
              <input
                type="number"
                value={editPot.currentBalance}
                onChange={(e) =>
                  setEditPot({ ...editPot, currentBalance: e.target.value })
                }
              />
            </label>
            <label>
              Status:
              <select
                style={{height:"30px"}}
                value={editPot.potStatus ? "active" : "inactive"}
                onChange={
                  (e) =>
                    setEditPot({
                      ...editPot,
                      potStatus: e.target.value === "active",
                    }) 
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <div>
              <label>Auto Deduction:</label>
              <label>
                <input
                  type="radio"
                  name="autoDeduction"
                  value="true"
                  checked={editPot.autoDeduction === true}
                  onChange={() =>
                    setEditPot({ ...editPot, autoDeduction: true })
                  }
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="autoDeduction"
                  value="false"
                  checked={editPot.autoDeduction === false}
                  onChange={() =>
                    setEditPot({ ...editPot, autoDeduction: false })
                  }
                />
                No
              </label>
            </div>
            <label>
              End Date:
              <input
                type="date"
                value={editPot.endDate}
                onChange={(e) =>
                  setEditPot({ ...editPot, endDate: e.target.value })
                }
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
