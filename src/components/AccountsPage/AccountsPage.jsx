import React, { useEffect } from "react"
import ManageAccountsForm from "./ManageAccountsForm.jsx"
import TableView from "../TableView.jsx"
import TableEntity from "../TableEntity.jsx"
import accountsServices from "../../services/accounts.js"

import { useDispatch, useSelector } from "react-redux"
import { setId, setName, setState } from "../../reducers/accountForm.js"
import { setAccounts } from "../../reducers/accounts.js"
import Header from "../Header/Header.jsx"

const AccountsPage = ()=>
{
  const dispatch = useDispatch()
  const accounts = useSelector(state => state.accounts)
  const formState = useSelector(state => state.accountForm.state)
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
    dispatch(setId(userId))
    dispatch(setName(userName))
    if(!formState) return
    dispatch(setState(false))
  }

  return(
    <>
      <div className="sticky top-[0px] z-10">
        <Header/>
        <ManageAccountsForm legend={'إنشاء/تعديل حساب'} />
      </div>
      <TableView heads={["كود", "الحساب"]} onClick={onClickEntity}>
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