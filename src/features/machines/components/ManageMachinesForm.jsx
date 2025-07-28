import React from "react";
import { Input } from "../../../components/Input.jsx"
import { useDispatch, useSelector } from "react-redux";
import { reSetFixedId, reSetId, reSetName, setId, setName, setState } from "../reducers/machineForm.js";
import { setMachines, addMachine } from "../reducers/machines.js";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import { useConfirm } from '../../../customStates/useConfirm.js';
import Form from "../../../components/Form.jsx";
import { createMachine, deleteMachine, getAllMachines, getMachineById, updateMachine } from "../services/machines.js";

export const ManageMachinesForm = ({ legend, visibale, setVisibility }) => {
  let id = useSelector(state => state.machineForm.id);
  let name = useSelector(state => state.machineForm.name);
  let internalId = useSelector(state => state.machineForm.fixedId)
  let formState = useSelector(state => state.machineForm.state);

  let confirm = useConfirm();

  const dispatch = useDispatch()

  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await createMachine(id, name)
    if(response.state === false) 
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 5000)
      return;
    }

    let newMachineId = response.data[0].lastInsertRowid;
    const getMachineResponse = await getMachineById(newMachineId);
    if(getMachineResponse.state === false)
    {
      dispatch(setErrorNotification(getMachineResponse.message));
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }
    dispatch(addMachine(getMachineResponse.data[0]));
    dispatch(reSetId());
    dispatch(reSetName());
  }

  const cancelHandler = (e)=>
  {
    e.preventDefault()
    dispatch(setState(true))
    dispatch(reSetId());
    dispatch(reSetName());
    dispatch(reSetFixedId())
  }

  const deleteHandler = async(e)=>
  {
    e.preventDefault()
    if(!internalId) return;
    const deleteConfirm = await confirm('هل متأكد من حذف هذه الماكنة؟', 'نعم، متأكد');
    if(deleteConfirm === false) return;
    const response = await deleteMachine(internalId);
    if(!response.state)
    {
      const FOREIGN_KEY = "FOREIGN KEY constraint failed";
      let message = response.message === FOREIGN_KEY? "ما زالت هنالك بيانات متعلقة بالماكنة. يجب أن تحذف أولا." : response.message;
      dispatch(setErrorNotification(message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(setState(true))
    dispatch(reSetId())
    dispatch(reSetName())

    const getMachinesResponse = await getAllMachines()
    if(!getMachinesResponse.state) return
    dispatch(setMachines(getMachinesResponse.data))
  }

  const editHandler = async(e)=>
  {
    e.preventDefault()
    const response = await updateMachine(internalId, {id, name});
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message));
      setTimeout(()=> dispatch(removeNotification()), 3000);
      return
    }
    dispatch(setState(true))
    dispatch(reSetId())
    dispatch(reSetName())

    const getMachinesResponse = await getAllMachines()
    if(!getMachinesResponse.state) return
    dispatch(setMachines(getMachinesResponse.data))
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
      <Input disabled={!formState} name={'id'} label={'الكود'} type={'text'} placeholder={'أدخل كود الماكينة مثل: 0000'} onChange={idOnChange} value={id} />
      <Input name={'name'} label={'الإسم'} type={'text'} placeholder={'أدخل إسم الماكينة مثل: shaper1'} onChange={nameOnChange} value={name} />
    
      {
        formState
        ? <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            أنشئ الماكينة
          </button>
        :
          <>
            <button type="" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={editHandler}>
              عدل الماكينة
            </button>
            <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={deleteHandler}>
              احذف الماكينة
            </button>
            <button type="" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={cancelHandler}>
              إلغاء
            </button>
          </>
        }
    </Form>
  );
};