import React, { useState } from "react"
import { DailyProductionTableView } from "./DailyProductionTableView.jsx";
import { DailyProductionTreesView } from "./DailyProductionTreesView.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Item, useContextMenu } from "react-contexify";
import { deleteDailyProductionById, getDailyProductionById } from "../../services/dailyProduction.js";
import { removeDailyProduction } from "../../reducers/dailyProductions.js";
import { removeNotification, setErrorNotification, setSuccessNotification } from "../../../../reducers/notification.js";
import { reSetDailyProduction, setCreateMode, setDailyProductionForm, setDailyProductionId, setVisibility } from "../../reducers/dailyProductionForm.js";
import 'react-contexify/ReactContexify.css'
import { useConfirm } from "../../../../customStates/useConfirm.js";

export const DailyProductionViews = ()=>
{
  const confirm  = useConfirm();
  const  MENU_ID = 'dailyProductionEntity'
  const { show } = useContextMenu({id: MENU_ID})
  const { dailyProductionId } = useSelector(state => state.dailyProductionForm);

  const dispatch = useDispatch();

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

  const setEntityDataToForm = async(dailyProductionEntity)=>
  {
    const dailyProductionId = dailyProductionEntity.getAttribute('data-id');
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
  
  const onRightClickEntity = async(e) =>
  {
    const dailyProductionEntity = e.target.closest(".dailyProductinEntity");
    if(!dailyProductionEntity) return;
    show({event: e, props: {key: 'value'}});
    setEntityDataToForm(dailyProductionEntity);
  }

  const { visibale } = useSelector(state => state.dailyProductionForm);
  const [viewType, setViewType] = useState('table') // table | trees
  if(visibale) return;
  return (
    <div className="grid grid-rows-[auto, 1fr] h-[calc(100dvh-98px)] bg-gray-50 overflow-auto" dir="rtl">
        <div className="">
          <nav className='w-full'>
            <button 
              type='button' 
              onClick={()=>setViewType('table')}
              className={`m-1 inline-flex items-center gap-2 px-6 py-3 ${viewType === 'table'? 'bg-blue-200' : 'bg-gray-200'} text-black rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-200`}>
                عرض جدولي
            </button>
            <button 
              type='button' 
              onClick={()=> setViewType('trees')}
              className={`m-1 inline-flex items-center gap-2 px-6 py-3 ${viewType === 'trees'? 'bg-blue-200' : 'bg-gray-200'} text-black rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-200`}>
                عرض شجري
            </button>
          </nav>
        </div>
        <div className="overflow-auto" onContextMenu={onRightClickEntity}>
          {
            viewType === 'table'
            ? <DailyProductionTableView/>
            : <DailyProductionTreesView/>
          }
        </div>
        <Menu id={MENU_ID}>
          <Item id="copy" onClick={copyHandler}>نسخ</Item>
          <Item id="edit" onClick={editHandler}>تعديل</Item>
          <Item id="delete" className="bg-red-100" onClick={deleteHandler}>حذف</Item>
      </Menu>
    </div>

  )
}