import React, { useEffect, useRef } from "react";
import { ManageDailyProductionForm } from "./ManageDailyProductionForm/ManageDailyProductionForm.jsx";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header/Header.jsx";
import { getAllDailyProductionRecords } from "../services/dailyProduction.js";
import { setDailyProductions } from "../reducers/dailyProductions.js";
import { DailyProductionViews } from "./DailyProductionViews/DailyProductionViews.jsx";

export const DailyProductionPage = ()=>
{
  const dispatch = useDispatch();
  
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
 

  return(
    <>
      <div className="sticky top-[0px]">
        <Header/>
        <ManageDailyProductionForm/>
      </div>
      <DailyProductionViews/>
      <span ref={bottomRef}></span>
    </>
  )
}