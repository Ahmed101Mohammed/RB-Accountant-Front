import { createSlice } from "@reduxjs/toolkit"

const accountStatementSlice = createSlice({
  name: 'accountStatement',
  initialState: [],
  reducers: {
    setData(state, action)
    {
      return action.payload;
    }
  }
})

export const { 
  setData
} = accountStatementSlice.actions
export const accountStatementReducer = accountStatementSlice.reducer;