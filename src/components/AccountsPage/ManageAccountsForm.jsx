import React, { useEffect, useRef } from "react";
import { Input } from "../Input.jsx";
import accountsServices from "../../services/accounts.js";
import { useDispatch, useSelector } from "react-redux";
import { setId, setName, setState } from "../../reducers/accountForm.js";
import { setAccounts, addAccount } from "../../reducers/accounts.js";
import { removeNotification, setErrorNotification } from "../../reducers/notification.js";
import { useConfirm } from '../../customStates/useConfirm.js';

import Form from "../Form.jsx";
const ManageAccountsForm = ({ legend }) => {
  let id = useSelector(state => state.accountForm.id);
  let name = useSelector(state => state.accountForm.name);
  let formState = useSelector(state => state.accountForm.state);
  let confirm = useConfirm();
  const dispatch = useDispatch()

  const firstInputRef = useRef()
  const focusOnFirstInput = ()=> 
  {
    if(!firstInputRef) return;
    setTimeout(()=> firstInputRef.current.focus(), 0)
  }

  useEffect(()=>
  {
    focusOnFirstInput();
  }, [firstInputRef])

  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await accountsServices.createAccount(id, name)
    if(response.state) 
    {
      dispatch(addAccount({id: id, name: name}))
      dispatch(setId(""))
      dispatch(setName(""))
      focusOnFirstInput();
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
    dispatch(setState(true))
    dispatch(setId(""))
    dispatch(setName(""))
    focusOnFirstInput();
  }

  const deleteHandler = async(e)=>
  {
    e.preventDefault();
    const deleteConfirm = await confirm(`هل متأكد من طلبك لحذف الحساب؟`, "نعم، متأكد");
    if(deleteConfirm === false) return;
    const response = await accountsServices.deleteAccount(id)
    if(!response.state)
    {
      const FOREIGN_KEY = "FOREIGN KEY constraint failed";
      let message = response.message === FOREIGN_KEY? "ما زالت هنالك بيانات متعلقة بالموظف. يجب أن تحذف أولا." : response.message;
      dispatch(setErrorNotification(message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(setState(true))
    dispatch(setId(""))
    dispatch(setName(""))
    focusOnFirstInput();
    const getAccountsResponse = await accountsServices.getAllAccounts()
    if(!getAccountsResponse.state) return
    dispatch(setAccounts(getAccountsResponse.data))
  }

  const editHandler = async(e)=>
  {
    e.preventDefault()
    const response = await accountsServices.updateAccount(id, name)
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(setState(true))
    dispatch(setId(""))
    dispatch(setName(""))
    focusOnFirstInput();
    const getAccountsResponse = await accountsServices.getAllAccounts()
    if(!getAccountsResponse.state) return
    dispatch(setAccounts(getAccountsResponse.data))
  }

  const idOnChange = (e)=>
  {
    const value = e.target.value
    dispatch(setId(value))
  }

  const nameOnChange = (e)=>
  {
    const value = e.target.value
    dispatch(setName(value))
  }
  
  return (
    <Form legend={legend} submitHandler={submitHandler}>
      <Input disabled={!formState} name={'id'} label={'الكود'} type={'text'} placeholder={'أدخل كود الحساب مثل: 0000'} inputRef={firstInputRef} onChange={idOnChange} value={id} />
      <Input name={'name'} label={'الإسم'} type={'text'} placeholder={'أدخل إسم الحساب مثل: أحمد'} onChange={nameOnChange} value={name} />
    
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
            <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={deleteHandler}>
              احذف الحساب
            </button>
            <button type="" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={cancelHandler}>
              إلغاء
            </button>
          </>
        }
    </Form>
  );
};

export default ManageAccountsForm;
