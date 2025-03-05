import React, { useEffect } from "react"
import ManageAccountsForm from "./ManageAccountsForm.jsx"
import TableView from "../TableView.jsx"
import TableEntity from "../TableEntity.jsx"
import accountsServices from "../../services/accounts.js"

import { useDispatch, useSelector } from "react-redux"
import { setAccounts, setAccountsFormIdField, setAccountsFormNameField, toggleAccountFormState } from "../../reducers/accounts.js"

const AccountsPage = ()=>
{
  const dispatch = useDispatch()
  const accounts = useSelector(state => state.accounts.accountsData)
  const formState = useSelector(state => state.accounts.accountsForm.state)
  const getAllAccounts = async()=>
  {
    const accounts = await accountsServices.getAllAccounts()

    if(accounts.state) dispatch(setAccounts(accounts.data))
  }

  useEffect(()=>
  {
    getAllAccounts()
  }, [])

  const onClickEntity = (e)=>
  {
    const tr = e.target.closest("tr")
    if(!tr) return
    const userId = tr.getAttribute('data-id')
    const userName = tr.getAttribute('data-name')
    dispatch(setAccountsFormIdField(userId))
    dispatch(setAccountsFormNameField(userName))
    if(!formState) return
    dispatch(toggleAccountFormState())
  }
  return(
    <>
      <ManageAccountsForm legend={'إنشاء/تعديل حساب'} />
      <TableView heads={["كود", "الحساب"]} pt={'86px'} ml={'284px'} onClick={onClickEntity}>
        {
          accounts.map(account => {
            let data = {
              'data-id': account.id,
              'data-name': account.name
            }
            return <TableEntity key={account.id} data={[account.id, account.name]} dataHeader={data} customTailwind={'hover:bg-gray-100'}/>
          })
        }
      </TableView>
    </>
  )
}

export default AccountsPage