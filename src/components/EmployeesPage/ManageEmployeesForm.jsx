import React from "react";
import { Input } from "../Input.jsx"
import { useDispatch, useSelector } from "react-redux";
import { reSetFixedId, reSetId, reSetName, setId, setName, setState } from "../../reducers/employeeForm.js";
import { setEmployees, addEmployee } from "../../reducers/employees.js";
import { removeNotification, setErrorNotification } from "../../reducers/notification.js";
import { useConfirm } from '../../customStates/useConfirm.js'
import { Cancel01Icon } from "hugeicons-react";
import Form from "../Form.jsx";
import { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } from "../../services/employees.js";

export const ManageEmployeesForm = ({ legend, visibale, setVisibility }) => {
  let id = useSelector(state => state.employeeForm.id);
  let name = useSelector(state => state.employeeForm.name);
  let internalId = useSelector(state => state.employeeForm.fixedId)
  let formState = useSelector(state => state.employeeForm.state);

  let confirm = useConfirm();

  const dispatch = useDispatch()

  const submitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await createEmployee(id, name)
    if(response.state === false) 
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 5000)
      return;
    }

    let newEmployeeId = response.data[0].lastInsertRowid;
    const getEmployeeResponse = await getEmployeeById(newEmployeeId);
    if(getEmployeeResponse.state === false)
    {
      dispatch(setErrorNotification(getEmployeeResponse.message));
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }
    dispatch(addEmployee(getEmployeeResponse.data[0]));
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
    const deleteConfirm = await confirm('هل متأكد من حذف هذا الموظف؟', 'نعم، متأكد');
    if(deleteConfirm === false) return;
    const response = await deleteEmployee(internalId)
    if(!response.state)
    {
      const FOREIGN_KEY = "FOREIGN KEY constraint failed";
      let message = response.message === FOREIGN_KEY? "ما زالت هنالك بيانات متعلقة بالموظف. يجب أن تحذف أولا." : response.message;
      dispatch(setErrorNotification(message))
      setTimeout(()=> dispatch(removeNotification()), 3000)
      return
    }
    dispatch(setState(true))
    dispatch(reSetId())
    dispatch(reSetName())

    const getEmployeesResponse = await getAllEmployees()
    if(!getEmployeesResponse.state) return
    dispatch(setEmployees(getEmployeesResponse.data))
  }

  const editHandler = async(e)=>
  {
    e.preventDefault()
    const response = await updateEmployee(internalId, {id, name});
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message));
      setTimeout(()=> dispatch(removeNotification()), 3000);
      return
    }
    dispatch(setState(true))
    dispatch(reSetId())
    dispatch(reSetName())

    const getEmployeesResponse = await getAllEmployees()
    if(!getEmployeesResponse.state) return
    dispatch(setEmployees(getEmployeesResponse.data))
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
      <Input disabled={!formState} name={'id'} label={'الكود'} type={'text'} placeholder={'أدخل كود الموظف مثل: 0000'} onChange={idOnChange} value={id} />
      <Input name={'name'} label={'الإسم'} type={'text'} placeholder={'أدخل إسم الموظف مثل: أحمد'} onChange={nameOnChange} value={name} />
    
      {
        formState
        ? <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            أنشئ الموظف
          </button>
        :
          <>
            <button type="" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={editHandler}>
              عدل الموظف
            </button>
            <button type="" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600" onClick={deleteHandler}>
              احذف الموظف
            </button>
            <button type="" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600" onClick={cancelHandler}>
              إلغاء
            </button>
          </>
        }
    </Form>
  );
};