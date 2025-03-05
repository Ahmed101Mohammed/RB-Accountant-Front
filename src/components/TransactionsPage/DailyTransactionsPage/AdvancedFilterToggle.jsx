import { useDispatch, useSelector } from 'react-redux';
import accountsServices from '../../../services/accounts.js';
import transactionsServices from '../../../services/transactions.js';
import Input from '../../Input.jsx'
import React, { useEffect, useRef, useState } from 'react';
import { setAccountTransactionsFilterAccountId, setAccountTransactionsFilterEndPeriod, setAccountTransactionsFilterStartPeriod, setTransactions, toggleAccountTransactionsFilterState } from '../../../reducers/transactions.js';
import { removeNotification, setErrorNotification } from '../../../reducers/notification.js';

const AdvancedFilter = ({toggle}) => {
  const [id, setId] = useState("")
  const [possibleIds, setPossibleIds] = useState([])
  const wrapperRef = useRef(null)
  const dispatch = useDispatch()
  const filterState = useSelector( state => state.transactions.accountTransactionsFilter.state)
  useEffect(()=>
      {
        const handleClickOutsideCreditor = (e)=>
        {
          if(wrapperRef.current && !wrapperRef.current.contains(e.target))
          {
            setPossibleIds([])
          }
        }
    
        document.addEventListener("mousedown", handleClickOutsideCreditor)
    
        return ()=>
            {
              document.removeEventListener("mousedown", handleClickOutsideCreditor)
            }
      },[])
  const onSubmit = async (e)=>
  {
    e.preventDefault()
    const target = e.target
    const accountId = id
    let startPeriod = target.start_period.value
    let endPeriod = target.end_period.value
    let response = undefined;
    if(accountId)
    {
      if(!filterState) dispatch(toggleAccountTransactionsFilterState())
      dispatch(setAccountTransactionsFilterAccountId(accountId))
      if(startPeriod && endPeriod)
      {
        let temp;
        if(startPeriod > endPeriod)
        {
          temp = startPeriod
          startPeriod = endPeriod
          endPeriod = temp
        }
      }
      dispatch(setAccountTransactionsFilterStartPeriod(startPeriod))
      dispatch(setAccountTransactionsFilterEndPeriod(endPeriod))
    }
    if(startPeriod && endPeriod && accountId)
    {
      response = await transactionsServices.getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
      if(response.state) dispatch(setTransactions(response.data))
    }
    else if(startPeriod && endPeriod)
    {
      response = await transactionsServices.getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
      if(response.state) dispatch(setTransactions(response.data))
    }
    else if(accountId)
    {
      response = await transactionsServices.getAllTransactionsForAccount(accountId)
      if(response.state) dispatch(setTransactions(response.data))
    }

    if(response.state === false)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=>dispatch(removeNotification()), 5000)
    }
  }

  const cancelFilterHandler = async(e)=>
  {
    e.preventDefault()
    dispatch(toggleAccountTransactionsFilterState())
    const response = await transactionsServices.getAllTransactions()
    if(response.state) return dispatch(setTransactions(response.data))
    dispatch(setErrorNotification(response.message))
    setTimeout(()=> dispatch(removeNotification()), 5000)
  }

  const accountIdOnChange = async(e)=>
  {
    setId(e.target.value)
    const response = await accountsServices.getPossibleUsers(e.target.value)
    if(response.state)
    {
      setPossibleIds(response.data)
    }
    else
    {
      setPossibleIds([])
    }
  }
  return (
    <div
      className={`transition-all duration-300 block mt-[86px] ml-[286px] mb-2 p-4 bg-white shadow-lg rounded-2xl w-[calc(100%-286px)] min-h-[150px]`}
    >
      <div className="flex justify-between items-center mb-4">
        <button className='px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200' onClick={() => toggle(false)}>إخفاء</button>
        <h2 className="text-xl font-semibold">فلتر المعاملات</h2>
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input type={'date'} name={'end_period'} label={'نهاية الفترة'}/>
        <Input type={'date'} name={'start_period'} label={'بداية الفترة'}/>
        <Input type={'text'} name={'account-id'} label={'كود الحساب'} ref={wrapperRef}
              placeholder={'أدخل كود الحساب مثل: 0000'} value={id} onChange={accountIdOnChange} listValues={possibleIds}
              onSelect={(id)=>{
                setId(id)
                setPossibleIds([])
              }}/>
        <div className='p-1 col-start-3' dir='rtl'>
          <button type='submit' className='px-4  ml-2 py-2 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200'>فلتر</button>
          <button onClick={cancelFilterHandler} className='px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200'>إلغاء الفلترة</button>
        </div>
      </form>
    </div>
  );
};

const AdvancedFilterToggle = () => {
  const [showFilter, setShowFilter] = useState(false);

  if(showFilter) return  <AdvancedFilter toggle={setShowFilter}/>
  return (
    <div className="relative mt-[86px] ml-[286px]">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="top-[90px] left-[300px] z-10 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-200"
      >
        إظهار الفلتر
      </button>
    </div>
  );
};

export default AdvancedFilterToggle;
