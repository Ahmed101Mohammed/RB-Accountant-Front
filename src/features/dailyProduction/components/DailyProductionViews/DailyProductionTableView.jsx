import React from "react";
import TableView from "../../../../components/TableView.jsx";
import TableEntity from "../../../../components/TableEntity.jsx";
import { shiftArabicName } from "../../utils/shiftArabicName.js";
import { convert24HourTo12 } from "../../utils/convert24HourTo12.js";
import { useSelector } from "react-redux";

export const DailyProductionTableView = ()=>
{
  const dailyProductions = useSelector(state => state.dailyProductions)
  return (
    <div className="block">
      <TableView 
        heads={[
          "التاريخ", "الوردية", "تبدأ", "تنتهي", "كود الصنف", 
          "الصنف", "كود العميل", "العميل", "كود الماكنة", "الماكنة", 
          "كود العامل", "العامل", "بدأ", "انتهى", "إنتاج جيد", "إنتاج سيء"
        ]}
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
                        className = 'dailyProductinEntity'
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
    </div>
  )
}