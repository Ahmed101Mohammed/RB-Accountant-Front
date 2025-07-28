import React, { useEffect, useRef } from "react";
import { ManageDailyProductionForm } from "./ManageDailyProductionForm/ManageDailyProductionForm.jsx";

import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header/Header.jsx";
import { getAllDailyProductionRecords, getDailyProductionById } from "../services/dailyProduction.js";
import { setDailyProductions } from "../reducers/dailyProductions.js";
import TableView from "../../../components/TableView.jsx";
import TableEntity from "../../../components/TableEntity.jsx";
import { Table2 } from "lucide-react";
import { shiftArabicName } from "../utils/shiftArabicName.js";
import { convert24HourTo12 } from "../utils/convert24HourTo12.js";
import { removeNotification, setErrorNotification } from "../../../reducers/notification.js";
import { setCreateMode, setDailyProductionForm, setDailyProductionId, setVisibility } from "../reducers/dailyProductionForm.js";
export const DailyProductionPage = ()=>
{
  const dispatch = useDispatch()

  const bottomRef = useRef(null);

  const dailyProductions = useSelector(state => state.dailyProductions)
  // const formState = useSelector(state => state.itemForm.state)

  const getAllDailyProduction_ = async()=> 
  {
    const dailyProductions = await getAllDailyProductionRecords();
    if(dailyProductions.state) dispatch(setDailyProductions(dailyProductions.data));
  }

  useEffect(()=>
  {
    if(bottomRef.current)
    {
      bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [dailyProductions])

  useEffect(()=>
  {
    getAllDailyProduction_()
  }, [])

  const onDoubleClickEntity = async(e)=>
  {
    const tr = e.target.closest("tr");
    if(!tr) return;
    const dailyProductionId = tr.getAttribute('data-id');
    if(!dailyProductionId) return;
    const getDailyProdcutionResponse = await getDailyProductionById(dailyProductionId);
    if(!getDailyProdcutionResponse.state)
    {
      dispatch(setErrorNotification(getDailyProdcutionResponse.error));
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }
    const dailyProduction = getDailyProdcutionResponse.data[0];
    const newState = { 
      date: dailyProduction.body.date, 
      shifts: dailyProduction.body.shifts.map(({body}) => {
        return {
          name: body.name,
          startAt: body.dayDuration.startAt.toString(),
          endAt: body.dayDuration.endAt.toString(),
          items: body.productionItems.map(item => {
            return {
              itemId: item.item.id,
              accountId: item.account.id,
              details: item.details.map(({head, body}) =>
              {
                return {
                  machineId: head.machine.id,
                  employeeId: head.employee.id,
                  startAt: body.dayDuration.startAt.toString(),
                  endAt: body.dayDuration.endAt.toString(),
                  highQualityQuantity: body.highQualityQuantity,
                  lowQualityQuantity: body.lowQualityQuantity
                }
              }
              )
            }
          })
        }
      })
    }

    dispatch(setDailyProductionForm(newState));
    dispatch(setDailyProductionId(dailyProductionId));
    dispatch(setCreateMode(false));
    dispatch(setVisibility(true));
  }

  return(
    <>
      <div className="sticky top-[0px]">
        <Header/>
        <ManageDailyProductionForm/>
      </div>
      <TableView 
        heads={[
          "التاريخ", "الوردية", "تبدأ", "تنتهي", "كود الصنف", 
          "الصنف", "كود العميل", "العميل", "كود الماكنة", "الماكنة", 
          "كود العامل", "العامل", "بدأ", "انتهى", "إنتاج جيد", "إنتاج سيء"
        ]} 
        onDoubleClick={onDoubleClickEntity}>
        {
          dailyProductions.map(({id, body})=> {
            const dailyProductionId = id;
            const { date } = body;
            return <React.Fragment key={id}>
            {
              body.shifts.map(({id, body}) =>
              {
                const shiftId = id;
                const { name: shiftName } = body;
                const { startAt: shiftStartAt, endAt: shiftEndAt } = body.dayDuration;
                
                
                return body.productionItems.map(({item, account, details}) =>
                {
                  const itemId = item.id;
                  const itemName = item.name;
                  
                  const accountId = account.id;
                  const accountName = account.name;
                  
                    
                  return details.map(({head, body})=>
                  {
                    const { machine, employee } = head;
                    const { id: machineId, name: machineName } = machine;
                    const {id: employeeId, name: employeeName} = employee;

                    const { highQualityQuantity } = body;
                    const { lowQualityQuantity } = body;
                    const { startAt, endAt } = body.dayDuration;

                    let data = {
                      'data-id': dailyProductionId,
                    }
                    return <TableEntity 
                        key={machineId+employeeId+itemId+shiftId+dailyProductionId}
                        data={[
                          date, shiftArabicName(shiftName), convert24HourTo12(shiftStartAt), convert24HourTo12(shiftEndAt), itemId, 
                          itemName, accountId, accountName, machineId, machineName, 
                          employeeId, employeeName, convert24HourTo12(startAt), convert24HourTo12(endAt), highQualityQuantity, lowQualityQuantity
                        ]}  
                        dataHeader={data}
                      />
                  })
                  
  
                })
                

              })
            }
            </React.Fragment>
          })
        }
      </TableView>
      <span ref={bottomRef}></span>
    </>
  )
}