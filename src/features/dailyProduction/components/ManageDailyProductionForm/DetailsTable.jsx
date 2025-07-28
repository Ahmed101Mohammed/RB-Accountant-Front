import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addDetail } from "../../reducers/dailyProductionForm";
import { DetailRow } from "./DetailRow.jsx";

export const DetailsTable = ({ details = [], shiftIndex, itemIndex, shiftStart, shiftEnd }) => {
  const dispatch = useDispatch();

  const addNewDetail = () => {
    dispatch(addDetail({ shiftIndex, itemIndex }));
  };

  useEffect(() => {
    
    if (details.length === 0) {
      addNewDetail();
    }
    else
    {
      const { machineId, employeeId, startAt, endAt } = details[details.length - 1];
      if(machineId !== '' && employeeId !== '' && startAt && endAt)
      {
        addNewDetail();
      }
    }
  }, [details]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-right border-b font-medium">كود الماكينة</th>
            <th className="p-3 text-right border-b font-medium">كود العامل</th>
            <th className="p-3 text-right border-b font-medium">بداية العمل</th>
            <th className="p-3 text-right border-b font-medium">نهاية العمل</th>
            <th className="p-3 text-right border-b font-medium">عالي الجودة</th>
            <th className="p-3 text-right border-b font-medium">منخفض الجودة</th>
            <th className="p-3 text-center border-b font-medium">حذف</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, detailIndex) => (
            <DetailRow
              key={detailIndex}
              detail={detail}
              detailIndex={detailIndex}
              shiftIndex={shiftIndex}
              itemIndex={itemIndex}
              shiftStart={Number.parseInt(shiftStart)}
              shiftEnd={Number.parseInt(shiftEnd)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};