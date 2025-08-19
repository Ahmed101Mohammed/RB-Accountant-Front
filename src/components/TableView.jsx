import React from "react"

// TableView.jsx
const TableView = ({ title, heads, style,children, onClick, onDoubleClick, onContextMenu }) => {

  return (
    <div className={`overflow-auto w-full`} style={style}>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse" dir="rtl" onClick={onClick} onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}>
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {heads.map((head, index) => (
                  <th key={index} className="px-4 py-2 text-right border">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;
