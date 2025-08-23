import React from "react"

// TableEntity.jsx
const TableEntity = ({ data, customTailwind, onClick, dataHeader, ref, className }) => {
  return (
    <tr className={`border-b ${customTailwind ? customTailwind : ''} ${className}`} {...dataHeader} ref={ref}>
      {data.map((item, index) => (
        <td key={index} onClick={onClick} className="px-4 py-2 border whitespace-nowrap">
          {item}
        </td>
      ))}
    </tr>
  );
};

export default TableEntity