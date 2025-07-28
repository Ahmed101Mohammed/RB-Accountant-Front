import React, { useState } from "react";
import { Input } from "../../Input.jsx"
import { useDispatch, useSelector } from "react-redux"
import accountsServices from "../../../services/accounts.js";
import transactionsServices from "../../../services/transactions.js";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import Form from "../../Form.jsx";
import { setAccountId, setEndPeriod, setStartPeriod } from "../../../reducers/accountStatementForm.js";
import { setData } from "../../../reducers/accountStatement.js";
const AccountStatementForm = ({ legend }) => {
  const [ posibleAccounts, setPosibleAccounts] = useState([])
  const { accountId, startPeriod, endPeriod } = useSelector(state => state.accountStatementForm);
  const dispatch = useDispatch()

  const submitHandler = async(e)=>
  {
    e.preventDefault()
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

  const cancelHandler = (event)=>
  {
    event.preventDefault();
    dispatch(setData([]));
    dispatch(setAccountId(""));
    dispatch(setStartPeriod(""));
    dispatch(setEndPeriod(""));
  }

  const accountIdOnChange = async(e)=>
  {
    dispatch(setAccountId(e.target.value));
    const response = await accountsServices.getPossibleUsers(e.target.value)
    const firstTransactionDateResponse = await transactionsServices.getFirstTransactionDateOfAccount(e.target.value)
    const lastTransactionDateResponse = await transactionsServices.getLastTransactionDateOfAccount(e.target.value)
    if(firstTransactionDateResponse.state && lastTransactionDateResponse.state)
    {
      dispatch(setStartPeriod(firstTransactionDateResponse.data[0].date))
      dispatch(setEndPeriod(lastTransactionDateResponse.data[0].date))
    }
    else
    {
      dispatch(setStartPeriod(""))
      dispatch(setEndPeriod(""))
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
      <Input name={'account-id'} label={'كود الحساب'}
            type={'text'} placeholder={'أدخل كود الحساب مثل: 0000'} 
            onChange={accountIdOnChange} value={accountId} 
            onSelect={async(value)=> {
              dispatch(setAccountId(value))
              setPosibleAccounts([])
              const firstTransactionDateResponse = await transactionsServices.getFirstTransactionDateOfAccount(value)
              const lastTransactionDateResponse = await transactionsServices.getLastTransactionDateOfAccount(value)
              if(firstTransactionDateResponse.state && lastTransactionDateResponse.state)
              {
                dispatch(setStartPeriod(firstTransactionDateResponse.data[0].date))
                dispatch(setEndPeriod(lastTransactionDateResponse.data[0].date))
              }
              else
              {
                dispatch(setStartPeriod(""))
                dispatch(setEndPeriod(""))
              }
            }} listValues={posibleAccounts}/>
      <Input name={'date1'} label={'بداية الفترة'} 
            type={'date'} disabled={accountId === ""} 
            value={startPeriod} onChange={(e)=>dispatch(setStartPeriod(e.target.value))}/>
      <Input name={'date2'} label={'نهاية الفترة'} 
            type={'date'} disabled={accountId === ""}
            value={endPeriod} onChange={(e)=>dispatch(setEndPeriod(e.target.value))}/>
        
      {
        accountId !== ""
        ?
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={cancelHandler}>
            إلغاء
          </button>
        : null
      }
      
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          كشف معاملات الحساب
      </button>

    </Form>
  )
};

export default AccountStatementForm;
