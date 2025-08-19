import React from "react";
import { Cancel01Icon } from "hugeicons-react"
import { useState } from "react"
import { TextInput } from "../../dailyProduction/components/ManageDailyProductionForm/TextInput.jsx";
import { SelectInput } from "../../dailyProduction/components/ManageDailyProductionForm/SelectInput.jsx";

const NumberInput = ({ value, onChange, label, className = '', onFocus }) => (
  <div className={`space-y-2`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type="number"
      min="0"
      value={value}
      onFocus={onFocus}
      dir="rtl"
      onChange={(e) => onChange(parseInt(e.target.value))}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`}
    />
  </div>
);

export const Calculator = ()=>
{
  const [visibility, setVisibility] = useState(true);
  const [rawMaterial, setRawMaterial] = useState('');
  const [materialShape, setMaterialShape] = useState('');
  const [rawMaterialPrice, setRawMaterialPrice] = useState(0);
  const [rawMaterialReciclingPrice, setRawMaterialReciclingPrice] = useState(0);
  const [outDiameter, setOutDiameter] = useState(0);
  const [innerDiameter, setInnerDiameter] = useState(0);
  const [itemLength, setItemLength] = useState(0);
  const [itemNetWeight, setItemNetWeight]  =  useState(0);
  const [itemAproxProductionTime, setItemAproxProductionTime] = useState(0)
  const [productionHourCost, setProductionHourCost] = useState(0)

  const [rawMaterialCost, setRawMaterialCost] = useState(0);
  const [productionProcessCost, setProductionProcessCost] = useState(0);
  const [itemTotalCost, setItemTotalCost] = useState(0); 

  const submitHundler = ()=>
  {
    if(!(rawMaterial && materialShape && rawMaterialReciclingPrice 
      && rawMaterialPrice && outDiameter && innerDiameter 
      && itemLength && itemNetWeight && itemAproxProductionTime && productionHourCost)) return;
    setProductionProcessCost((productionHourCost/(60*60))*itemAproxProductionTime);
  }
  
  const rawMaterialOptions = [{label: "حديد", value: 8}, {label: "ستانلس", value: 8}, {label: "نحاس", value: 8.5}]
  const shapeOptions = [{label: "مدور", value: 3.464}, {label: "مسدس", value: 0.79}]
  return  <div className="w-[100%] p-2 bg-gray-100 border border-gray-600" >
            <div dir="rtl">
              <button onClick={()=> setVisibility(false)}><Cancel01Icon size={24}/></button>
            </div>
            <fieldset className="border border-gray-300 p-1 rounded-lg">
              <legend className="text-lg font-semibold rounded-lg">حاسبة تسعير وحدة صنف</legend>
              <form className="flex flex-col gap-1" onSubmit={submitHundler}>
                <fieldset className={`grid grid-cols-5 gap-2`} dir="rtl">
                  <SelectInput label={"نوع الخامة"} options={rawMaterialOptions} value={rawMaterial}  onChange={(value)=> setRawMaterial(value)}/>
                  <SelectInput label={"شكل الخامة"} options={shapeOptions} value={materialShape} onChange={(value)=> setMaterialShape(value)}/>
                  <NumberInput label="سعر كيلو الخامة" value={rawMaterialPrice} onChange={(value)=> setRawMaterialPrice(value)}/>
                  <NumberInput label="سعر كيلو إعادة تشغيل الخامة" value={rawMaterialReciclingPrice} onChange={(value)=> setRawMaterialReciclingPrice(value)} />
                  <NumberInput label="القطر الخارجي للصنف" value={outDiameter} onChange={(value)=> setOutDiameter(value)} />
                  <NumberInput label="القطر الداخلي للصنف" value={innerDiameter} onChange={(value)=> setInnerDiameter(value)} />
                  <NumberInput label="طول العينة" value={itemLength} onChange={(value)=> setItemLength(value)} />
                  <NumberInput label="الوزن الصافي للعينة" value={itemNetWeight} onChange={(value)=> setItemNetWeight(value)} />
                  <NumberInput label="الزمن المقدر لإنتاج الصنف (ثانية)" value={itemAproxProductionTime} onChange={(value)=> setItemAproxProductionTime(value)} />
                  <NumberInput label="تكلفة ساعة التشغيل" value={productionHourCost} onChange={(value)=> setProductionHourCost(value)} />
                </fieldset>

                <fieldset className={`grid gap-2 mt-8`}>
                  <button
                    className="px-6 py-3 text-center bg-gray-400 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                    type='submit'
                  >
                    سعر
                  </button>
                </fieldset>

              </form>
            </fieldset>
          </div>
}