import React, { useEffect, useRef, useState } from "react"
import TableView from "../../TableView.jsx"
import TableEntity from "../../TableEntity.jsx"
import { useDispatch, useSelector } from "react-redux"
import ManageTransactionsForm from "./ManageTransactionsForm.jsx"
import transactionsServices from "../../../services/transactions.js"
import Header from '../../Header/Header.jsx'
import { setTransactions } from "../../../reducers/transactions.js"
import { setComment, setDate, setParticipants, setTransactionId, setState } from "../../../reducers/transactionForm.js";
const DailyTransactionsPage = ()=>
{
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions)
  const bottomRef = useRef(null);
  const formRef = useRef(null);
  const getAllTransactions = async()=>
  {
    const transactionsResponse = await transactionsServices.getAllTransactions()
    if(transactionsResponse.state) dispatch(setTransactions(transactionsResponse.data))
  }
  
  useEffect(()=>
  {
    if(bottomRef.current)
    {
      bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [transactions])
  useEffect(()=>
  {
    getAllTransactions()
  }, [])
  
  const onClickEntity = (e)=>
  {
    const tr = e.target.closest("tr")
    if(!tr) return
    const transactionId = tr.getAttribute('data-id')
    const comment = tr.getAttribute('data-comment')
    const date = tr.getAttribute('data-date')
    const participants = JSON.parse(tr.getAttribute('data-participants'));
    const lightParticipants = participants.map(participant => { return {id: participant.account.id, amount: participant.body.amount, role: participant.body.role} });
    dispatch(setDate(date));
    dispatch(setComment(comment));
    dispatch(setParticipants(lightParticipants));
    dispatch(setTransactionId(transactionId));
    dispatch(setState(false))
  }
  return(
    <>
      <div className="sticky top-[0px] z-10">
        <Header/>
        <ManageTransactionsForm ref={formRef} legend={'إنشاء/تعديل معاملة'} />
      </div>
      <TableView heads={["كود المعاملة", "مدين", "دائن", "كود الحساب", "اسم الحساب", "بيان", "تاريخ"]} 
      style={null} onClick={onClickEntity}>
        {
          transactions.map(({id, body}) =>
          {
            const metaData = body.metaData;
            const participants = body.participants;
            const dataHeader = {
              'data-id': id,
              'data-comment': metaData.comment,
              'data-date': metaData.date,
              'data-participants': JSON.stringify(participants)
            }
            return (
              <React.Fragment key={id}>
                {
                  participants.map(({dbRecordId, body, account}) =>
                  {
                    if(body.role === 0) return (
                      <TableEntity key={`${dbRecordId}`} dataHeader={dataHeader}
                      data={[id, `E\u00A3 ${body.amount}`, "", account.id, account.name, metaData.comment, metaData.date]}  
                      customTailwind={'bg-teal-50 hover:bg-teal-100'}/>
                    )

                    return (
                      <TableEntity key={`${dbRecordId}`} dataHeader={dataHeader}
                      data={[id, "", `E\u00A3 ${body.amount}`, account.id, account.name, metaData.comment, metaData.date]} 
                      customTailwind={'bg-red-50 hover:bg-red-100'}/>
                    )
                  })
                }
              </React.Fragment>
            )
          })
        }      
      </TableView>
      <span ref={bottomRef}></span>
    </>
  )
}

export default DailyTransactionsPage