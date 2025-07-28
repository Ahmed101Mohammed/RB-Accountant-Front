import { createSlice } from "@reduxjs/toolkit"

const machineFormSlice = createSlice({
  name: 'machineForm',
  initialState: {
      state: true,// true for create, false for update of delete,
      id: "",
      name: "",
      fixedId: null,
  },
  reducers: {
    setState(state, action)
    {
      state.state = action.payload;
      return state
    },


    setId(state, action)
    {
      state.id = action.payload;
      return state;
    },
    reSetId(state, action)
    {
      state.id = "";
      return state;
    },

    setName(state, action)
    {
      state.name = action.payload;
      return state;
    },
    reSetName(state, action)
    {
      state.name = "";
      return state;
    },

    setFixedId(state, action)
    {
      state.fixedId = action.payload;
      return state;
    },
    reSetFixedId(state, action)
    {
      state.fixedId = null;
      return state;
    }
    
  }
})

export const {
  setState,
  setId,
  reSetId,
  setName,
  reSetName,
  setFixedId,
  reSetFixedId,
} = machineFormSlice.actions
export const machineFormReducer = machineFormSlice.reducer