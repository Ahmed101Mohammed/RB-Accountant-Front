import React from 'react';

const Details = ({listValues, onSelect}) => {
  if (!listValues || listValues.length === 0) return null;
  return (
    <div className="absolute mt-16 w-full bg-white border rounded-lg shadow-lg z-10">
      <ul className="list-none p-2 h-[150px] overflow-auto">
        {listValues.map(({id, name}) => (
          <li
            tabIndex={0}
            key={id}
            onClick={() => onSelect(id)}
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