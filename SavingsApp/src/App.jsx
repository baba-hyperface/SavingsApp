import { Route, Routes, useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Nav from "./components/Nav";
import Home from "./components/Home";
import BankDeatails from "./components/BankDeatails";
import { DashBoard } from "./components/DashBoard";
import { DeActivatedPage } from "./components/DeActivatedPage";
import { SavingPlanPage } from "./components/SavingPlanPage";
import { Transaction } from "./components/Transaction";
import { DonutChart } from "./components/DonutChart";
import Admin from "./components/Admin";
import { AdminPot } from "./components/AdminPot";
import AdminCreateUser from "./components/AdminCreateuser";
import PrivateRoute from "./PrivateRouter";
import { SavingPlans } from "./components/SavingPlans";
import { AdminSavingPlan } from "./components/AdminSavingPlan";
import api from "./components/api";
import ShowCategory from "./components/AdminCategoryList";
import { CategoryForm } from "./components/AdminCategoryform";

function App() {
  const [potData, setPotData] = useState([]);
  const userIdFromLocalStorage = localStorage.getItem("userid");
  const location = useLocation();

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
  }, [userIdFromLocalStorage]);

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  const pageTransition = {
    duration: 0.2,
  };

  return (
    <div className="container">
      <Box>
        <Nav />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Home />
                </motion.div>
              }
            />
            <Route
              path="/login"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Login />
                </motion.div>
              }
            />
            <Route
              path="/register"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <Register />
                </motion.div>
              }
            />
            <Route
              path="/account"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <BankDeatails />
                </motion.div>
              }
            />
            <Route
              path="/savingplan"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <SavingPlans />
                </motion.div>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <DashBoard />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/savingplan/:id"
              element={
                <PrivateRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <SavingPlanPage />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/deactivated"
              element={
                <PrivateRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <DeActivatedPage />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Transaction />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/chart"
              element={
                <PrivateRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <DonutChart savingsData={potData} />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <Admin />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/:id"
              element={
                <PrivateRoute role="admin">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <AdminPot />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path='/Category'
              element={
                <PrivateRoute role="admin">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <ShowCategory />
                  </motion.div>
                </PrivateRoute>
              }
            />

          <Route
             path='/Category/CreateCategory'
              element={
                <PrivateRoute role="admin">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                   <CategoryForm />
                  </motion.div>
                </PrivateRoute>
              }
            />

            <Route
              path="/Allsavingplan"
              element={
                <PrivateRoute role="admin">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <AdminSavingPlan />
                  </motion.div>
                </PrivateRoute>
              }
            />
            <Route
              path="/createuser"
              element={
                <PrivateRoute role="admin">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                    transition={pageTransition}
                  >
                    <AdminCreateUser />
                  </motion.div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </Box>
    </div>
  );
}

export default App;