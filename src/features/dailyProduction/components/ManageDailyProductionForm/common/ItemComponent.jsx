import React, { useEffect, useState } from "react";
import { addItem, updateItem, deleteItem } from "../../../reducers/dailyProductionForm.js";
import { useDispatch } from "react-redux";
import { Package, Plus, Trash2, User } from "lucide-react";
import { TextInput } from "./TextInput.jsx";
import { DetailsTable } from "./DetailsTable.jsx";
import accountsServices from "../../../../../services/accounts.js";
import { getPossibleItems } from "../../../../items/services/items.js";

export const ItemComponent = ({ item, itemIndex, shiftIndex, shiftStart, shiftEnd }) => {
  const dispatch = useDispatch();
  const [posibleAccounts, setPosibleAccounts] = useState([]);
  const [posibleItems, setPosibleItems] = useState([]);
  const updateItemField = (field, value) => {
    dispatch(updateItem({ shiftIndex, itemIndex, field, value }));
  };

  const handleDelete = () => {
    dispatch(deleteItem({ shiftIndex, itemIndex }));
  };

  const shouldShowDetails = item.itemId && item.accountId;
  const accountIdOnChange = async(value)=>
  {
    updateItemField('accountId', value)
    const response = await accountsServices.getPossibleUsers(value)
    if(response.state)
    {
      setPosibleAccounts(response.data)
    }
    else
    {
      setPosibleAccounts([])
    }
  }

  const itemIdOnChange = async(value) =>
  {
    updateItemField('itemId', value)
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
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700 flex items-center gap-2">
          <Package size={16} />
          صنف {itemIndex + 1}
        </h4>
        <button
          onClick={handleDelete}
          type="button"
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          value={item.itemId}
          onChange={(value) => itemIdOnChange(value)}
          label="كود الصنف"
          icon={Package}
          placeholder="أدخل كود الصنف"
          listValues={posibleItems}
          onSelect={async(value)=> {
            updateItemField('itemId', value);
            setPosibleItems([]);
          }}
        />
        <TextInput
          value={item.accountId}
          onChange={(value) => accountIdOnChange(value)}
          label="العميل"
          icon={User}
          placeholder="أدخل اسم العميل"
          listValues={posibleAccounts}
          onSelect={async(value)=> {
              updateItemField('accountId', value);
              setPosibleAccounts([]);
            }
          }
        />
        
      </div>

      {shouldShowDetails && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
          <h5 className="font-medium text-gray-700">جدول التفاصيل</h5>
          <DetailsTable
            details={item.details}
            shiftIndex={shiftIndex}
            itemIndex={itemIndex}
            shiftStart={shiftStart}
            shiftEnd={shiftEnd}
          />
        </div>
      )}
    </div>
  );
};