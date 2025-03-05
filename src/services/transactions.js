const getAllTransactions = async() => 
{
  const response = await window.apis.getAllTransactions()
  return response
}
const getTransactionById = async(id) => 
{
  const response = await window.apis.getTransactionById(id)
  return response
}
const getAllTransactionsWithPaging = async(page) => 
{
  const response = await window.apis.getAllTransactionsWithPaging(page)
  return response
}

const getAllTransactionsForAccountForPeriod = async(accountId, startPeriod, endPeriod) => 
{
  const response = await window.apis.getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
  return response
}

const getAllTransactionsForSpecificPeriod = async(startPeriod, endPeriod) => 
{
  const response = await window.apis.getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
  return response
}

const getAllTransactionsForAccount = async(startPeriod, endPeriod) => 
{
  const response = await window.apis.getAllTransactionsForAccount(startPeriod, endPeriod)
  return response
}

const getAccountBalanceAtStartPeriod = async(accountId, startPeriod) => 
{
  const response = await window.apis.getAccountBalanceAtStartPeriod(accountId, startPeriod)
  return response
}

const getAcccountStatementForSpecificPeriod = async(accountId, startPeriod, endPeriod) => 
{
  const response = await window.apis.getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
  return response
}

const createTransaction = async(amount, debtorId, creditorId, comment, date) =>
{
  const response = await window.apis.createTransaction(amount, debtorId, creditorId, comment, date)
  return response
}

const deleteTransaction = async(id) =>
{
  const response = await window.apis.deleteTransaction(id)
  return response
}
const updateTransaction = async(id, amount, debtorId, creditorId, comment, date) =>
{
  const response = await window.apis.updateTransaction(id, amount, debtorId, creditorId, comment, date)
  return response
}

const transactionsServices = {
  getAllTransactions,
  getTransactionById,
  getAllTransactionsWithPaging,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  getAllTransactionsForAccountForPeriod,
  getAllTransactionsForSpecificPeriod,
  getAllTransactionsForAccount,
  getAccountBalanceAtStartPeriod,
  getAcccountStatementForSpecificPeriod
}
export default transactionsServices