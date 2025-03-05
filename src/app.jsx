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
const App = () => {
 
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/accounts' element={<AccountsPage/>}/>
        <Route path='/transactions' element={<TransactionsPage/>}>
        </Route>
        <Route path='/daily_transactions' element={<DailyTransactionsPage/>}/>
        <Route path='/discover_account_transactions' element={<AccountStatementPage/>}/>
      </Routes>
      <Notification/>
    </>
  )
}

export default App