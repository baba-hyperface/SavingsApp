// import React, { useEffect, useState } from 'react';
// import api from './api';
// import '../styles/Admin.css';
// import { Link, useNavigate } from 'react-router-dom';
// import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
// import { AdminSavingPlan } from './AdminSavingPlan';
// import { AdminNavigation } from './AdminNavigation';

// export const Admin = () => {
//     const [users, setUsers] = useState([]);
//     const [editUser, setEditUser] = useState(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredUsers,setFilteredUsers]=useState([]);
//     const nav = useNavigate();

// const handleNav = (userid) => {
//       nav(`/admin/${userid}`); 
//     };
    
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setLoading(true);
//                 const res = await api.get(`/user`);
//                 setUsers(res.data);
//             } catch (error) {
//                 console.log("Error fetching users:", error);
//             }finally{
//                 setLoading(false);
//             }
//         };
//         fetchUsers();
//     }, []);

//       const openEditModal = (user) => {
//             setEditUser(user);
//             setIsModalOpen(true);
//       };

//     const handleUpdate = async () => {
//         try {
//             await api.put(`/user/${editUser._id}`, editUser);
//             setUsers(users.map(user => (user._id === editUser._id ? editUser : user)));
//             setIsModalOpen(false);
//             alert('User updated successfully');
//         } catch (error) {
//             console.error("Error updating user:", error);
//         }
//     };
//     // const filteredUsers = users.filter(user => 
//     //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     // );
//     const handlesearch = async ()=>{
//         try {
//             const res= await api.get(`/searchusers/${searchTerm}`);
//             setUsers(res.data.users);
//             if(users.length === 0){
//                 toast({
//                     title: "search successful.",
//                     description:res.data.message,
//                     status: "success",
//                     duration: 2000,
//                     isClosable: true,
//                   });
          
//             }
//             // console.log(res.data);
            
//         } catch (error) {
//             console.log(error);

//         }
//     }
//     if(loading) return <p>Loading...</p>

//     return (
//         <div className='admin-main-container'>
//             <div>
//             <AdminNavigation />
//             </div>

//             <div className="admin-container">
//             <Flex  justify="space-between" align="center" verticalAlign={"center"} mb="4"py={4}>
//                 <Text 
//                 fontWeight={"900"}
//                 as={"h1"}
//                 fontSize={'28px'} 
//                  >List Of Users</Text>

//                 <Button 
//                     as={Link} 
//                     to="/createuser" 
//                     colorScheme="teal" 
//                     size="sm"
//                     borderRadius="md"
//                 >
//                     + Create

//                 </Button>
//             </Flex>
//             <div class="search-container">
//     <input
//       type="text"
//       placeholder="Search by Email..."
//       value={searchTerm}
//       onChange={(e) => setSearchTerm(e.target.value)}
//       className="search-input-admin"
//     />
//     <button className="search-button-style" onClick={(e) => handlesearch()}>
//       <i className="fa fa-search"></i>
//     </button>
//   </div>
//             <h3>Total Users: {users.length}</h3>
//             <table className="user-table">
//                 <thead>
//                     <tr>
//                         <th>User ID</th>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Account Number</th>
//                         <th>Total Balance</th>
//                         <th>Saving Plans</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((user) => (
//                         <tr key={user._id}>
//                             <td>{user._id}</td>
//                             <td>{user.name}</td>
//                             <td>{user.email}</td>
//                             <td>{user.accountNumber}</td>
//                             <td>{user.totalBalance}</td>
//                             <td onClick={() => handleNav(user._id)}>{user.pots?.length || 0}</td>
//                             <td className="actions">
//                                 <i className="fa-solid fa-pen-to-square" onClick={() => openEditModal(user)}></i>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {isModalOpen && (
//                 <div className="modal-overlay show">
//                     <div className="modal-content">
//                         <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
//                         <h3>Edit User</h3>
//                         <label>
//                             Name:
//                             <input
//                                 type="text"
//                                 value={editUser.name}
//                                 onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Email:
//                             <input
//                                 type="email"
//                                 value={editUser.email}
//                                 onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Account Number:
//                             <input
//                                 type="text"
//                                 value={editUser.accountNumber}
//                                 onChange={(e) => setEditUser({ ...editUser, accountNumber: e.target.value })}
//                             />
//                         </label>
//                         <label>
//                             Total Balance:
//                             <input
//                                 type="number"
//                                 value={editUser.totalBalance}
//                                 onChange={(e) => setEditUser({ ...editUser, totalBalance: e.target.value })}
//                             />
//                         </label>
//                         <button onClick={handleUpdate}>Save Changes</button>
//                         <button onClick={() => setIsModalOpen(false)}>Cancel</button>
//                     </div>
//                 </div>
//             )}
//              </div>
//         </div>
//     );
// };

