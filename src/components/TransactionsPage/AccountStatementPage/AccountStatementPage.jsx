import React, { useEffect, useState } from "react"
import AccountStatementForm from "./AccountStatementForm.jsx"
import { useSelector } from "react-redux"
import TableView from "../../TableView.jsx"
import TableEntity from "../../TableEntity.jsx"
import accountsServices from "../../../services/accounts.js"
import SingleCardDataDisplay from "../../SingleCardDataDisplay.jsx"
import transactionsServices from "../../../services/transactions.js"
const AccountStatementPage = () =>
{
  const [accountName, setAccountName] = useState("")
  const [startPeriodBalance, setStartPeriodBalance] = useState(null)
  const accountStatement = useSelector(state => state.accountStatement.data)
  const accountId = useSelector(state => state.accountStatement.dataHeader.accountId)
  const startPeriod = useSelector(state => state.accountStatement.dataHeader.startPeriod)
  const endPeriod = useSelector(state => state.accountStatement.dataHeader.endPeriod)

  const hook = async() =>
  {
    if(!accountId) return
    const accountDataResponse = await accountsServices.getAccountById(accountId)
    const balanceOfStartPeriodResponse = await transactionsServices.getAccountBalanceAtStartPeriod(accountId, startPeriod)
    if(accountDataResponse.state) setAccountName(accountDataResponse.data[0].name)
    if(balanceOfStartPeriodResponse.state) setStartPeriodBalance(balanceOfStartPeriodResponse.data[0].balance)
  }
  
  let style = {
              marginTop: '86px'
            }
  useEffect(()=>{hook()}, [accountId, startPeriod])
  return (
    <>
      <AccountStatementForm/>
      {
        accountName && startPeriodBalance !== null
        ? <>
            <SingleCardDataDisplay style={style} data={
                {
                  'كود الحساب': accountId,
                  'اسم الحساب': accountName,
                  'بداية الفترة': startPeriod,
                  'نهاية الفترة': endPeriod,
                  'رصيد بداية الفتر': startPeriodBalance
                }
              }/>
              <TableView pt={'0px'} ml={'286px'} heads={['كود', 'الرصيد', 'مدين', 'دائن', 'بيان', 'تاريخ']} >
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
            </>
        : null
      }
      
    </>
  )
}

export default AccountStatementPage