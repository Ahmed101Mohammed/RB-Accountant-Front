import { createSlice } from "@reduxjs/toolkit"

const accountStatementFormSlice = createSlice({
  name: 'accountStatement',
  initialState: {
    accountId: "",
    startPeriod: "",
    endPeriod: ""
  },
  reducers: {
    setAccountId(state, action)
    {
      state.accountId = action.payload;
      return state;
    },
    setStartPeriod(state, action)
    {
      state.startPeriod = action.payload;
      return state;
    },
    setEndPeriod(state, action)
    {
      state.endPeriod = action.payload;
      return state;
    }
  }
})

export const { 
  setAccountId,
  setStartPeriod,
  setEndPeriod
} = accountStatementFormSlice.actions

export const accountStatementFormReducer = accountStatementFormSlice.reducer