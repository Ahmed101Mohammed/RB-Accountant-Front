import { createSlice } from "@reduxjs/toolkit"

const accountStatementSlice = createSlice({
  name: 'accountStatement',
  initialState: {
    data: [],
    dataHeader: {
      accountId: "",
      startPeriod: "",
      endPeriod: ""
    }
  },
  reducers: {
    setData(state, action)
    {
      const newState = {
        data: action.payload,
        dataHeader: {...state.dataHeader}
      }
      return newState
    },
    setAccountId(state, action)
    {
      const newState = {
        data: [...state.data],
        dataHeader: {
          ...state.dataHeader,
          accountId: action.payload
        }
      }
      return newState
    },
    setStartPeriod(state, action)
    {
      const newState = {
        data: [...state.data],
        dataHeader: {
          ...state.dataHeader,
          startPeriod: action.payload
        }
      }
      return newState
    },
    setEndPeriod(state, action)
    {
      const newState = {
        data: [...state.data],
        dataHeader: {
          ...state.dataHeader,
          endPeriod: action.payload
        }
      }
      return newState
    },
  }
})

export const { 
  setData, 
  setAccountId,
  setStartPeriod,
  setEndPeriod
} = accountStatementSlice.actions
export default accountStatementSlice.reducer