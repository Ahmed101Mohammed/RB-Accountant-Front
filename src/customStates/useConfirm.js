import { useDispatch } from "react-redux"
import { setButtonName, setMessage, setResolver, toggleVisibility } from "../reducers/confirm.js";

export const useConfirm = ()=>
{
  const dispatch = useDispatch();

  const confirm = (message, buttonName = "موافق") =>
  {
    return new Promise((resolve)=>
    {
      dispatch(setMessage(message));
      dispatch(setButtonName(buttonName));
      dispatch(setResolver(resolve));
      dispatch(toggleVisibility());
    })
  }

  return confirm;
}