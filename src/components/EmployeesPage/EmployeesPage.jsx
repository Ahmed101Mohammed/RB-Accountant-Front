import React, { useEffect } from "react"
import { ManageEmployeesForm } from "./ManageEmployeesForm.jsx"
import TableView from "../TableView.jsx"
import TableEntity from "../TableEntity.jsx"

import { useDispatch, useSelector } from "react-redux"
import { setFixedId, setId, setName, setState } from "../../reducers/employeeForm.js"
import { setEmployees } from "../../reducers/employees.js"
import Header from "../Header/Header.jsx"
import { getAllEmployees } from "../../services/employees.js"

const EmployeesPage = ()=>
{
  const dispatch = useDispatch()

  const employees = useSelector(state => state.employees)
  const formState = useSelector(state => state.employeeForm.state)

  const getAllEmployees_ = async()=> 
  {
    const employees = await getAllEmployees();
    if(employees.state) dispatch(setEmployees(employees.data));
  }

  useEffect(()=>
  {
    getAllEmployees_()
  }, [])

  const onClickEntity = (e)=>
  {
    const tr = e.target.closest("tr")
    if(!tr) return
    const employeeId = tr.getAttribute('data-id');
    const employeeName = tr.getAttribute('data-name');
    const employeeFixedId = tr.getAttribute('data-fixed-id');
    dispatch(setId(employeeId));
    dispatch(setName(employeeName));
    dispatch(setFixedId(employeeFixedId));
    if(!formState) return;
    dispatch(setState(false));
  }

  return(
    <>
      <div className="sticky top-[0px]">
        <Header/>
        <ManageEmployeesForm legend={'إنشاء/تعديل موظف'} />
      </div>
      <TableView heads={["كود", "الموظف"]} onClick={onClickEntity}>
        {
          employees.map(({internalId, body})=> {
            let data = {
              'data-id': body.id,
              'data-name': body.name,
              'data-fixed-id': internalId
            }
            return <TableEntity key={body.id} data={[body.id, body.name]} dataHeader={data} customTailwind={'hover:bg-gray-100'}/>
          })
        }
      </TableView>
    </>
  )
}

export default EmployeesPage