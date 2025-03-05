import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { setTransactionsFormAmountField, settransactionsFormCommentField, settransactionsFormCreditorIdField, settransactionsFormDateField, settransactionsFormDebtorIdField, setTransactionsFormTransactionId, toggleTransactionsFormState } from "../reducers/transactions";

// TableEntity.jsx
const TableEntity = ({ data, customTailwind, onClick, dataHeader, ref }) => {
  return (
    <tr className={`border-b ${customTailwind}`} {...dataHeader} ref={ref}>
      {data.map((item, index) => (
        <td key={index} onClick={onClick} className="px-4 py-2 border">
          {item}
        </td>
      ))}
    </tr>
  );
};

export default TableEntity