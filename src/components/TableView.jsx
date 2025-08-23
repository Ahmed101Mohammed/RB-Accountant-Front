import React from "react"

// TableView.jsx
const TableView = ({ title, heads, style,children, onClick, onDoubleClick, onContextMenu }) => {
  //h-[calc(100dvh - 98px)]
  return (
    <div className={`w-full`} style={style}>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="bg-white">
          <table className="w-full border-collapse" dir="rtl" onClick={onClick} onDoubleClick={onDoubleClick}>
            <thead className="sticky" style={{top: "-1px"}}>
              <tr className="bg-gray-200 text-gray-700">
                {heads.map((head, index) => (
                  <th key={index} className="px-4 py-2 text-right border whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody onContextMenu={onContextMenu}>{children}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableView;
