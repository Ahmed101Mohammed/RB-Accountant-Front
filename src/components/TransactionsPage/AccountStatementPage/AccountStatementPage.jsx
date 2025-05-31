import React, { useEffect, useState } from "react"
import AccountStatementForm from "./AccountStatementForm.jsx"
import { useSelector } from "react-redux"
import TableView from "../../TableView.jsx"
import TableEntity from "../../TableEntity.jsx"
import accountsServices from "../../../services/accounts.js"
import SingleCardDataDisplay from "../../SingleCardDataDisplay.jsx"
import transactionsServices from "../../../services/transactions.js"
import Header from "../../Header/Header.jsx"
import { File01Icon } from "hugeicons-react"
const AccountStatementPage = () =>
{
  const [accountName, setAccountName] = useState("")
  const [startPeriodBalance, setStartPeriodBalance] = useState(null)
  const accountStatement = useSelector(state => state.accountStatement.data)
  const accountId = useSelector(state => state.accountStatement.dataHeader.accountId)
  const startPeriod = useSelector(state => state.accountStatement.dataHeader.startPeriod)
  const endPeriod = useSelector(state => state.accountStatement.dataHeader.endPeriod)
  const exportedData = {
    accountStatement,
    statementHeader: {
      accountName,
      accountId,
      startPeriod,
      endPeriod,
      startPeriodBalance
    }
  }

  const hook = async() =>
  {
    if(!accountId) return
    const accountDataResponse = await accountsServices.getAccountById(accountId)
    const balanceOfStartPeriodResponse = await transactionsServices.getAccountBalanceAtStartPeriod(accountId, startPeriod)
    if(accountDataResponse.state) setAccountName(accountDataResponse.data[0].name)
    if(balanceOfStartPeriodResponse.state) setStartPeriodBalance(balanceOfStartPeriodResponse.data[0].balance)
  }

  useEffect(()=>{hook()}, [accountId, startPeriod])

  let headerChildren = (accountName && startPeriodBalance !== null)
    ? [<button className='flex items-center gap-2 text-zinc-600 hover:text-zinc-900' onClick={()=>{
              transactionsServices.exportExcel(exportedData)
            }}><File01Icon size={34}/></button>]
    : null;
  return (
    <>
      <div className="sticky top-[0px]">
        <Header children={headerChildren}/>
        <AccountStatementForm legend={'كشف معاملات حساب'}/>
      </div>
      {
        accountName && startPeriodBalance !== null
        ? <>
            <SingleCardDataDisplay data={
                {
                  'كود الحساب': accountId,
                  'اسم الحساب': accountName,
                  'بداية الفترة': startPeriod,
                  'نهاية الفترة': endPeriod
                }
              }/>
              <TableView heads={['كود', 'الرصيد', 'مدين', 'دائن', 'بيان', 'تاريخ']} >
                <TableEntity key={'-'} data={['', startPeriodBalance, '', '', 'رصيد بداية الفترة', '']}/>
                {
                  accountStatement.map(({transaction_id, balance, amount, state, comment, date}) =>
                  {
                    let customTailwind = state
                    ? 'bg-teal-50 hover:bg-teal-100'
                    : 'bg-red-50 hover:bg-red-100'
                    if(state) return <TableEntity key={transaction_id} data={[transaction_id, balance, amount, "", comment, date]} customTailwind={customTailwind}/>
                    return <TableEntity key={transaction_id} data={[transaction_id, balance, "", amount, comment, date]} customTailwind={customTailwind}/>
                  }
                  )
                }
              </TableView>
              {/* <button onClick={()=>{
                transactionsServices.exportPDF(accountStatement)
              }}>export PDF</button> */}
              
            </>
        : null
      }
      
    </>
  )
}

export default AccountStatementPage