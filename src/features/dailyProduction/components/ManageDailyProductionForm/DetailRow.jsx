import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteDetail, updateDetail } from "../../reducers/dailyProductionForm";
import { generateTimeOptions } from "../../utils/generateTimeOptions";
import { TextInput } from "./TextInput.jsx";
import { SelectInput } from "./SelectInput.jsx";
import { NumberInput } from "./NumberInput.jsx";
import { Trash2 } from "lucide-react";
import { getPossibleMachines } from "../../../machines/services/machines.js";
import { getPossibleEmployees } from "../../../../services/employees.js";

export // Detail Row Component
const DetailRow = ({ detail, detailIndex, shiftIndex, itemIndex, shiftStart, shiftEnd }) => {
  const dispatch = useDispatch();
  const [posibleMachines, setPosibleMachines] = useState([]);
  const [posibleEmployees, setPosibleEmployees] = useState([]);

  const updateDetailField = (field, value) => {
    dispatch(updateDetail({ shiftIndex, itemIndex, detailIndex, field, value }));
  };

  useEffect(()=>
  {
    updateDetailField('startAt', shiftStart.toString());
    updateDetailField('endAt', shiftEnd.toString());
  }, [])

  const machineIdOnChange = async(value)=>
  {
    updateDetailField('machineId', value)
    const response = await getPossibleMachines(value);
    if(response.state)
    {
      const items = response.data.map(item => item.body);
      setPosibleMachines(items)
    }
    else
    {
      setPosibleMachines([])
    }
  }

  const employeeIdOnChange = async(value)=>
  {
    updateDetailField('employeeId', value)
    const response = await getPossibleEmployees(value);
    if(response.state)
    {
      const items = response.data.map(item => item.body);
      setPosibleEmployees(items)
    }
    else
    {
      setPosibleEmployees([])
    }
  }

  const handleDelete = () => {
    dispatch(deleteDetail({ shiftIndex, itemIndex, detailIndex }));
  };

  const emptyPosibleties = ()=>
  {
    setPosibleEmployees([]);
    setPosibleMachines([]);
  }
  const timeOptions = generateTimeOptions(shiftStart, shiftEnd);
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="p-2 border-b">
        <TextInput
          value={detail.machineId}
          onChange={(value) => machineIdOnChange(value)}
          placeholder="كود الماكينة"
          listValues={posibleMachines}
          onSelect={async(value)=> {
              updateDetailField('machineId', value);
              setPosibleMachines([]);
            }
          }
          onFocus={()=> setPosibleEmployees([])}
        />
      </td>
      <td className="p-2 border-b">
        <TextInput
          value={detail.employeeId}
          onChange={(value) => employeeIdOnChange(value)}
          placeholder="كود العامل"
          listValues={posibleEmployees}
          onSelect={async(value)=> {
              updateDetailField('employeeId', value);
              setPosibleEmployees([]);
            }
          }
          onFocus={()=> setPosibleMachines([])}
        />
      </td>
      <td className="p-2 border-b">
        <SelectInput
          value={detail.startAt}
          onChange={(value) => updateDetailField('startAt', value)}
          options={timeOptions}
          placeholder="وقت البداية"
          onFocus={emptyPosibleties}          
        />
      </td>
      <td className="p-2 border-b">
        <SelectInput
          value={detail.endAt}
          onChange={(value) => updateDetailField('endAt', value)}
          options={timeOptions}
          placeholder="وقت النهاية"
          onFocus={emptyPosibleties}
        />
      </td>
      <td className="p-2 border-b">
        <NumberInput
          value={detail.highQualityQuantity}
          onChange={(value) => updateDetailField('highQualityQuantity', value)}
          onFocus={emptyPosibleties}
        />
      </td>
      <td className="p-2 border-b">
        <NumberInput
          value={detail.lowQualityQuantity}
          onChange={(value) => updateDetailField('lowQualityQuantity', value)}
          onFocus={emptyPosibleties}
        />
      </td>
      <td className="p-2 border-b text-center">
        <button
          type="button"
          onClick={handleDelete}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );
};
