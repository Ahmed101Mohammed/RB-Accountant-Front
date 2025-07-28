import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { reSetButtonName, reSetMessage, setResolverValue, toggleVisibility } from "../reducers/confirm";

export const ConfirmMessage = ()=>
{
  const visibility = useSelector(state => state.confirm.visibility);
  const message = useSelector(state => state.confirm.message);
  const buttonName = useSelector(state => state.confirm.buttonName);

  const dispatch = useDispatch();

  const closeHandler = ()=>
  {
    dispatch(setResolverValue(false));
    dispatch(reSetButtonName());
    dispatch(reSetMessage());
    dispatch(toggleVisibility());
  }

  const confirmHandler = ()=>
  {
    dispatch(setResolverValue(true));
    dispatch(reSetButtonName());
    dispatch(reSetMessage());
    dispatch(toggleVisibility());
  }
  if(visibility === false) return;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative text-center">
        <button
          onClick={closeHandler}
          className="absolute top-3 right-3 text-gray-600 hover:text-red text-3xl font-bold"
          dir="rtl"
        >
          &times;
        </button>

        <div className="mt-6 mb-8 text-lg font-medium text-gray-800" dir="rtl">
          {message}
        </div>

        <button
          onClick={confirmHandler}
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          dir="rtl"
        >
          {buttonName}
        </button>
      </div>
    </div>
  );
}
