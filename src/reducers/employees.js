import { createSlice } from "@reduxjs/toolkit"

const employeesSlice = createSlice({
  name: 'employees',
  initialState:[],
  reducers: {
    setEmployees(state, action)
    {
      state = action.payload;
      return state;
    },

    addEmployee(state, action)
    {
      state.push(action.payload);
      return state;
    }
  }
})

export const { 
  setEmployees, 
  addEmployee
} = employeesSlice.actions
export const employeesReducer = employeesSlice.reducer