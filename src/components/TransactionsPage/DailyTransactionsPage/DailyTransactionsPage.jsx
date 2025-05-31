import React, { useEffect, useRef, useState } from "react"
import TableView from "../../TableView.jsx"
import TableEntity from "../../TableEntity.jsx"
import { useDispatch, useSelector } from "react-redux"
import ManageTransactionsForm from "./ManageTransactionsForm.jsx"
import transactionsServices from "../../../services/transactions.js"
import Header from '../../Header/Header.jsx'
import { setTransactions, setTransactionsFormAmountField, settransactionsFormCommentField, settransactionsFormCreditorIdField, settransactionsFormDateField, settransactionsFormDebtorIdField, setTransactionsFormTransactionId, toggleTransactionsFormState } from "../../../reducers/transactions.js"
const DailyTransactionsPage = ()=>
{
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions.transactionsData)
  let formState = useSelector(state => state.transactions.transactionsForm.state)

  const getAllTransactions = async()=>
  {
    const transactionsResponse = await transactionsServices.getAllTransactions()
    if(transactionsResponse.state) dispatch(setTransactions([...transactions, ...transactionsResponse.data]))
  }
  
  useEffect(()=>
  {
    getAllTransactions()
  }, [])
  
  const onClickEntity = (e)=>
  {
    const tr = e.target.closest("tr")
    if(!tr) return
    const transactionId = tr.getAttribute('data-id')
    const amount = tr.getAttribute('data-amount')
    const debtorId = tr.getAttribute('data-debtor-id')
    const creditorId = tr.getAttribute('data-creditor-id')
    const comment = tr.getAttribute('data-comment')
    const date = tr.getAttribute('data-date')
    
    dispatch(setTransactionsFormAmountField(amount))
    dispatch(settransactionsFormDebtorIdField(debtorId))
    dispatch(settransactionsFormCreditorIdField(creditorId))
    dispatch(settransactionsFormCommentField(comment))
    dispatch(settransactionsFormDateField(date))
    dispatch(setTransactionsFormTransactionId(transactionId))
    if(!formState) return
    dispatch(toggleTransactionsFormState())
  }
  return(
    <>
      <div className="sticky top-[0px]">
        <Header/>
        <ManageTransactionsForm legend={'إنشاء/تعديل معاملة'} />
      </div>
      <TableView heads={["كود المعاملة", "مدين", "دائن", "كود الحساب", "اسم الحساب", "بيان", "تاريخ"]} 
      style={null} onClick={onClickEntity}>
        {
          transactions.map(({id, date, comment, participants}) =>
          {
            const dataHeader = {
              'data-id': id,
              'data-comment': comment,
              'data-date': date,
              'data-participants': JSON.stringify(participants)
            }
            return (
              <React.Fragment key={id}>
                {
                  participants.map(({dbRecordId, amount, state, account}) =>
                  {
                    if(!state) return (
                      <TableEntity key={`${dbRecordId}`} dataHeader={dataHeader}
                      data={[id, `E\u00A3 ${amount}`, "", account.id, account.name, comment, date]}  
                      customTailwind={'bg-teal-50 hover:bg-teal-100'}/>
                    )

                    return (
                      <TableEntity key={`${dbRecordId}`} dataHeader={dataHeader}
                      data={[id, "", `E\u00A3 ${amount}`, account.id, account.name, comment, date]} 
                      customTailwind={'bg-red-50 hover:bg-red-100'}/>
                    )
                  })
                }
              </React.Fragment>
            )
          })
        }      
      </TableView>
    </>
  )
}

export default DailyTransactionsPage