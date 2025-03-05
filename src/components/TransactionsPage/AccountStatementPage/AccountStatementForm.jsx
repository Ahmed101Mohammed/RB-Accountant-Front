import React, { useEffect, useRef, useState } from "react";
import Input from "../../Input.jsx"
import { useDispatch } from "react-redux"
import accountsServices from "../../../services/accounts.js";
import transactionsServices from "../../../services/transactions.js";
import { setAccountId, setData, setEndPeriod, setStartPeriod } from "../../../reducers/accountStatement.js";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
const AccountStatementForm = ({ legend }) => {
  const [accountId, setAccountIdLocal] = useState("")
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
    <div className="fixed left-0 top-[86px] max-h-[calc(100%-86px)] max-w-1/5 p-4 bg-gray-100 shadow-lg overflow-auto">
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold">{legend}</legend>
        <form className="flex flex-col gap-4 mt-4" onSubmit={submitHandler}>
          <Input name={'account-id'} label={'كود الحساب'} ref={wrapperRef}
                type={'text'} placeholder={'أدخل كود الحساب مثل: 0000'} 
                onChange={accountIdOnChange} value={accountId} 
                onSelect={(value)=> {
                  setAccountIdLocal(value)
                  setPosibleAccounts([])
                  }} listValues={posibleAccounts}/>
          <Input name={'date1'} label={'بداية الفترة'} 
                type={'date'} disabled={accountId === ""} />
          <Input name={'date2'} label={'نهاية الفترة'} 
                type={'date'} disabled={accountId === ""}/>
            
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              كشف معاملات الحساب
          </button>

        </form>
      </fieldset>
    </div>
  );
};

export default AccountStatementForm;
