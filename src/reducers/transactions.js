import { createSlice, current } from "@reduxjs/toolkit"
let currentDate = ()=>
  {
    const toDay = new Date()
    return `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2, '0')}-${toDay.getDate().toString().padStart(2, '0')}`
  }
const transactionsReducer = createSlice({
  name: 'transactions',
  initialState: {
    transactionsData: [],
    transactionsForm: {
      state: true,// true for create, false for update of delete,
      amountField: "",
      debtorIdField: "",
      creditorIdField: "",
      commentField: "",
      transactionId: undefined,
      dateField: currentDate(),
    },
    accountTransactionsFilter: {
      state: false,
      accountId: '',
      startPeriod: '',
      endPeriod: ''
    }
  },
  reducers: {
    setTransactions(state, action)
    {
      const transactions = action.payload
      const transactionsHash = {}
      let newTransactions = []
      for(let transaction of transactions)
      {
        if(!transactionsHash[transaction.id]) {
          transactionsHash[transaction.id] = transaction
          newTransactions.push(transaction)
        }
      }
      const newState = {
        transactionsData: newTransactions,
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },

    addTransaction(state, action)
    {
      let newTransactionsData = {...state.transactionsData}
      const newTransaction = action.payload
      let newTransactions = [...state.transactionsData]
      if(!newTransactionsData[newTransaction.id]) newTransactions = [newTransaction, ...newTransactions]
         newTransactions = newTransactions.sort((a, b) => a.date < b.date ? 1 : a.date === b.date? a.id < b.id? 1 : -1 : -1)
      const newState = {
        transactionsData: newTransactions,
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    removeTransaction(state, action)
    { 
      let transactionId = action.payload
      let newTransactions = []
      for(let transaction of state.transactionsData)
        {
          if(!(transaction.id.toString() === transactionId.toString()))
          {
            newTransactions.push(transaction)
          }
        }
      const newState = {
        transactionsData: newTransactions,
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    toggleTransactionsFormState(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: { ...state.transactionsForm,
          state: !state.transactionsForm.state,
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },

    setTransactionsFormAmountField(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: { ...state.transactionsForm,
          amountField: action.payload
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    settransactionsFormDebtorIdField(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm,
          debtorIdField: action.payload
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    settransactionsFormCreditorIdField(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm,
          creditorIdField: action.payload
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    settransactionsFormCommentField(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm,
          commentField: action.payload
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    settransactionsFormDateField(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm,
          dateField: action.payload
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    
    reSetTransactionsFormDateField(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm,
          dateField: currentDate()
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    setTransactionsFormTransactionId(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm,
          transactionId: action.payload
        },
        accountTransactionsFilter: {...state.accountTransactionsFilter}
      }
      return newState
    },
    toggleAccountTransactionsFilterState(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter,
          state: !state.accountTransactionsFilter.state
        }
      }
      return newState
    },
    setAccountTransactionsFilterAccountId(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter,
          accountId: action.payload
        }
      }
      return newState
    },
    setAccountTransactionsFilterStartPeriod(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter,
          startPeriod: action.payload
        }
      }
      return newState
    },
    setAccountTransactionsFilterEndPeriod(state, action)
    {
      const newState = {
        transactionsData: [...state.transactionsData],
        transactionsForm: {...state.transactionsForm},
        accountTransactionsFilter: {...state.accountTransactionsFilter,
          endPeriod: action.payload
        }
      }
      return newState
    },
    
  }
})

export const { 
  setTransactions,
  addTransaction,
  toggleTransactionsFormState,
  setTransactionsFormAmountField,
  settransactionsFormDebtorIdField,
  settransactionsFormCreditorIdField,
  settransactionsFormCommentField,
  settransactionsFormDateField,
  setAccountsListOptions,
  reSetAccontsListOptions,
  reSetTransactionsFormDateField,
  setTransactionsFormTransactionId,
  toggleAccountTransactionsFilterState,
  setAccountTransactionsFilterAccountId,
  setAccountTransactionsFilterStartPeriod,
  setAccountTransactionsFilterEndPeriod,
  removeTransaction
} = transactionsReducer.actions
export default transactionsReducer.reducer