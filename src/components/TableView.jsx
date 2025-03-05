import React from "react"

// TableView.jsx
const TableView = ({ title, heads, pt, ml,children, onClick }) => {
  // 
  const paddingTop = pt ? pt : '0px';
  const marginLeft = ml ? ml : '0px';
  const style = {
    paddingTop: paddingTop,
    marginLeft: marginLeft,
    minWidth: `calc(100% - ${marginLeft})`
  }
  const classs = `overflow-auto`
  return (
    <div className={classs} style={style}>
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse" dir="rtl" onClick={onClick}>
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
