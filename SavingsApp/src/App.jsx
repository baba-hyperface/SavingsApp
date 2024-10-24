import { Route, Router, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Nav from './components/Nav'
import Home from './components/Home'
import { Box } from '@chakra-ui/react'
import BankDeatails from './components/BankDeatails'
import { DashBoard } from './components/DashBoard'
import { DeActivated } from './components/DeActivated'
import { DeActivatedPage } from './components/DeActivatedPage'
import { SavingPlans } from './components/SavingPlans'
import { SavingPlanPage } from './components/SavingPlanPage'
import { Transaction } from './components/Transaction'
import { DonutChart } from './components/DonutChart'

function App() {

  return (
    <Box >
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<BankDeatails/>}/>
          <Route path='/dashboard' element={<DashBoard/>}/>
          <Route path='/savingplan/:id' element={<SavingPlanPage />} />
          <Route path='/deactivated' element={<DeActivatedPage />}></Route>
          <Route path='/history' element={<Transaction />} />
          <Route path='/chart' element={<DonutChart />} />
        </Routes>
      </Box>
  )
}

export default App
