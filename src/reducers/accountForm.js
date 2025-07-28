import { createSlice } from "@reduxjs/toolkit"

const accountFormSlice = createSlice({
  name: 'accountForm',
  initialState: {
      state: true,// true for create, false for update of delete,
      id: "",
      name: ""
  },
  reducers: {
    setState(state, action) // toggleAccountFormState
    {
      state.state = action.payload;
      return state
    },

    setId(state, action) // setAccountsFormIdField
    {
      state.id = action.payload;
      return state;
    },
    setName(state, action) // setAccountsFormNameField
    {
      state.name = action.payload;
      return state;
    },
    
  }
})

export const {
  setState,
  setId,
  setName,
} = accountFormSlice.actions
export default accountFormSlice.reducer