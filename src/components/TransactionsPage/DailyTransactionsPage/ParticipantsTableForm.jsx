import React, { useState } from "react";
import InputNoLabel from "../../InputNoLabel.jsx";
import SelectNoLabel from "../../SelectNoLabel.jsx";
import { PlusSignCircleIcon } from "hugeicons-react";
import { Delete01Icon } from "hugeicons-react";
import accountsServices from "../../../services/accounts.js";
import { useDispatch, useSelector } from "react-redux";
import { setParticipants } from "../../../reducers/transactionForm.js";
const ParticipantsTableForm = () => {
  const dispatch = useDispatch();
  const participants = useSelector((state) => state.transactionForm.participants);

  const [idRowIndex, setIdRowIndex] = useState(-1)
  const addRow = (e) => {
    e.preventDefault();
    dispatch(setParticipants([...participants, { amount: "", id: "", role: "0" }]));
  };

  const deleteRow = (e, index) =>
  {
    e.preventDefault();
    const filteredRows = participants.filter((row, index_) => index !== index_);
    dispatch(setParticipants(filteredRows));
  }

  const clickHandler = (e)=>
  {
    e.preventDefault()
    const target = e.target;
    const inputId = target.closest('#account-id-input')
    if(!inputId)
    {
      setIdRowIndex(-1)
    }
  }

  
  const [posibleAccounts, setPosibleAccounts] = useState([])
  const accountIdOnChange = async(index, fieldName, e)=>
  {
    setIdRowIndex(index)
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
    let copyState = participants.map(participant => { return {...participant} });
    copyState[index][fieldName] = value;
    dispatch(setParticipants(copyState));
  }

  return (
    <div className="col-span-2">
      <div className="overflow-x-auto max-h-[150px]" dir="ltr">
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
            {participants.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">
                  <InputNoLabel
                    type="number"
                    name={`amount-${index}`}
                    onChange={(e) => handleChange(index, "amount", e.target.value)}
                    placeholder="أدخل المبلغ"
                    step={'.01'}
                    value={participants[index].amount}   
                  />
                </td>
                <td id="account-id" className="border border-gray-300 p-2">
                  <InputNoLabel
                    id="account-id-input"
                    type="text"
                    name={`id-${index}`}
                    onChange={(e)=>accountIdOnChange(index, 'id', e)}
                    value={participants[index].id}
                    placeholder="أدخل كود الحساب"
                    listValues={idRowIndex === index ? posibleAccounts : []}
                    onSelect={async(value)=> {
                        handleChange(index, 'id', value)
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
                    value={participants[index].role} 
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