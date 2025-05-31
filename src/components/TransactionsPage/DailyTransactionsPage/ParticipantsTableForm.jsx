import React, { useState } from "react";
import InputNoLabel from "../../InputNoLabel.jsx";
import SelectNoLabel from "../../SelectNoLabel.jsx";
import { PlusSignCircleIcon } from "hugeicons-react";
import { Delete01Icon } from "hugeicons-react";
import accountsServices from "../../../services/accounts.js";
const ParticipantsTableForm = () => {
  const [rows, setRows] = useState([
    { amount: "", code: "", role: "" },
    { amount: "", code: "", role: "" },
  ]);
  const [codeRowIndex, setCodeRowIndex] = useState(-1)
  const addRow = (e) => {
    e.preventDefault()
    setRows([...rows, { amount: "", code: "", role: "" }]);
  };

  const deleteRow = (e, index) =>
  {
    e.preventDefault()
    const filteredRows = rows.filter((row, index_) => index !== index_)
    setRows(filteredRows)
  }
  const clickHandler = (e)=>
  {
    e.preventDefault()
    const target = e.target;
    const inputCode = target.closest('#account-code-input')
    if(!inputCode)
    {
      setCodeRowIndex(-1)
    }
  }

  
  const [posibleAccounts, setPosibleAccounts] = useState([])
  const accountIdOnChange = async(index, fieldName, e)=>
  {
    setCodeRowIndex(index)
    handleChange(index, fieldName, e.target.value)
    const response = await accountsServices.getPossibleUsers(e.target.value)
    if(response.state)
    {
      setPosibleAccounts(response.data)
    }
    else
    {
      setPosibleAccounts([])
    }
  }

  const handleChange = (index, fieldName, value)=>
  {
    let copyState = [...rows];
    copyState[index][fieldName] = value
    setRows(copyState)
  }

  return (
    <div className="col-span-2">
      <div className="overflow-x-auto max-h-[250px]" dir="ltr">
        <table onClick={clickHandler} className="w-full border-collapse border border-gray-300 bg-gray-50" dir="rtl">
          <thead className="sticky top-0 z-20 bg-gray-300">
            <tr>
              <th className="border border-gray-300 p-2">المبلغ</th>
              <th className="border border-gray-300 p-2">كود الحساب</th>
              <th className="border border-gray-300 p-2">دور الحساب</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <InputNoLabel
                    type="number"
                    name={`amount-${index}`}
                    onChange={(e) => handleChange(index, "amount", e.target.value)}
                    placeholder="أدخل المبلغ"
                    step={'.01'}
                    value={rows[index].amount}   
                  />
                </td>
                <td id="account-code" className="border border-gray-300 p-2">
                  <InputNoLabel
                    id="account-code-input"
                    type="text"
                    name={`code-${index}`}
                    onChange={(e)=>accountIdOnChange(index, 'code', e)}
                    value={rows[index].code}
                    placeholder="أدخل كود الحساب"
                    listValues={codeRowIndex === index ? posibleAccounts : []}
                    onSelect={async(value)=> {
                        handleChange(index, 'code', value)
                        setPosibleAccounts([])
                      }
                    }
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <SelectNoLabel
                    name={`role-${index}`}
                    options={[
                      { name: "مدين", value: "0" },
                      { name: "دائن", value: "1" },
                    ]}
                    value={rows[index].role} 
                    onChange={(e) => handleChange(index, "role", e.target.value)}
                  />
                </td>
                <td className="border border-gray-300 p-2" style={{display: "flex", justifyContent: "center"}}>
                    <button onClick={(e)=> deleteRow(e, index)}>
                      <Delete01Icon size={24}/>
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <button
        onClick={addRow}
        className="mt-2 bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
      >
        <PlusSignCircleIcon size={24}/>
      </button>
    </div>
  );
};

export default ParticipantsTableForm;