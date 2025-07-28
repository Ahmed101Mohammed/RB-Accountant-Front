import React, { useState } from "react";
import { Input } from "../../Input.jsx"
import { useDispatch, useSelector } from "react-redux";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import { addTransaction, removeTransaction,  setTransactions} from "../../../reducers/transactions.js";
import { reSetComment, reSetDate, reSetParticipants, reSetTransactionId, setComment, setDate, setState } from "../../../reducers/transactionForm.js";
import transactionsServices from "../../../services/transactions.js";
import Textarea from "../../Textarea.jsx";
import ParticipantsTableForm from "./ParticipantsTableForm.jsx";
import { ArrowDownDoubleIcon, Cancel01Icon } from "hugeicons-react";
import { useConfirm } from "../../../customStates/useConfirm.js";
import { reSetButtonName, reSetMessage, toggleVisibility } from "../../../reducers/confirm.js";
const ManageTransactionsForm = ({ref}) => {

  let comment = useSelector(state => state.transactionForm.comment);
  let date = useSelector(state => state.transactionForm.date);
  let participants = useSelector(state => state.transactionForm.participants)
  let formState = useSelector(state => state.transactionForm.state);
  let transactionId = useSelector(state => state.transactionForm.transactionId)
  let confirm = useConfirm()

  const transactions = useSelector(state => state.transactions)

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

  const reSetForm = ()=>
  {
    dispatch(reSetDate());
    dispatch(reSetComment());
    dispatch(reSetParticipants());
    dispatch(reSetTransactionId());
  }

  const onSubmitHandler = async(e)=>
  {
    e.preventDefault()
    const target = e.target;
    // get the data from the form in this format:
    /*
    { date, comment, participants: {amount, id, role}}
    */

    const transactionData = {date, comment, participants};
    const response = await transactionsServices.createTransaction(transactionData);
    if(response.state === false)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    reSetForm()

    const newTransactionId = response.data[0].lastInsertRowid
    const newTransactionDataResponse = await transactionsServices.getTransactionById(newTransactionId);
    if(newTransactionDataResponse.state === false)
    {
      dispatch(setErrorNotification(newTransactionDataResponse.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(addTransaction(newTransactionDataResponse.data[0]))
  }

  const cancelHandler = (e)=>
  {
    e.preventDefault()
    dispatch(setState(true))
    reSetForm()
  }

  const deleteHandler = async(e)=>
  {
    e.preventDefault()
    const confirmDelete = await confirm("هل متأكد من حذف هذه المعاملة؟", "متأكد");
    if(confirmDelete === false) 
    {
      dispatch(reSetMessage());
      dispatch(reSetButtonName());
      dispatch(toggleVisibility());
      return;
    }

    const response = await transactionsServices.deleteTransaction(transactionId)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    
    dispatch(setState(true))
    reSetForm()
    dispatch(removeTransaction(transactionId))
  }

  const updateHandler = async(e)=>
  {
    e.preventDefault()
    /*
    { date, comment, participants: {amount, id, role}}
    */
    const transactiondData = {date, comment, participants};
    const response = await transactionsServices.updateTransaction(transactionId, transactiondData)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    const getUpdatedTransaction = await transactionsServices.getTransactionById(transactionId);
    dispatch(removeTransaction(transactionId));
    if(getUpdatedTransaction.state) dispatch(addTransaction(getUpdatedTransaction.data[0]));
    reSetForm() 
    dispatch(setState(true))
  }
 
  return (
    <form className="w-[100%] p-2 bg-gray-100 border border-gray-600" onSubmit={onSubmitHandler} ref={ref}>
      <div dir="rtl" className="mb-2">
        <button onClick={()=> setVisibility(false)}><Cancel01Icon size={24}/></button>
      </div>
      <div className="w-[100%] grid gap-6 grid-cols-3" dir="rtl">
        <ParticipantsTableForm/>
        <fieldset>
            <Input name={'date'} label={'تاريخ المعاملة'} 
              type={'date'} placeholder={'أدخل تارخ المعاملة مثل: 22-2-2025'} 
              onChange={(e)=> {
                dispatch(setDate(e.target.value))
              }} value={date} />
              <Textarea name={"comment"} label={"بيان"} placeholder={'أدخل تعليق أو ملاحظة متعلق بالمعاملة'}
              onChange={(e)=> dispatch(setComment(e.target.value))} value={comment} 
              style={{maxHeight: '100px'}}
            />
        </fieldset>
      </div>
      <fieldset className={`grid gap-2 grid-cols-3 mt-4`}>
        {
          formState
          ? <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 col-span-3">
              أنشئ معاملة
            </button>
          :
            <>
              <button type="" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={updateHandler}>
                عدل المعاملة
              </button>
              <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={deleteHandler}>
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
