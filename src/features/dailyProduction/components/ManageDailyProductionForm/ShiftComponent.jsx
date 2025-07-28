import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateTimeOptions } from "../../utils/generateTimeOptions";
import { updateShift, addItem, deleteShift } from "../../reducers/dailyProductionForm";
import { SelectInput } from "./SelectInput.jsx";
import { Clock, Plus, Settings, Trash2 } from "lucide-react";
import { ItemComponent } from "./ItemComponent.jsx";

export const ShiftComponent = ({ shift, shiftIndex }) => {
  const dispatch = useDispatch();
  const items = shift.items;
  const updateShiftField = (field, value) => {
    dispatch(updateShift({ shiftIndex, field, value }));
  };

  const handleDelete = () => {
    dispatch(deleteShift({ shiftIndex }));
  };

  const shiftOptions = [
    { value: 'morning', label: 'صباحي' },
    { value: 'night', label: 'مسائي' },
    { value: 'overtime', label: 'إضافي' }
  ];

  const timeOptions = generateTimeOptions();
  const shouldShowItems = shift.name && shift.startAt !== null && shift.endAt !== null;

  useEffect(() => {
    if (shouldShowItems && items.length === 0) {
      dispatch(addItem({ shiftIndex }));
    }
    let item = items.filter(item => {
      if(item.itemId && item.accountId && item.details.filter(detail => detail.machineId && detail.employeeId && detail.startAt && detail.endAt).length > 0)
      {
        return false;
      }
        return true;
    })

    if(items.length > 0 && item.length === 0)
    {
      dispatch(addItem({shiftIndex}))
    }
  }, [shouldShowItems, items]);

  return (
    <fieldset className="border-2 border-gray-200 rounded-lg p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
      <legend className="flex items-center gap-2 px-3 font-medium text-gray-700">
        <Clock size={16} />
        وردية {shiftIndex + 1}
        <button
          onClick={handleDelete}
          type="button"
          className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
        >
          <Trash2 size={14} />
        </button>
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SelectInput
          value={shift.name}
          onChange={(value) => updateShiftField('name', value)}
          options={shiftOptions}
          label="الوردية"
          icon={Settings}
          placeholder="اختر نوع الوردية"
        />
        <SelectInput
          value={shift.startAt}
          onChange={(value) => updateShiftField('startAt', value)}
          options={timeOptions}
          label="تبدأ"
          icon={Clock}
          placeholder="وقت البداية"
        />
        <SelectInput
          value={shift.endAt}
          onChange={(value) => updateShiftField('endAt', value)}
          options={timeOptions}
          label="تنتهي"
          icon={Clock}
          placeholder="وقت النهاية"
        />
      </div>

      {shouldShowItems && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          {items.map((item, itemIndex) => (
            <ItemComponent
              key={itemIndex}
              item={item}
              itemIndex={itemIndex}
              shiftIndex={shiftIndex}
              shiftStart={shift.startAt}
              shiftEnd={shift.endAt}
            />
          ))}
        </div>
      )}
    </fieldset>
  );
};