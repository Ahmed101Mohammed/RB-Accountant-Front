import React from 'react';

const Details = ({listValues, onSelect, style}) => {
  if (!listValues || listValues.length === 0) return null;
  return (
    <div className="sticky w-full bg-white border rounded-lg shadow-lg z-50" style={style}>
      <ul className="list-none p-2 h-[150px] overflow-auto">
        {listValues.map(({id, name}) => (
          <li
            tabIndex={0}
            key={id}
            onClick={(event) => onSelect(id, event)}
            onKeyDown={(e)=>
            {
              if(e.key === 'Enter') onSelect(id)
            }
            }
            className="p-2 hover:bg-gray-200 cursor-pointer rounded"
          >
            {`${id} - ${name}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Details