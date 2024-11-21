import React, { useEffect, useState } from "react";
import api from "./api";
import "../styles/Admin.css";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";

export const Admin = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const nav = useNavigate();

  const handleNav = (userid) => {
    nav(`/admin/${userid}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/user`);
        setUsers(res.data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const openEditModal = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/user/${editUser._id}`, editUser);
      setUsers(
        users.map((user) => (user._id === editUser._id ? editUser : user))
      );
      setIsModalOpen(false);
      alert("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handlesearch = async () => {
    try {
      const res = await api.get(`/searchusers/${searchTerm}`);
      setUsers(res.data.users);
      if (users.length === 0) {
        toast({
          title: "search successful.",
          description: res.data.message,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-container">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="xl" fontWeight="bold">
            Admin Panel
          </Text>
          <Flex gap={4}>
            <div
              colorScheme="teal"
            >
            <Link className="nav-link" to="/admincreatecategory">
            Create Category
            </Link>
            </div>
            <div
              colorScheme="blue"
            >
            <Link className="nav-link" to="/adminshowcategory">
            Show Categories
            </Link>
            </div>
          </Flex>
        </Flex>
      <Flex
        justify="space-between"
        align="center"
        verticalAlign={"center"}
        mb="4"
        py={4}
      >
        <Text fontWeight={"900"} as={"h1"} fontSize={"28px"}>
          List Of Users
        </Text>

        <Button
          as={Link}
          to="/createuser"
          colorScheme="teal"
          size="sm"
          borderRadius="md"
        >
          + Create
        </Button>
      </Flex>
      <Box>
        <Input
          placeholder="Search by email"
          value={searchTerm}
          border={"1px solid"}
          width={"25%"}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={(e) => handlesearch()}> Search </Button>
      </Box>

      {/* <h1>User Management</h1> */}
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Account Number</th>
            <th>Total Balance</th>
            <th>Saving Plans</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.accountNumber}</td>
              <td>{user.totalBalance}</td>
              <td onClick={() => handleNav(user._id)}>
                {user.pots?.length || 0}
              </td>
              <td className="actions">
                <i
                  className="fa-solid fa-pen-to-square"
                  onClick={() => openEditModal(user)}
                ></i>
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
            <h3>Edit User</h3>
            <label>
              Name:
              <input
                type="text"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </label>
            <label>
              Account Number:
              <input
                type="text"
                value={editUser.accountNumber}
                onChange={(e) =>
                  setEditUser({ ...editUser, accountNumber: e.target.value })
                }
              />
            </label>
            <label>
              Total Balance:
              <input
                type="number"
                value={editUser.totalBalance}
                onChange={(e) =>
                  setEditUser({ ...editUser, totalBalance: e.target.value })
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

export default Admin;
