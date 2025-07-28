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

const getFirstTransactionDateOfAccount = async(accountId) =>
{
  const response = await window.apis.getFirstTransactionDateOfAccount(accountId)
  return response
}

const getLastTransactionDateOfAccount = async(accountId) =>
{
  const response = await window.apis.getLastTransactionDateOfAccount(accountId)
  return response
}

const getAccountTransactionsCount = async(accountId) =>
{
  const response = await window.apis.getAccountTransactionsCount(accountId);
  return response;
}

const createTransaction = async(transactionData) =>
{
  const response = await window.apis.createTransaction(transactionData)
  return response
}

const deleteTransaction = async(id) =>
{
  const response = await window.apis.deleteTransaction(id)
  return response
}

const updateTransaction = async(id, transactionData) =>
{
  const response = await window.apis.updateTransaction(id, transactionData)
  return response
}

const exportPDF = async(data) =>
{
  const response = await window.apis.exportPDF(data)
  return response
}

const exportExcel = async(data) =>
{
  const response = await window.apis.exportExcel(data)
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
  getAcccountStatementForSpecificPeriod,
  getFirstTransactionDateOfAccount,
  getLastTransactionDateOfAccount,
  getAccountTransactionsCount,
  exportPDF,
  exportExcel
}

export default transactionsServices