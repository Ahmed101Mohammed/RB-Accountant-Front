import React, { useEffect, useRef, useState } from "react";
import Input from "../../Input.jsx"
import { useDispatch, useSelector } from "react-redux";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import { addTransaction, removeTransaction, reSetTransactionsFormDateField, setTransactions, setTransactionsFormAmountField, settransactionsFormCommentField, settransactionsFormCreditorIdField, settransactionsFormDateField, settransactionsFormDebtorIdField, setTransactionsFormTransactionId, toggleTransactionsFormState } from "../../../reducers/transactions.js";
import transactionsServices from "../../../services/transactions.js";
import accountsServices from "../../../services/accounts.js";
const ManageTransactionsForm = ({ legend }) => {
  let amount = useSelector(state => state.transactions.transactionsForm.amountField)
  let debtorId = useSelector(state => state.transactions.transactionsForm.debtorIdField)
  let creditorId = useSelector(state => state.transactions.transactionsForm.creditorIdField)
  let comment = useSelector(state => state.transactions.transactionsForm.commentField)
  let date = useSelector(state => state.transactions.transactionsForm.dateField)
  let formState = useSelector(state => state.transactions.transactionsForm.state)
  // let posibleAccounts = useSelector(state => state.transactions.transactionsForm.accountsListOptions)
  let transactionId = useSelector(state => state.transactions.transactionsForm.transactionId)
  const [possibleAccountsForCreditor, setPossibleAccountsForCreditor] = useState()
  const [possibleAccountsForDebtor, setPossibleAccountsForDebtor] = useState()
  const dispatch = useDispatch()
  const wrapperRefForCreditor = useRef(null)
  const wrapperRefForDebtor = useRef(null)
  useEffect(()=>
    {
      const handleClickOutsideCreditor = (e)=>
      {
        if(wrapperRefForCreditor.current && !wrapperRefForCreditor.current.contains(e.target))
        {
          setPossibleAccountsForCreditor([])
        }
      }
  
      document.addEventListener("mousedown", handleClickOutsideCreditor)
  
      return ()=>
          {
            document.removeEventListener("mousedown", handleClickOutsideCreditor)
          }
    },[])

  useEffect(()=>
    {
      const handleClickOutsideDebtor = (e)=>
      {
        if(wrapperRefForDebtor.current && !wrapperRefForDebtor.current.contains(e.target))
        {
          setPossibleAccountsForDebtor([])
        }
      }
  
      document.addEventListener("mousedown", handleClickOutsideDebtor)
  
      return ()=>
          {
            document.removeEventListener("mousedown", handleClickOutsideDebtor)
          }
    },[])

  const reSetForm = ()=>
  {
    dispatch(setTransactionsFormAmountField(""))
    dispatch(settransactionsFormDebtorIdField(""))
    dispatch(settransactionsFormCreditorIdField(""))
    dispatch(settransactionsFormCommentField(""))
    dispatch(reSetTransactionsFormDateField())
    dispatch(setTransactionsFormTransactionId(undefined))
  }
  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await transactionsServices.createTransaction(amount, debtorId, creditorId, comment, date)
    if(response.state) 
    {
      let newTransactionId = response.data[0].lastInsertRowid
      const getTransactionByIdResponse = await transactionsServices.getTransactionById(newTransactionId)
      
      if(getTransactionByIdResponse.state)
      {
        dispatch(addTransaction(getTransactionByIdResponse.data[0]))
      }
      reSetForm()
    }
    else
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 5000)
    }
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

  const debtorIdOnChange = async(e)=>
  {
    dispatch(settransactionsFormDebtorIdField(e.target.value))
    const response = await accountsServices.getPossibleUsers(e.target.value)
    if(response.state)
    {
      setPossibleAccountsForDebtor(response.data)
    }
    else
    {
      setPossibleAccountsForDebtor([])
    }
  }
  const creditorIdOnChange = async(e)=>
  {
    dispatch(settransactionsFormCreditorIdField(e.target.value))
    const response = await accountsServices.getPossibleUsers(e.target.value)
    if(response.state)
    {
      setPossibleAccountsForCreditor(response.data)
    }
    else
    {
      setPossibleAccountsForCreditor([])
    }
  }

  return (
    <div className="fixed left-0 top-[86px] max-h-[calc(100%-86px)] max-w-1/5 p-4 bg-gray-100 shadow-lg overflow-auto" >
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold">{legend}</legend>
        <form className="flex flex-col gap-4 mt-4" onSubmit={submitHandler}>
          <Input name={'amount'} label={'المبلغ'} 
                type={'number'} step={"0.01"} 
                placeholder={'أدخل مبلغ المعاملة مثل: 23889'} 
                onChange={(e)=> dispatch(setTransactionsFormAmountField(e.target.value))} value={amount} />
          <Input name={'debtor-id'} label={'كود المدين'} ref={wrapperRefForDebtor} 
                type={'text'} placeholder={'أدخل كود حساب المدين مثل: 0000'} 
                onChange={debtorIdOnChange} value={debtorId} 
                onSelect={(value)=> {
                  dispatch(settransactionsFormDebtorIdField(value))
                  setPossibleAccountsForDebtor([])
                  }} listValues={possibleAccountsForDebtor}/>
          <Input name={'creditor-id'} label={'كود الدائن'} ref={wrapperRefForCreditor}
                type={'text'} placeholder={'أدخل كود حساب الدائن مثل: 0001'} 
                onChange={creditorIdOnChange} value={creditorId} 
                onSelect={(value)=> {
                  dispatch(settransactionsFormCreditorIdField(value))
                  setPossibleAccountsForCreditor([])
                  }} listValues={possibleAccountsForCreditor}
                />
          <div className="flex flex-col">
            <label htmlFor="comment" className="font-medium text-right">تعليق</label>
            <textarea name={'comment'} type={'text'} dir="rtl" className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 text-right focus:ring-blue-500"
                      placeholder={'أدخل تعليق أو ملاحظة متعلق بالمعاملة'} 
                      onChange={(e)=> dispatch(settransactionsFormCommentField(e.target.value))} value={comment} ></textarea>
          </div>
          <Input name={'date'} label={'تاريخ المعاملة'} 
                type={'date'} placeholder={'أدخل تارخ المعاملة مثل: 22-2-2025'} 
                onChange={(e)=> {
                  dispatch(settransactionsFormDateField(e.target.value))
                }} value={date} />
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

        </form>
      </fieldset>
    </div>
  );
};

export default ManageTransactionsForm;
