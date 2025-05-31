import React, { useEffect, useRef, useState } from "react";
import Input from "../../Input.jsx"
import { useDispatch } from "react-redux"
import accountsServices from "../../../services/accounts.js";
import transactionsServices from "../../../services/transactions.js";
import { setAccountId, setData, setEndPeriod, setStartPeriod } from "../../../reducers/accountStatement.js";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import Form from "../../Form.jsx";
const AccountStatementForm = ({ legend }) => {
  const [accountId, setAccountIdLocal] = useState("")
  const [firstPeriod, setFirstPeriod] = useState("")
  const [lastPeriod, setLastPeriod] = useState("")
  const [ posibleAccounts, setPosibleAccounts] = useState([])
  const wrapperRef = useRef(null)
  const dispatch = useDispatch()

  useEffect(()=>
  {
    const handleClickOutside = (e)=>
    {
      if(wrapperRef.current && !wrapperRef.current.contains(e.target))
      {
        setPosibleAccounts([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return ()=>
        {
          document.removeEventListener("mousedown", handleClickOutside)
        }
  },[])
  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const target = e.target
    const startPeriod= target.date1.value
    const endPeriod = target.date2.value
    if(accountId && startPeriod && endPeriod)
    {
      const transactions = await transactionsServices.getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
      if(transactions.state)
      {
        dispatch(setData(transactions.data))
        dispatch(setAccountId(accountId))
        dispatch(setStartPeriod(startPeriod))
        dispatch(setEndPeriod(endPeriod))
      }
      else
      {
        dispatch(setErrorNotification(transactions.message))
        setTimeout(()=> removeNotification(), 5000)
      }
    }
  }
  const accountIdOnChange = async(e)=>
  {
    setAccountIdLocal(e.target.value)
    const response = await accountsServices.getPossibleUsers(e.target.value)
    const firstTransactionDateResponse = await transactionsServices.getFirstTransactionDateOfAccount(e.target.value)
    const lastTransactionDateResponse = await transactionsServices.getLastTransactionDateOfAccount(e.target.value)
    if(firstTransactionDateResponse.state && lastTransactionDateResponse.state)
    {
      setFirstPeriod(firstTransactionDateResponse.data[0].date)
      setLastPeriod(lastTransactionDateResponse.data[0].date)
    }
    else
    {
      setFirstPeriod("")
      setLastPeriod("")
    }
    
    if(response.state)
    {
      setPosibleAccounts(response.data)
    }
    else
    {
      setPosibleAccounts([])
    }
  }

  return (
    <Form legend={legend} submitHandler={submitHandler}>
      <Input name={'account-id'} label={'كود الحساب'} ref={wrapperRef}
            type={'text'} placeholder={'أدخل كود الحساب مثل: 0000'} 
            onChange={accountIdOnChange} value={accountId} 
            onSelect={async(value)=> {
              console.log({value})
              setAccountIdLocal(value)
              setPosibleAccounts([])
              const firstTransactionDateResponse = await transactionsServices.getFirstTransactionDateOfAccount(value)
              const lastTransactionDateResponse = await transactionsServices.getLastTransactionDateOfAccount(value)
              if(firstTransactionDateResponse.state && lastTransactionDateResponse.state)
              {
                setFirstPeriod(firstTransactionDateResponse.data[0].date)
                setLastPeriod(lastTransactionDateResponse.data[0].date)
              }
              else
              {
                setFirstPeriod("")
                setLastPeriod("")
              }
            }} listValues={posibleAccounts}/>
      <Input name={'date1'} label={'بداية الفترة'} 
            type={'date'} disabled={accountId === ""} 
            value={firstPeriod} onChange={(e)=>setFirstPeriod(e.value)}/>
      <Input name={'date2'} label={'نهاية الفترة'} 
            type={'date'} disabled={accountId === ""}
            value={lastPeriod} onChange={(e)=>setLastPeriod(e.value)}/>
        
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          كشف معاملات الحساب
      </button>
    </Form>
  )
};

export default AccountStatementForm;
