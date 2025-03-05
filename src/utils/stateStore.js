import { configureStore } from '@reduxjs/toolkit'
import accountsSlice from '../reducers/accounts.js'
import notificationReducer from '../reducers/notification.js'
import transactionsReducer from '../reducers/transactions.js'
import accountStatementReducer from '../reducers/accountStatement.js'
const store = configureStore({
  reducer: {
    accounts: accountsSlice,
    notification: notificationReducer,
    transactions: transactionsReducer,
    accountStatement: accountStatementReducer
  },
})

export default store