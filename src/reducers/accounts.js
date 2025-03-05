import { createSlice } from "@reduxjs/toolkit"

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: {
    accountsData: [],
    accountsForm: {
      state: true,// true for create, false for update of delete,
      idField: "",
      nameField: ""
    }
  },
  reducers: {
    setAccounts(state, action)
    {
      const newState = {
        accountsData: [...action.payload],
        accountsForm: {...state.accountsForm}
      }
      return newState
    },

    addAccount(state, action)
    {
      const newState = {
        accountsData: [...state.accountsData, action.payload],
        accountsForm: {...state.accountsForm}
      }
      return newState
    },

    toggleAccountFormState(state, action)
    {
      const newState = {
        accountsData: [...state.accountsData],
        accountsForm: {
          state: !state.accountsForm.state,
          idField: state.accountsForm.idField,
          nameField: state.accountsForm.nameField
        }
      }
      return newState
    },

    setAccountsFormIdField(state, action)
    {
      const newState = {
        accountsData: [...state.accountsData],
        accountsForm: {
          state: state.accountsForm.state,
          idField: action.payload,
          nameField: state.accountsForm.nameField
        }
      }
      return newState
    },
    setAccountsFormNameField(state, action)
    {
      const newState = {
        accountsData: [...state.accountsData],
        accountsForm: {
          state: state.accountsForm.state,
          idField: state.accountsForm.idField,
          nameField: action.payload
        }
      }
      return newState
    },
    
  }
})

export const { 
  setAccounts, 
  addAccount,
  toggleAccountFormState,
  setAccountsFormIdField,
  setAccountsFormNameField
} = accountsSlice.actions
export default accountsSlice.reducer