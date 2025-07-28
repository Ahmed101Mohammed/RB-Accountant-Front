import { createSlice } from "@reduxjs/toolkit"

const accountsSlice = createSlice({
  name: 'accounts',
  initialState:[],
  reducers: {
    setAccounts(state, action)
    {
      state = action.payload;
      return state;
    },

    addAccount(state, action)
    {
      state.push(action.payload);
      return state;
    }
  }
})

export const { 
  setAccounts, 
  addAccount
} = accountsSlice.actions
export default accountsSlice.reducer