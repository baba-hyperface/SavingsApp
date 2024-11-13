import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Nav from "./components/Nav";
import Home from "./components/Home";
import { Box } from "@chakra-ui/react";
import BankDeatails from "./components/BankDeatails";
import { DashBoard } from "./components/DashBoard";
import { DeActivatedPage } from "./components/DeActivatedPage";
import { SavingPlanPage } from "./components/SavingPlanPage";
import { Transaction } from "./components/Transaction";
import { DonutChart } from "./components/DonutChart";
import { useEffect, useState } from "react";
import api from "./components/api";
import Admin from "./components/Admin";
import { AdminPot } from "./components/AdminPot";
import AdminCreateUser from "./components/AdminCreateuser";
import PrivateRoute from "./PrivateRouter";

function App() {
  const [potData, setPotData] = useState([]);
  const userIdFromLocalStorage = localStorage.getItem("userid");

  useEffect(() => {
    const fetchPotData = async () => {
      try {
        const res = await api.get(`/user/${userIdFromLocalStorage}/savingplan`);
        setPotData(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPotData();
  }, []);

  return (
    <div className="container"> 
       <Box>
      <Nav />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/account"
          element={<BankDeatails />}/>

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        />
        <Route
          path="/savingplan/:id"
          element={
            <PrivateRoute>
              <SavingPlanPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/deactivated"
          element={
            <PrivateRoute >
              <DeActivatedPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <Transaction />
            </PrivateRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <PrivateRoute>
              <DonutChart savingsData={potData} />
            </PrivateRoute>
          }
        />

        {/* Admin-only Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:id"
          element={
            <PrivateRoute role="admin">
              <AdminPot />
            </PrivateRoute>
          }
        />
        <Route
          path="/createuser"
          element={
            <PrivateRoute role="admin">
              <AdminCreateUser />
            </PrivateRoute>
          }
        />
      </Routes>
    </Box>
    </div>
  );
}

export default App;
