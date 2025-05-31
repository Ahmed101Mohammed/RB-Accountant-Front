import React, { useState } from "react";
import Input from "../../Input.jsx"
import { useDispatch, useSelector } from "react-redux";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import { addTransaction, removeTransaction,  settransactionsFormCommentField, settransactionsFormDateField, toggleTransactionsFormState } from "../../../reducers/transactions.js";
import transactionsServices from "../../../services/transactions.js";
import Textarea from "../../Textarea.jsx";
import ParticipantsTableForm from "./ParticipantsTableForm.jsx";
import { ArrowDownDoubleIcon, Cancel01Icon } from "hugeicons-react";
const ManageTransactionsForm = () => {
  let amount = useSelector(state => state.transactions.transactionsForm.amountField)
  let debtorId = useSelector(state => state.transactions.transactionsForm.debtorIdField)
  let creditorId = useSelector(state => state.transactions.transactionsForm.creditorIdField)
  let comment = useSelector(state => state.transactions.transactionsForm.commentField)
  let date = useSelector(state => state.transactions.transactionsForm.dateField)
  let formState = useSelector(state => state.transactions.transactionsForm.state)
  let transactionId = useSelector(state => state.transactions.transactionsForm.transactionId)
  const dispatch = useDispatch()
  let [visibale, setVisibility] = useState(true)
  if(!visibale){
    return (
      <div dir="rtl" className="w-full">
        <button
          className="bg-blue-500 text-white px-2 py-1 w-full flex justify-center opacity-90 hover:opacity-100 active:opacity-100 transition-opacity"
          onClick={() => setVisibility(true)}
        >
          <ArrowDownDoubleIcon size={24}/>
        </button>
      </div>
    )
  }

  const onSubmitHandler = (e)=>
  {
    e.preventDefault()
    const target = e.target;
    // get the data from the form in this format:
    /*
    { date, comment, participants: {amount, id, role}}
    */

    const date = e.target.date.value
    const comment = e.target.comment.value
    const transactionData = {date, comment, participants: []}
    const allParticipantsRows = e.target.querySelector('tbody').querySelectorAll('tr')
    for(let participant of allParticipantsRows)
    {
      const id = participant.querySelector('input[type=text]').value
      const amount = participant.querySelector('input[type=number]').value
      const role = participant.querySelector('select').value
      transactionData.participants.push({id, amount, role})
    }
    console.log({transactionData})
    // From here you need to send the 'transactionData' to the backend
  }

  const cancelHandler = (e)=>
  {
    e.preventDefault()
    dispatch(toggleTransactionsFormState())
    reSetForm()
  }

  const removeAccountHandler = async(e)=>
  {
    e.preventDefault()
    const response = await transactionsServices.deleteTransaction(transactionId)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(toggleTransactionsFormState())
    reSetForm()
    dispatch(removeTransaction(transactionId))
  }

  const editHandler = async(e)=>
  {
    e.preventDefault()
    const response = await transactionsServices.updateTransaction(transactionId, amount, debtorId, creditorId, comment, date)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(toggleTransactionsFormState())
    reSetForm()
    const getUpdatedTransaction = await transactionsServices.getTransactionById(transactionId)
    dispatch(removeTransaction(transactionId))
    if(getUpdatedTransaction.state) dispatch(addTransaction(getUpdatedTransaction.data[0]))

  }
 
  return (
    <form className="w-[100%] p-2 bg-gray-100 border border-gray-600" onSubmit={onSubmitHandler}>
      <div dir="rtl" className="mb-2">
        <button onClick={()=> setVisibility(false)}><Cancel01Icon size={24}/></button>
      </div>
      <div className="w-[100%] grid gap-6 grid-cols-3">
        <ParticipantsTableForm/>
        <fieldset>
            <Input name={'date'} label={'تاريخ المعاملة'} 
              type={'date'} placeholder={'أدخل تارخ المعاملة مثل: 22-2-2025'} 
              onChange={(e)=> {
                dispatch(settransactionsFormDateField(e.target.value))
              }} value={date} />
              <Textarea name={"comment"} label={"بيان"} placeholder={'أدخل تعليق أو ملاحظة متعلق بالمعاملة'}
              onChange={(e)=> dispatch(settransactionsFormCommentField(e.target.value))} value={comment} 
              style={{maxHeight: '100px'}}
            />
        </fieldset>
      </div>
      <fieldset className={`grid gap-2 mt-4`}>
        {
          formState
          ? <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              أنشئ معاملة
            </button>
          :
            <>
              <button type="" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={editHandler}>
                عدل المعاملة
              </button>
              <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={removeAccountHandler}>
                احذف المعاملة
              </button>
              <button type="" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={cancelHandler}>
                إلغاء
              </button>
            </>
        }
      </fieldset>
    </form>
  )
 
};

export default ManageTransactionsForm;
