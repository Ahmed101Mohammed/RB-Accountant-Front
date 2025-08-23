import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../../components/Input.jsx"
import { useDispatch, useSelector } from "react-redux";
import { reSetFixedId, reSetId, reSetName, setId, setName, setState } from "../reducers/itemForm.js";
import { setItems, addItem } from "../reducers/items.js";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import { useConfirm } from '../../../customStates/useConfirm.js';
import Form from "../../../components/Form.jsx";
import { createItem, deleteItem, getAllItems, getItemById, getPossibleItems, updateItem } from "../services/items.js";

export const ManageItemsForm = ({ legend, visibale, setVisibility }) => {
  let id = useSelector(state => state.itemForm.id);
  let name = useSelector(state => state.itemForm.name);
  let internalId = useSelector(state => state.itemForm.fixedId)
  let formState = useSelector(state => state.itemForm.state);

  let [likeItemIds, setLikeItemIds] = useState([])
  let confirm = useConfirm();

  const dispatch = useDispatch()

  const firstInputRef = useRef()
  const focusOnFirstInput = ()=> 
  {
    if(!firstInputRef) return;
    setTimeout(()=> firstInputRef.current.focus(), 0)
  }
  useEffect(()=>{focusOnFirstInput()}, [firstInputRef])

  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await createItem(id, name)
    if(response.state === false) 
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 5000)
      return;
    }

    let newItemId = response.data[0].lastInsertRowid;
    const getItemResponse = await getItemById(newItemId);
    if(getItemResponse.state === false)
    {
      dispatch(setErrorNotification(getItemResponse.message));
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }
    dispatch(addItem(getItemResponse.data[0]));
    dispatch(reSetId());
    dispatch(reSetName());
    focusOnFirstInput();
  }

  const cancelHandler = (e)=>
  {
    e.preventDefault()
    dispatch(setState(true))
    dispatch(reSetId());
    dispatch(reSetName());
    dispatch(reSetFixedId())
    focusOnFirstInput();
  }

  const deleteHandler = async(e)=>
  {
    e.preventDefault()
    const deleteConfirm = await confirm('هل متأكد من حذف هذا الصنف؟', 'نعم، متأكد');
    if(deleteConfirm === false) return;
    const response = await deleteItem(internalId);
    if(!response.state)
    {
      const FOREIGN_KEY = "FOREIGN KEY constraint failed";
      let message = response.message === FOREIGN_KEY? "ما زالت هنالك بيانات متعلقة بالصنف. يجب أن تحذف أولا." : response.message;
      dispatch(setErrorNotification(message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(setState(true))
    dispatch(reSetId())
    dispatch(reSetName())
    dispatch(reSetFixedId())
    focusOnFirstInput()
    const getItemsResponse = await getAllItems()
    if(!getItemsResponse.state) return
    dispatch(setItems(getItemsResponse.data))
  }

  const editHandler = async(e)=>
  {
    e.preventDefault()
    const response = await updateItem(internalId, {id, name});
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message));
      setTimeout(()=> dispatch(removeNotification()), 3000);
      return
    }
    dispatch(setState(true))
    dispatch(reSetId())
    dispatch(reSetName())
    focusOnFirstInput();
    const getItemsResponse = await getAllItems()
    if(!getItemsResponse.state) return
    dispatch(setItems(getItemsResponse.data))
  }

  const idOnChange = async(e)=>
  {
    const fromHighToLowIdPrefix = (itemA, itemB) => 
    {
      const itemAParts = itemA.id.split('-');
      const itemBParts = itemB.id.split('-');
      const prefixAInt = Number.parseInt(itemAParts[0]);
      const prefixBInt = Number.parseInt(itemBParts[0]);
      const postfixAInt = Number.parseInt(itemAParts[1]);
      const postfixBInt = Number.parseInt(itemBParts[1]);

      const prefixAStr = itemAParts[0];
      const prefixBStr = itemBParts[0];
      const postfixAStr = itemAParts[1];
      const postfixBStr = itemBParts[1];

      // if pres are integer
      if(Number.isFinite(prefixAInt) && Number.isFinite(prefixBInt))
      {
        if(prefixAInt < prefixBInt) return -1;
        if(prefixBInt < prefixAInt) return 1;

        if(Number.isFinite(postfixAInt) && Number.isFinite(postfixBInt))
        {
          if(postfixAInt < postfixBInt) return -1;
          return 1;
        }
        if(Number.isFinite(postfixAInt)) return -1;
        if(Number.isFinite(postfixBInt)) return 1;

        if(postfixAStr < postfixBStr) return -1;
        return 1;
      }

      // if one pres is integer

      if(Number.isFinite(prefixAInt)) return -1;
      if(Number.isFinite(prefixBInt)) return 1;

      // if pres are not integer
      if(prefixAStr < prefixBStr) return -1;
      if(prefixBStr < prefixAStr) return 1;

      if(Number.isFinite(postfixAInt) && Number.isFinite(postfixBInt))
      {
        if(postfixAInt < postfixBInt) return -1;
        return 1;
      }
      if(Number.isFinite(postfixAInt)) return -1;
      if(Number.isFinite(postfixBInt)) return 1;

      if(postfixAStr < postfixBStr) return -1;
      return 1;
    }

    const value = e.target.value
    if(value === '')
    {
      setLikeItemIds([])
      dispatch(setId(''))
    }
    const itemsIdsResponse = await getPossibleItems(value)
    if(!itemsIdsResponse.state)return;
    const itemsIds = itemsIdsResponse.data.map(item => item.body)
    itemsIds.sort(fromHighToLowIdPrefix)
    itemsIds.reverse();

    setLikeItemIds(itemsIds)
    dispatch(setId(value))
  }

  const nameOnChange = (e)=>
  {
    const value = e.target.value
    dispatch(setName(value))
  }
  
  return (
    <Form legend={legend} submitHandler={submitHandler}>
      <Input 
        name={'id'} label={'الكود'} type={'text'} 
        placeholder={'أدخل كود الصنف مثل: 0000'} onChange={idOnChange} 
        value={id} inputRef={firstInputRef} 
        listValues={likeItemIds} onSelect={(v)=> {
          dispatch(setId(v))
          setLikeItemIds([])
        }}/>
      <Input name={'name'} label={'الإسم'} type={'text'} placeholder={'أدخل إسم الصنف مثل: مسمار 1/2 بوصة'} onChange={nameOnChange} value={name} />
    
      {
        formState
        ? <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            أنشئ الصنف
          </button>
        :
          <>
            <button type="" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={editHandler}>
              عدل الصنف
            </button>
            <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={deleteHandler}>
              احذف الصنف
            </button>
            <button type="" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={cancelHandler}>
              إلغاء
            </button>
          </>
        }
    </Form>
  );
};