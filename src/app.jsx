import React, { useEffect } from 'react'
import './index.css'
import { Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Home from './components/Home/Home.jsx'
import AccountsPage from './components/AccountsPage/AccountsPage.jsx'
import Notification from './components/Notification/Notification.jsx'
import TransactionsPage from './components/TransactionsPage/TransactionsPage.jsx'
import DailyTransactionsPage from './components/TransactionsPage/DailyTransactionsPage/DailyTransactionsPage.jsx'
import AccountStatementPage from './components/TransactionsPage/AccountStatementPage/AccountStatementPage.jsx'
import { ConfirmMessage } from './components/ConfirmMessage.jsx'
import EmployeesPage from './components/EmployeesPage/EmployeesPage.jsx'
import { MachinesPage } from './features/machines/components/MachinesPage.jsx'
import { ItemsPage } from './features/items/components/ItemsPage.jsx'
import { DailyProductionPage } from './features/dailyProduction/components/DailyProductionPage.jsx'
const App = () => {
 
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/accounts' element={<AccountsPage/>}/>
        <Route path='/employees' element={<EmployeesPage/>}/>
        <Route path='/machines' element={<MachinesPage/>}/>
        <Route path='/items' element={<ItemsPage/>}/>
        <Route path='/transactions' element={<TransactionsPage/>}>
        </Route>
        <Route path='/daily_transactions' element={<DailyTransactionsPage/>}/>
        <Route path='/discover_account_transactions' element={<AccountStatementPage/>}/>
        <Route path='/dailyProduction' element={<DailyProductionPage/>}/>
      </Routes>
      <ConfirmMessage/>
      <Notification/>
    </>
  )
}

export default App