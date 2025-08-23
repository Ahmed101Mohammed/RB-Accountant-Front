import { convert24HourTo12 } from "../../../utils/convert24HourTo12.js";
import { shiftArabicName } from "../../../utils/shiftArabicName.js";
import { DataTreeItem } from "../../DailyProductionViews/DataTreeItem.jsx";
import React from "react";

const sumHighAndLowQualityQuantitiesForDetails = (details) =>
{
  let highQualityQuantity = 0;
  let lowQualityQuantity = 0;
  for(let detail of details)
  {
    highQualityQuantity += detail.body.highQualityQuantity;
    lowQualityQuantity += detail.body.lowQualityQuantity;
  }
  return {highQualityQuantity, lowQualityQuantity}
}

const sumHighAndLowQualityQuantitiesForProductionItems = (productionItems) => 
{
  let highQualityQuantityCntr = 0;
  let lowQualityQuantityCntr = 0;
  for(let productionItem of productionItems)
  {
    const {highQualityQuantity, lowQualityQuantity} = sumHighAndLowQualityQuantitiesForDetails(productionItem.details)
    highQualityQuantityCntr += highQualityQuantity;
    lowQualityQuantityCntr += lowQualityQuantity;
  }
  return {highQualityQuantity: highQualityQuantityCntr, lowQualityQuantity: lowQualityQuantityCntr}
}

const sumHighAndLowQualityQuantitiesForShifts = (shifts, itemId)=>
{
  let highQualityQuantityCntr = 0;
  let lowQualityQuantityCntr = 0;
  for(let shift of shifts)
  {
    const productionItems = shift.body.productionItems.filter(prd => prd.item.id === itemId);
    const {highQualityQuantity, lowQualityQuantity} = sumHighAndLowQualityQuantitiesForProductionItems(productionItems)
    highQualityQuantityCntr += highQualityQuantity;
    lowQualityQuantityCntr += lowQualityQuantity;
  }
  return {highQualityQuantity:highQualityQuantityCntr , lowQualityQuantity:lowQualityQuantityCntr}
}

export const DailyProductionSearchView = ({dailyProductions, quantities, itemId})=>
{
  return(
    <div className="p-6 bg-gray-100">      
      <div className="space-y-2" dir='rtl'>
        {
          <DataTreeItem key={"00"}
                data={{
                  "مجمل الإنتاج الجيد": quantities.highQualityQuantity,
                  "مجمل الإنتاج السيئ": quantities.lowQualityQuantity
                }}
              ></DataTreeItem>
        }
        {
          dailyProductions.map(dailyProduction => {
            const shifts = dailyProduction.body.shifts;
            const {highQualityQuantity, lowQualityQuantity} = sumHighAndLowQualityQuantitiesForShifts(shifts, itemId)
            return (
              <DataTreeItem key={dailyProduction.id}
                dataId={dailyProduction.id}
                className={'dailyProductinEntity'}
                data={{
                  التاريخ: dailyProduction.body.date,
                  "الإنتاج الجيد": highQualityQuantity,
                  "الإنتاج السيء": lowQualityQuantity,
                }}
              >
                {
                  shifts.map(shift => {
                      const productionItems = shift.body.productionItems.filter(productionItem => productionItem.item.id === itemId)
                      const {highQualityQuantity, lowQualityQuantity} = sumHighAndLowQualityQuantitiesForProductionItems(productionItems);
                    return (
                      <DataTreeItem key={shift.id}
                        data={{
                          الوردية: shiftArabicName(shift.body.name),
                          "بداية الوردية": convert24HourTo12(shift.body.dayDuration.startAt),
                          "نهاية الوردية": convert24HourTo12(shift.body.dayDuration.endAt),
                          "الإنتاج الجيد": highQualityQuantity,
                          "الإنتاج السيء": lowQualityQuantity

                        }}
                      >
                        {productionItems.map(productionItem => {
                          const item = productionItem.item;
                          const account = productionItem.account;
                          const details = productionItem.details;
                          const highAndLowQualityQuantity = sumHighAndLowQualityQuantitiesForDetails(details);
                          return (
                            <DataTreeItem key={shift.id+item.id}
                              data={{
                                "كود الصنف": item.id,
                                "اسم الصنف": item.name,
                                "الإنتاج الجيد": highAndLowQualityQuantity.highQualityQuantity,
                                "الإنتاج السيء": highAndLowQualityQuantity.lowQualityQuantity,
                                "كود العميل": account.id,
                                "اسم العميل": account.name
                              }}
                            >
                              {
                                details.map(detail => {
                                  const machine = detail.head.machine;
                                  const employee = detail.head.employee;
                                  const startAt = detail.body.dayDuration.startAt;
                                  const endAt = detail.body.dayDuration.endAt;
                                  const highQualityQuantity = detail.body.highQualityQuantity;
                                  const lowQualityQuantity = detail.body.lowQualityQuantity;

                                  return (
                                    <DataTreeItem key={shift.id+item.id+machine.id+employee.id}
                                    data={{
                                      "كود الماكنة": machine.id,
                                      "اسم الماكنة": machine.name,
                                      "كود الموظف": employee.id,
                                      "اسم الموظف": employee.name,
                                      "بداية عمل الموظف": convert24HourTo12(startAt),
                                      "نهاية عمل الموظف": convert24HourTo12(endAt),
                                      "الإنتاج الجيد": highQualityQuantity,
                                      "الإنتاج السيء": lowQualityQuantity
                                    }}/>
                                  )
                                })
                              }
                            </DataTreeItem>
                          )
                        })}
                      </DataTreeItem>
                    )
                  })
                }
              </DataTreeItem>
            )
          })
        }
        
      </div>
    </div>
  )
}