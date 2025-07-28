import React, { useEffect, useRef } from "react";
import { ManageMachinesForm } from "./ManageMachinesForm.jsx"; 
import TableView from "../../../components/TableView.jsx";
import TableEntity from "../../../components/TableEntity.jsx";

import { useDispatch, useSelector } from "react-redux";
import { setFixedId, setId, setName, setState } from "../reducers/machineForm.js";
import { setMachines } from "../reducers/machines.js";
import Header from "../../../components/Header/Header.jsx";
import { getAllMachines } from "../services/machines.js";
export const MachinesPage = ()=>
{
  const dispatch = useDispatch()

  const bottomRef = useRef(null);

  const machines = useSelector(state => state.machines)
  const formState = useSelector(state => state.machineForm.state)

  const getAllMachines_ = async()=> 
  {
    const machines = await getAllMachines();
    if(machines.state) dispatch(setMachines(machines.data));
  }

  useEffect(()=>
  {
    if(bottomRef.current)
    {
      bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [machines])

  useEffect(()=>
  {
    getAllMachines_()
  }, [])

  const onClickEntity = (e)=>
  {
    const tr = e.target.closest("tr")
    if(!tr) return
    const machineId = tr.getAttribute('data-id');
    const machineName = tr.getAttribute('data-name');
    const machineFixedId = tr.getAttribute('data-fixed-id');
    dispatch(setId(machineId));
    dispatch(setName(machineName));
    dispatch(setFixedId(machineFixedId));
    if(!formState) return;
    dispatch(setState(false));
  }

  return(
    <>
      <div className="sticky top-[0px]">
        <Header/>
        <ManageMachinesForm legend={'إنشاء/تعديل ماكينة'} />
      </div>
      <TableView heads={["كود", "الماكينة"]} onClick={onClickEntity}>
        {
          machines.map(({internalId, body})=> {
            let data = {
              'data-id': body.id,
              'data-name': body.name,
              'data-fixed-id': internalId
            }
            return <TableEntity key={body.id} data={[body.id, body.name]} dataHeader={data} customTailwind={'hover:bg-gray-100'}/>
          })
        }
      </TableView>
      <span ref={bottomRef}></span>
    </>
  )
}