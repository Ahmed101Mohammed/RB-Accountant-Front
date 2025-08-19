import React, { useEffect, useRef } from "react";
import { ManageDailyProductionForm } from "./ManageDailyProductionForm/ManageDailyProductionForm.jsx";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header/Header.jsx";
import { deleteDailyProductionById, getAllDailyProductionRecords, getDailyProductionById } from "../services/dailyProduction.js";
import { removeDailyProduction, setDailyProductions } from "../reducers/dailyProductions.js";
import TableView from "../../../components/TableView.jsx";
import TableEntity from "../../../components/TableEntity.jsx";
import { shiftArabicName } from "../utils/shiftArabicName.js";
import { convert24HourTo12 } from "../utils/convert24HourTo12.js";
import { removeNotification, setErrorNotification, setSuccessNotification } from "../../../reducers/notification.js";
import { reSetDailyProduction, setCreateMode, setDailyProductionForm, setDailyProductionId, setVisibility } from "../reducers/dailyProductionForm.js";
import { Menu, Item, useContextMenu } from "react-contexify";
import 'react-contexify/ReactContexify.css'
import { useConfirm } from "../../../customStates/useConfirm.js";
export const DailyProductionPage = ()=>
{
  const  MENU_ID = 'dailyProductionEntity'
  const { show } = useContextMenu({id: MENU_ID})

  const confirm  = useConfirm();
  
  const dispatch = useDispatch()
  const { createMode, date, shifts, dailyProductionId } = useSelector(state => state.dailyProductionForm);
  
  const bottomRef = useRef(null);

  const dailyProductions = useSelector(state => state.dailyProductions)

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

  const reSetDailyProductionFormStatus = () =>
  {
    dispatch(reSetDailyProduction());
    dispatch(setDailyProductionId(null));
    dispatch(setCreateMode(true));
    dispatch(setVisibility(false));
  }

  const deleteHandler = async () =>
  {
    if(!dailyProductionId) return;

    const deleteConfirm = await confirm(`هل أنت متأكد من حذف هذه اليومية؛ سيؤدي ذلك، إلى حذف جميع الورديات، والتفاصيل المتعلقة بهذه اليومية.`, "نعم، متأكد");
    if(deleteConfirm === false) return;

    const deleteDailyProductionResponse = await deleteDailyProductionById(dailyProductionId);
    if(!deleteDailyProductionResponse.state)
    {
      dispatch(setErrorNotification(deleteDailyProductionResponse.message));
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }

    dispatch(setSuccessNotification("تم حذف يومية الإنتاج بنجاح"));
    setTimeout(()=> dispatch(removeNotification()), 5000);
    
    dispatch(removeDailyProduction(dailyProductionId));
    reSetDailyProductionFormStatus();
  }

  const editHandler = async () =>
  {
    if(!dailyProductionId) return;
    dispatch(setVisibility(true));
    dispatch(setCreateMode(false));
  }

  const copyHandler = async () =>
  {
    dispatch(setVisibility(true));
    dispatch(setCreateMode(true));
  }

  const onRightClickEntity = async(e) =>
  {
    const tr = e.target.closest("tr");
    if(!tr) return;
    show({event: e, props: {key: 'value'}});
    setEntityDataToForm(tr);
  }

  const setEntityDataToForm = async(tr)=>
  {
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
        onContextMenu={onRightClickEntity}
        >
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
      <Menu id={MENU_ID}>
        <Item id="copy" onClick={copyHandler}>نسخ</Item>
        <Item id="edit" onClick={editHandler}>تعديل</Item>
        <Item id="delete" className="bg-red-100" onClick={deleteHandler}>حذف</Item>
      </Menu>
      <span ref={bottomRef}></span>
    </>
  )
}