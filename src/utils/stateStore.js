import { configureStore } from '@reduxjs/toolkit';
import accountsSlice from '../reducers/accounts.js';
import notificationReducer from '../reducers/notification.js';
import transactionsReducer from '../reducers/transactions.js';
import transactionFormReducer from '../reducers/transactionForm.js';
import confirmReducer from '../reducers/confirm.js';
import accountFormReducer from '../reducers/accountForm.js';
import { employeesReducer } from '../reducers/employees.js';
import { employeeFormReducer } from '../reducers/employeeForm.js';
import { machinesReducer } from '../features/machines/reducers/machines.js';
import { machineFormReducer } from '../features/machines/reducers/machineForm.js';
import { itemsReducer } from '../features/items/reducers/items.js';
import { itemFormReducer } from '../features/items/reducers/itemForm.js';
import { dailyProductionFormReducer } from '../features/dailyProduction/reducers/dailyProductionForm.js';
import { dailyProductionsReducer } from '../features/dailyProduction/reducers/dailyProductions.js';
import { accountStatementReducer } from '../reducers/accountStatement.js';
import { accountStatementFormReducer } from '../reducers/accountStatementForm.js';

const store = configureStore({
  reducer: {
    accounts: accountsSlice,
    notification: notificationReducer,
    transactions: transactionsReducer,
    transactionForm: transactionFormReducer,
    accountStatement: accountStatementReducer,
    accountStatementForm: accountStatementFormReducer,
    confirm: confirmReducer,
    accountForm: accountFormReducer,
    employees: employeesReducer,
    employeeForm: employeeFormReducer,
    machines: machinesReducer,
    machineForm: machineFormReducer,
    items: itemsReducer,
    itemForm: itemFormReducer,
    dailyProductionForm: dailyProductionFormReducer,
    dailyProductions: dailyProductionsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['confirm.resolver'],
      },
    }),
});

export default store