import React, { useEffect, useRef, useState } from "react"
import { getPossibleItems } from "../../../items/services/items.js";
import { Search } from "lucide-react";
import { TextInput } from "./TextInput.jsx";
import { DateInput } from "./DateInput.jsx";
import { getItemProductionQuantitiesTotalForAPeriod, getItemStartAndEndProductionsDate } from "../../services/dailyProduction.js";
import { useDispatch } from "react-redux";
import { removeNotification, setErrorNotification } from "../../../../reducers/notification.js";

export const SearchDailyProductionForm = ()=>
{
  const [itemId, setItemId] = useState('');
  const [startPeriod, setStartPeriod] = useState('');
  const [endPeriod, setEndPeriod] = useState('')
  const [posibleItems, setPosibleItems] = useState([]);
  const [quantities, setQuantities] = useState({})

  const dispatch = useDispatch()
  
  const autoPeriodSetting = async(value)=>
  {
    setStartPeriod('');
    setEndPeriod('');
    const getStartAndEndPeriodResponse = await getItemStartAndEndProductionsDate(value);
    if(getStartAndEndPeriodResponse.state)
    {
      const {startPeriod, endPeriod} = getStartAndEndPeriodResponse.data[0]
      if(!(startPeriod && endPeriod)) return;
      setStartPeriod(startPeriod);
      setEndPeriod(endPeriod);
    }
  }

  const firstInputRef = useRef()
  const focusOnFirstInput = ()=> 
  {
    if(!firstInputRef) return;
    setTimeout(()=> firstInputRef.current.focus(), 0)
  }
  useEffect(()=>{focusOnFirstInput()}, [firstInputRef])

  const itemIdOnChange = async(value) =>
  {
    setItemId(value)
    setQuantities({});
    const response = await getPossibleItems(value)
    if(response.state)
    {
      const items = response.data.map(item => item.body);
      setPosibleItems(items)
    }
    else
    {
      setPosibleItems([])
    }
    await autoPeriodSetting(value);
  }

  const onSubmitHandler = async(e)=>
  {
    e.preventDefault()
    const response = await getItemProductionQuantitiesTotalForAPeriod(itemId, startPeriod, endPeriod);
    if(!response.state)
    {
      dispatch(setErrorNotification(response.message));
      setTimeout(()=> dispatch(removeNotification()), 5000)
      return;
    }

    const {highQualityQuantity, lowQualityQuantity} = response.data[0];
    setQuantities({highQualityQuantity, lowQualityQuantity})
    focusOnFirstInput()
  }
  return (
    <div className="max-w-[90%] mx-auto">
          <form className="space-y-6" onSubmit={onSubmitHandler}>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                إحصائية صنف خلال فترة
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <TextInput
                inputRef={firstInputRef}
                value={itemId}
                onChange={(value) => itemIdOnChange(value)}
                placeholder="كود الصنف"
                label={'كود الصنف'}
                listValues={posibleItems}
                onSelect={async(value)=> {
                    setItemId(value);
                    setPosibleItems([]);
                    await autoPeriodSetting(value);
                  }
                }
                onFocus={()=> setPosibleItems([])}
                className=""
              />

              <DateInput
                value={startPeriod}
                disabled={!(itemId.length > 0)}
                onChange={(value)=> {
                  setStartPeriod(value)
                  setQuantities({})
                }}
                label="بداية فترة الإنتاج"
                className=""
              />

              <DateInput
                value={endPeriod}
                disabled={!(itemId.length > 0)}
                onChange={(value) => {
                  setEndPeriod(value)
                  setQuantities({})
                }}
                label="نهاية فترة الإنتاج"
                className=""
              />
            </div>
            <div>
              <button
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    type='submit'
                  >
                    <Search size={16} />
                    بحث
                  </button>
            </div>
            {
              quantities.highQualityQuantity !== undefined && quantities.lowQualityQuantity !== undefined
              ? (
                <div className="flex gap-4">
                  <div className="high flex-1 bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
                    <p className="text-xl font-bold text-gray-800 mb-1">
                      الإنتاج عالي الجودة
                    </p>
                    <p className="text-2xl font-extrabold text-green-600">
                      {quantities.highQualityQuantity}
                    </p>
                  </div>
                  <div className="low flex-1 bg-white border-l-4 border-red-500 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
                    <p className="text-xl font-bold text-gray-800 mb-1">
                      الإنتاج ضعيف الجودة
                    </p>
                    <p className="text-2xl font-extrabold text-red-600">
                      {quantities.lowQualityQuantity}
                    </p>
                  </div>
                </div>
              )
              : null
            }
          </form>
        </div>
  )
}