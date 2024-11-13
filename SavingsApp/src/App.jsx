import { Route, Router, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Nav from "./components/Nav";
import Home from "./components/Home";
import { Box } from "@chakra-ui/react";
import BankDeatails from "./components/BankDeatails";
import { DashBoard } from "./components/DashBoard";
import { DeActivated } from "./components/DeActivated";
import { DeActivatedPage } from "./components/DeActivatedPage";
import { SavingPlans } from "./components/SavingPlans";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<BankDeatails />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/savingplan/:id" element={<SavingPlanPage />} />
        <Route path="/deactivated" element={<DeActivatedPage />}></Route>
        <Route path="/history" element={<Transaction />} />
        <Route path="/chart" element={<DonutChart savingsData={potData} />} />
        {/* <Route path='/admin' element={<Admin />} />
          <Route path='/admin/:id' element={<AdminPot />} />
          <Route path='createuser' element={<AdminCreateUser/>}/> */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/:id"
          element={
            <PrivateRoute>
              <AdminPot />
            </PrivateRoute>
          }
        />
        <Route
          path="/createuser"
          element={
            <PrivateRoute>
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
