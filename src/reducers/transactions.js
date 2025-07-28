import { createSlice } from "@reduxjs/toolkit"
const fromOldToNew = (transactionA, transactionB) => 
{
  return transactionA.body.metaData.date < transactionB.body.metaData.date ? -1 : 1;
}
const transactionsReducer = createSlice({
  name: 'transactions',
  initialState:[],
  reducers: {
    setTransactions(state, action)
    {
      let newState = action.payload;
      newState.sort(fromOldToNew);
      return newState;
    },

    addTransaction(state, action)
    {
      let transaction = action.payload;
      let similarTransaction = state.filter(transaction_ => transaction.id === transaction_.id);
      if(similarTransaction.length > 0) return state;
      state.push(transaction);
      state.sort(fromOldToNew);
      return state;
    },

    removeTransaction(state, action)
    { 
      let id = action.payload;
      let newState = state.filter(transaction => transaction.id !== id);
      return newState
    }
    
  }
})

export const { 
  setTransactions,
  addTransaction,
  removeTransaction,
} = transactionsReducer.actions
export default transactionsReducer.reducer