import { createSlice } from "@reduxjs/toolkit"

const confirmSlice = createSlice({
  name: 'confirm',
  initialState: {
    message: "",
    buttonName: "موافق",
    resolver: null,
    visibility: false
  },
  reducers: {
    setMessage(state, action)
    {
      const newState =  {
        ...state,
        message: action.payload
      }
      return newState;
    },
    reSetMessage(state, action)
    {
       const newState =  {
        ...state,
        message: ""
      }
      return newState;
    },
    setButtonName(state, action)
    {
      const newState =  {
        ...state,
        buttonName: action.payload
      }
      return newState;
    },
    reSetButtonName(state, action)
    {
      const newState =  {
        ...state,
        buttonName: "موافق"
      }
      return newState;
    },
    setResolver(state, action)
    {
      const newState =  {
        ...state,
        resolver: action.payload
      }
      return newState;
    },
    setResolverValue(state, action)
    {
      if(state.resolver === null) throw new Error("You need to set the resolver state with resolve function first, then you can use setResolverValue action");
      state.resolver(action.payload);
      const newState = {
        ...state,
        resolver: null
      }
      return newState;
    },
    toggleVisibility(state, action)
    {
      const newState =  {
        ...state,
        visibility: !state.visibility
      }
      return newState;
    }
  }
})

export const { 
  setMessage,
  reSetMessage,
  setButtonName,
  reSetButtonName,
  setResolver,
  setResolverValue,
  toggleVisibility
} = confirmSlice.actions
export default confirmSlice.reducer