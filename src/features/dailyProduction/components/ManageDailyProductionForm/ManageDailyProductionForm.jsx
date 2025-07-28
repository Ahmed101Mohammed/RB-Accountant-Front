import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Save, Undo2, X} from 'lucide-react';
import { ArrowDownDoubleIcon, Cancel01Icon } from "hugeicons-react";
import { addShift, reSetDailyProduction, setCreateMode, setDailyProductionId, setDate, setVisibility } from '../../reducers/dailyProductionForm.js';
import { DateInput } from './DateInput.jsx';
import { ShiftComponent } from './ShiftComponent.jsx';
import { removeNotification, setErrorNotification, setSuccessNotification } from '../../../../reducers/notification.js';
import { createDailyProductionRecord, deleteDailyProductionById, getDailyProductionById, updateDailyProductionWithId } from '../../services/dailyProduction.js';
import { addDailyProduction, removeDailyProduction } from '../../reducers/dailyProductions.js';
import { useConfirm } from '../../../../customStates/useConfirm.js';

export const ManageDailyProductionForm = () => {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { createMode, date, shifts, visibale, dailyProductionId } = useSelector(state => state.dailyProductionForm);
  const pureData = ()=>
  {
    const pureValideData = {};
    if(!date || shifts.length === 0) return false;
    pureValideData.date = date;
    
    // filter shifts.
    const shiftsWithHeadings = shifts.filter(shift => (shift.name && shift.startAt && shift.endAt && shift.items.length > 0));
    const categrizedShiftsBaseItems = shiftsWithHeadings.map(shift => {
      // filter items
      let shiftCopy = {...shift};
      const items = shiftCopy.items.filter(item => (item.itemId && item.accountId && item.details.length > 0));
      const categrisedItemsBaseDetails = items.map(item =>
      {
        // filter details
        let copyItem = {...item};
        const details = copyItem.details.filter(detail => (detail.machineId && detail.employeeId && detail.startAt && detail.endAt));
        copyItem.details = details;
        if(copyItem.details.length === 0) return null;
        return copyItem;
      }
      );
      const itemsWithFullDetails = categrisedItemsBaseDetails.filter(item => item !== null);
      if(itemsWithFullDetails.length === 0) return null;
      shiftCopy.items = itemsWithFullDetails;
      return shiftCopy;
    });
      
    const shiftsWithFullItems = categrizedShiftsBaseItems.filter(shift => shift !== null);
    if(shiftsWithFullItems.length === 0) return false;
    pureValideData.shifts = shiftsWithFullItems;
    return pureValideData;
  }

  const handleDateChange = (newDate) => {
    dispatch(setDate(newDate));
  };

  const shouldShowShifts = date? true : false;
  useEffect(()=>
  {
    if(shouldShowShifts && shifts.length === 0)
    {
      dispatch(addShift());
    }
  }, [shouldShowShifts, shifts.length])

  const areThereDublicatedItems = (items)=>
  {
    const itemsIds = {};
    for(let item of items)
    {
      if(itemsIds[item.itemId] === 1) return true;
      itemsIds[item.itemId] = 1;
    }
    return false;
  }

  const areThereDublicatedEmployeeWithMachine = (details)=>
  {
    const detailsMap = {};
    for(let detail of details)
    {
      if(detailsMap[detail.employeeId] === detail.machineId) return true;
      detailsMap[detail.employeeId] = detail.machineId;
    }
    return false;
  }

  const shiftArabicName = (value)=>
  {
    let name = value === 'morning'? "الصباحية" : value === 'night'? "المسائية" : "الإضافية";
    return name;
  }

  const areAccurateDailyProductData = (data)=>
  {
    const pureShifts = data.shifts;
    for(let shift of pureShifts)
    {
      if(areThereDublicatedItems(shift.items))
      {
        dispatch(setErrorNotification(`لقد أدخلت أحد الأصناف أكثر من مرة في الوردية ${shiftArabicName(shift.name)}`))
        setTimeout(()=> dispatch(removeNotification()), 5000);
        return false;
      }

      let items = shift.items;
      for(let item of items)
      {
        if(areThereDublicatedEmployeeWithMachine(item.details))
        {
          dispatch(setErrorNotification(`لقد كررت إدخال نفس العامل مع نفس الماكينة, للصنف ${item.itemId} في الوردية ${shiftArabicName(shift.name)}`));
          setTimeout(()=> dispatch(removeNotification()), 5000);
          return false;
        }
      }
    }
    return true;
  }
  const onSubmitHandler = async(event)=>
  {
    console.log(event)
    event.preventDefault();
    const pureValideData = pureData();
    if(!areAccurateDailyProductData(pureValideData)) return;
    const response = await createDailyProductionRecord(pureValideData);
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message))
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }

    const dailyProductionId = response.data[0].dailyProductionId;
    dispatch(setSuccessNotification("تم حفظ يومية الإنتاج بنجاح"));
    setTimeout(()=> dispatch(removeNotification()), 5000);
    dispatch(reSetDailyProduction());
    dispatch(setVisibility(false));

    const getDailyProductionResponse = await getDailyProductionById(dailyProductionId);
    if(getDailyProductionResponse.state)
    {
      dispatch(addDailyProduction(getDailyProductionResponse.data[0]));
    }
  }

  const reSetDailyProductionFormStatus = () =>
  {
    dispatch(reSetDailyProduction());
    dispatch(setDailyProductionId(null));
    dispatch(setCreateMode(true));
    dispatch(setVisibility(false));
  }
  const cancelHandler = (event)=>
  {
    event.preventDefault();
    reSetDailyProductionFormStatus();
  }

  const deleteHandler = async (event) =>
  {
    event.preventDefault();
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

  const updateHandler = async (event) =>
  {
    event.preventDefault();
    if(!dailyProductionId) return;

    const pureValideData = pureData();
    if(!areAccurateDailyProductData(pureValideData)) return;

    const updateDailyProductionResponsne = await updateDailyProductionWithId(dailyProductionId, pureValideData);
    if(!updateDailyProductionResponsne.state)
    {
      dispatch(setErrorNotification(updateDailyProductionResponsne.message))
      setTimeout(()=> dispatch(removeNotification()), 5000);
      return;
    }
    dispatch(removeDailyProduction(dailyProductionId));

    dispatch(setSuccessNotification("تم تعديل يومية الإنتاج بنجاح"));
    setTimeout(()=> dispatch(removeNotification()), 5000);
    
    const getDailyProductionResponse = await getDailyProductionById(dailyProductionId);
    if(getDailyProductionResponse.state)
    {
      dispatch(addDailyProduction(getDailyProductionResponse.data[0]));
    }

    reSetDailyProductionFormStatus();
  }

  if(!visibale){
    return (
      <div dir="rtl" className="w-full">
        <button
          type="button"
          className="bg-blue-500 text-white px-2 py-1 w-full flex justify-center opacity-90 hover:opacity-100 active:opacity-100 transition-opacity"
          onClick={() => dispatch(setVisibility(true))}
        >
          <ArrowDownDoubleIcon size={24}/>
        </button>
      </div>

    )
  }

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-auto" dir='rtl'>
      <div className="min-h-full p-4">
        <div dir="rtl">
        <button type="button" onClick={()=> dispatch(setVisibility(false))}><Cancel01Icon size={24}/></button>
      </div>
        <div className="max-w-[90%] mx-auto">
          <form className="space-y-6" onSubmit={onSubmitHandler}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                الإنتاج اليومي
              </h1>
              
              <DateInput
                value={date}
                onChange={handleDateChange}
                label="التاريخ"
                className="max-w-md mx-auto"
              />
            </div>

            {shouldShowShifts && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                {shifts.map((shift, shiftIndex) => (
                  <ShiftComponent
                    key={shiftIndex}
                    shift={shift}
                    shiftIndex={shiftIndex}
                  />
                ))}
                
                <div className="text-center flex justify-around flex-wrap">
                  <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    onClick={cancelHandler}
                    type='button'
                  >
                    <Undo2 size={16} />
                    إلغاء
                  </button>
                  {
                    !createMode
                    ? (
                        <button
                          type='button'
                          className="inline-flex items-center gap-2 px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                          onClick={deleteHandler}
                        >
                          <X size={16} />
                          حذف يومية الإنتاج
                        </button>
                    )
                    : null
                  }

                  {
                    pureData() && createMode
                    ? <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        <Save size={16} />
                        حفظ يومية الإنتاج
                      </button>
                    : null
                  }
                  {
                    !createMode && pureData()
                    ? <button
                        type="button"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-400 text-white rounded-lg hover:bg-teal-600 transition-colors duration-200"
                        onClick={updateHandler}
                      >
                        <Save size={16} />
                        تعديل يومية الإنتاج
                      </button>
                    : null
                  }

                  {
                    !(shifts.length >= 3)
                    ? <button
                        type="button"
                        onClick={() => dispatch(addShift())}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
                      >
                        <Plus size={16} />
                        إضافة وردية جديدة
                      </button>
                    : null
                  }
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};