// export default Admin;

import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';  
import { AdminNavigation } from './AdminNavigation';
import { Breadcrumbs } from './BreadCrumb';

export const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const usersPerPage = 15;

    // const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [loading, setLoading] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers,setFilteredUsers]=useState([]);
    const nav = useNavigate();

const handleNav = (userid) => {
      nav(`/admin/${userid}`); 
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/users?page=${currentPage}&limit=${usersPerPage}`);
                setUsers(res.data.users);
                setTotalUsers(res.data.totalUsers);
            } catch (error) {
                console.log("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage]);

    const openEditModal = (user) => {
        setEditUser(user);
        setIsModalOpen(true);
  };

const handleUpdate = async () => {
    try {
        await api.put(`/user/${editUser._id}`, editUser);
        setUsers(users.map(user => (user._id === editUser._id ? editUser : user)));
        setIsModalOpen(false);
        alert('User updated successfully');
    } catch (error) {
        console.error("Error updating user:", error);
    }
};

    // const handleSearch = async () => {
    //     try {
    //         setCurrentPage(1); // Reset page to 1 on search
    //         const res = await api.get(`/searchusers/${searchTerm}`);
    //         setUsers(res.data.users);
    //         setTotalUsers(res.data.users.length); // Adjust total users based on search results
    //     } catch (error) {
    //         console.error("Error searching users:", error);
    //     }
    // };
    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/searchusers/${searchTerm}?page=${currentPage}&limit=${usersPerPage}`);
            setUsers(res.data.users);
            setTotalUsers(res.data.totalUsers); 
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handlePageChange = (page) => {
        setCurrentPage(page); 
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage); // Calculate total pages

    if (loading) return <p>Loading...</p>;

    const getPageRange = () => {
        let range = [];

        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                range.push(i);
            }
            return range;
        }

        if (currentPage <= 3) {
            range = [1, 2, 3, 4];
            range.push('...');
            range.push(totalPages);
            return range;
        }

        if (currentPage >= totalPages - 3) {
            range.push(1);
            range.push('...');
            for (let i = totalPages - 2; i <= totalPages; i++) {
                range.push(i);
            }
            return range;
        }

        range.push(1);
        range.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            range.push(i);
        }
        range.push('...');
        range.push(totalPages);

        return range;
    };

    return (
        <div className="admin-container">
            <div>
                <Breadcrumbs/>
             <AdminNavigation />
             </div>
            <Flex justify="space-between" align="center" mb="4" py={4}>
                <Text fontWeight="900" as="h1" fontSize="28px">List Of Users</Text>
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
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-admin"
                />
                <button className="search-button-style" onClick={handleSearch}>
                    <i className="fa fa-search"></i>
                </button>
            </div>

            <h3>Total Users: {totalUsers}</h3>
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
                            <td onClick={() => handleNav(user._id)}>{user.pots?.length || 0}</td>
                            <td className="actions">
                                <i className="fa-solid fa-pen-to-square" onClick={() => openEditModal(user)}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Flex justify="center" mt="4" alignItems="center">
            
                {getPageRange().map((pageNumber, index) => (
                    pageNumber === '...' ? (
                        <Text key={index} mx="1">...</Text>
                    ) : (
                        <Button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            colorScheme={currentPage === pageNumber ? 'blue' : 'gray'}
                            mx="1"
                        >
                            {pageNumber}
                        </Button>
                    )
                ))}
            </Flex>

            {isModalOpen && (
                <div className="modal-overlay show">
                    <div className="modal-content">
                        <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3>Edit User</h3>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={editUser.name}
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                            />
                        </label>
                        <label>
                            Email:
                            <input
                                type="email"
                                value={editUser.email}
                                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                            />
                        </label>
                        <label>
                            Account Number:
                            <input
                                type="text"
                                value={editUser.accountNumber}
                                onChange={(e) => setEditUser({ ...editUser, accountNumber: e.target.value })}
                            />
                        </label>
                        <label>
                            Total Balance:
                            <input
                                type="number"
                                value={editUser.totalBalance}
                                onChange={(e) => setEditUser({ ...editUser, totalBalance: e.target.value })}
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
