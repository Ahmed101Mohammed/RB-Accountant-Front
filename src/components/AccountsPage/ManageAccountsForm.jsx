import React from "react";
import Input from "../Input.jsx"
import accountsServices from "../../services/accounts.js";
import { useDispatch, useSelector } from "react-redux";
import { addAccount, setAccounts, setAccountsFormIdField, setAccountsFormNameField, toggleAccountFormState } from "../../reducers/accounts.js";
import { removeNotification, setErrorNotification } from "../../reducers/notification.js";
const ManageAccountsForm = ({ legend }) => {
  let idValue = useSelector(state => state.accounts.accountsForm.idField)
  let nameValue = useSelector(state => state.accounts.accountsForm.nameField)
  let formState = useSelector(state => state.accounts.accountsForm.state)
  const dispatch = useDispatch()
  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await accountsServices.createAccount(idValue, nameValue)
    if(response.state) 
    {
      dispatch(addAccount({id: idValue, name: nameValue}))
      dispatch(setAccountsFormIdField(""))
      dispatch(setAccountsFormNameField(""))
      
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
    dispatch(toggleAccountFormState())
    dispatch(setAccountsFormIdField(""))
    dispatch(setAccountsFormNameField(""))
  }

  const removeAccountHandler = async(e)=>
  {
    e.preventDefault()
    const response = await accountsServices.deleteAccount(idValue)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(toggleAccountFormState())
    dispatch(setAccountsFormIdField(""))
    dispatch(setAccountsFormNameField(""))

    const getAccountsResponse = await accountsServices.getAllAccounts()
    if(!getAccountsResponse.state) return
    dispatch(setAccounts(getAccountsResponse.data))
  }

  const editHandler = async(e)=>
  {
    e.preventDefault()
    const response = await accountsServices.updateAccount(idValue, nameValue)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(toggleAccountFormState())
    dispatch(setAccountsFormIdField(""))
    dispatch(setAccountsFormNameField(""))

    const getAccountsResponse = await accountsServices.getAllAccounts()
    if(!getAccountsResponse.state) return
    dispatch(setAccounts(getAccountsResponse.data))
  }

  const idOnChange = (e)=>
  {
    const value = e.target.value
    dispatch(setAccountsFormIdField(value))
  }

  const nameOnChange = (e)=>
  {
    const value = e.target.value
    dispatch(setAccountsFormNameField(value))
  }
  return (
    <div className="fixed left-0 top-[86px] h-[calc(100%-86px)] max-w-1/5 p-4 bg-gray-100 shadow-lg">
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold">{legend}</legend>
        <form className="flex flex-col gap-4 mt-4" onSubmit={submitHandler}>
          <Input disabled={!formState} name={'id'} label={'الكود'} type={'text'} placeholder={'أدخل كود الحساب مثل: 0000'} onChange={idOnChange} value={idValue} />
          <Input name={'name'} label={'الإسم'} type={'text'} placeholder={'أدخل إسم الحساب مثل: أحمد'} onChange={nameOnChange} value={nameValue} />
          {
            formState
            ? <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                أنشئ الحساب
              </button>
            :
              <>
                <button type="" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={editHandler}>
                  عدل الحساب
                </button>
                <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={removeAccountHandler}>
                  احذف الحساب
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

export default ManageAccountsForm;
