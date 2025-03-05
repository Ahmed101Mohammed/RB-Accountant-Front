import React, { useEffect, useRef, useState } from "react"
import TableView from "../../TableView.jsx"
import TableEntity from "../../TableEntity.jsx"
import { useDispatch, useSelector } from "react-redux"
import ManageTransactionsForm from "./ManageTransactionsForm.jsx"
import transactionsServices from "../../../services/transactions.js"
import { setTransactions, setTransactionsFormAmountField, settransactionsFormCommentField, settransactionsFormCreditorIdField, settransactionsFormDateField, settransactionsFormDebtorIdField, setTransactionsFormTransactionId, toggleTransactionsFormState } from "../../../reducers/transactions.js"
import AdvancedFilterToggle from "./AdvancedFilterToggle.jsx"
import SingleCardDataDisplay from "../../SingleCardDataDisplay.jsx"
import accountsServices from "../../../services/accounts.js"

const DailyTransactionsPage = ()=>
{
  const [filteredAccountName, setFilteredAccountName] = useState('')
  const [filteredAccountBalance, setFilteredAccountBalance] = useState(0)
  // infinity scroll
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef(null)
  //
  const dispatch = useDispatch()
  const transactions = useSelector(state => state.transactions.transactionsData)
  const filterState = useSelector( state => state.transactions.accountTransactionsFilter.state)
  const filterAccountId = useSelector( state => state.transactions.accountTransactionsFilter.accountId)
  const filterAccountStartPeriod = useSelector( state => state.transactions.accountTransactionsFilter.startPeriod)
  const filterAccountEndPeriod = useSelector( state => state.transactions.accountTransactionsFilter.endPeriod)
  let formState = useSelector(state => state.transactions.transactionsForm.state)

  const getAllTransactions = async(page)=>
  {
    if(loading) return
    setLoading(true)
    const transactionsResponse = await transactionsServices.getAllTransactionsWithPaging(page)
    if(transactionsResponse.state) dispatch(setTransactions([...transactions, ...transactionsResponse.data]))
    if(transactionsResponse.data.length < 3) setHasMore(false)
    setLoading(false)
  }

  // Observer to detect when last element is visible
  useEffect(()=>{
    if(!hasMore || loading || filterState) return
    const observer = new IntersectionObserver(
      (entities)=>
      {
        if(entities[0].isIntersecting)
        {
          setPage((prePage)=> prePage+1)
        }
      },
      {threshold: 0.0}
    )

    if (observerRef.current) {
      observer.disconnect() // This removes the previous observer
      observer.observe(observerRef.current)
    }
    return ()=> observer.disconnect()

  }, [hasMore, loading, observerRef.current])

  const setFilterPresentation = async()=>
  {
    const response = await accountsServices.getAccountById(filterAccountId)
    if(response.state) setFilteredAccountName(response.data[0].name)
    if(filterAccountStartPeriod && filterAccountId)
    {
      const responseBalance = await transactionsServices.getAccountBalanceAtStartPeriod(filterAccountId, filterAccountStartPeriod)
      if(responseBalance.state) setFilteredAccountBalance(responseBalance.data[0].balance)
    }
  }
  useEffect(()=>
  {
    getAllTransactions(page)
  }, [page])

  useEffect(()=>
  {
    setFilterPresentation()
  }, [filterAccountId, filterAccountStartPeriod])

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
      <ManageTransactionsForm legend={'إنشاء/تعديل معاملة'} />
      <AdvancedFilterToggle/>
      {filterState && filterAccountId && filterAccountStartPeriod && filterAccountEndPeriod 
      && <SingleCardDataDisplay mt={'0px'} data={{
        'كود الحساب': filterAccountId, 
        'اسم الحساب': filteredAccountName,
        'بداية الفترة' : filterAccountStartPeriod,
        'نهاية الفترة' : filterAccountEndPeriod,
        'رصيد بداية الفترة' : filteredAccountBalance,
        }}/>}
      {filterState && filterAccountId && !filterAccountStartPeriod && !filterAccountEndPeriod 
      && <SingleCardDataDisplay  mt={'0px'} data={{
        'كود الحساب': filterAccountId, 
        'اسم الحساب': filteredAccountName, 
        }}/>}
      <TableView heads={["كود المعاملة", "مدين", "دائن", "كود الحساب", "اسم الحساب", "تعليق", "تاريخ"]} 
      ml={'286px'} pt={'0px'} onClick={onClickEntity}>
        {
          transactions.map(({id, amount, debtorAccount, creditorAccount, comment, date}, index) =>
          {
            const dataHeader = {
              'data-id': id,
              'data-amount': amount.toString(),
              'data-debtor-id': debtorAccount.id,
              'data-creditor-id': creditorAccount.id,
              'data-comment': comment,
              'data-date': date
            }
            return (
              <React.Fragment key={id}>
                <TableEntity key={`${id}-d`} dataHeader={dataHeader}
                              data={[id, `E\u00A3 ${amount}`, "", debtorAccount.id, debtorAccount.name, comment, date]}  
                              customTailwind={'bg-teal-50 hover:bg-teal-100'}/>
                <TableEntity key={`${id}-c`} dataHeader={dataHeader}
                              data={[id, "", `E\u00A3 ${amount}`, creditorAccount.id, creditorAccount.name, comment, date]} 
                              customTailwind={'bg-red-50 hover:bg-red-100'} ref={index===(transactions.length-1)? observerRef : null}/>
              </React.Fragment>
            )
          })
        }      
      </TableView>
      {
          loading
            ? <p>Loading...</p>
            : null
        }
    </>
  )
}

export default DailyTransactionsPage