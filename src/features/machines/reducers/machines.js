import { createSlice } from "@reduxjs/toolkit"

const machinesSlice = createSlice({
  name: 'machines',
  initialState:[],
  reducers: {
    setMachines(state, action)
    {
      state = action.payload;
      return state;
    },

    addMachine(state, action)
    {
      state.push(action.payload);
      return state;
    }
  }
})

export const { 
  setMachines, 
  addMachine
} = machinesSlice.actions
export const machinesReducer = machinesSlice.reducer