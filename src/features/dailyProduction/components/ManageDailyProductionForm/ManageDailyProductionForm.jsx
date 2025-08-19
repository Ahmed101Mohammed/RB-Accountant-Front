import React, {useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowDownDoubleIcon, Cancel01Icon } from "hugeicons-react";
import { setVisibility } from '../../reducers/dailyProductionForm.js';
import { RecordDailyProductionForm } from './RecordDailyProductionForm.jsx';
import { SearchDailyProductionForm } from './SearchDailyProductionForm.jsx';

export const ManageDailyProductionForm = () => {
  const [formType, setFormType] = useState('record')// record | search
  const dispatch = useDispatch();
  const { visibale } = useSelector(state => state.dailyProductionForm);
  

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
        <div className="">
          <nav className='w-full'>
            <button 
              type='button' 
              onClick={()=>setFormType('record')}
              className={`m-1 inline-flex items-center gap-2 px-6 py-3 ${formType === 'record'? 'bg-blue-200' : 'bg-gray-200'} text-black rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-200`}>
                تسجيل يومية
            </button>
            <button 
              type='button' 
              onClick={()=> setFormType('search')}
              className={`m-1 inline-flex items-center gap-2 px-6 py-3 ${formType === 'search'? 'bg-blue-200' : 'bg-gray-200'} text-black rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-200`}>
                إحصائية إنتاج
            </button>
          </nav>
        </div>
        {
          formType === 'record'
          ? <RecordDailyProductionForm/>
          : <SearchDailyProductionForm/>
        }
      </div>
    </div>
  );
};