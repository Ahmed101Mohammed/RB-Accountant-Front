import Joi from "joi"

const getAllAccounts = async() => 
{
  const response = await window.apis.getAllAccounts()
  return response
}

const getAccountById = async(id) => 
{
  const response = await window.apis.getAccountById(id)
  return response
}

const getPossibleUsers = async(partialIdintifier)=>
{
  let partialNameResponse = await window.apis.getAccountsItsNameContain(partialIdintifier)
  let partialIdResponse = await window.apis.getAccountsItsIdContain(partialIdintifier)
  if(partialIdResponse.state && partialNameResponse.state) // if both are true state
  {
    let fullData = partialIdResponse.data.concat(partialNameResponse.data)
    let pureData = {}
    for(let data of fullData)
    {
      if(pureData[data.id]) continue
      pureData[data.id] = data
    }
    partialIdResponse.data = Object.values(pureData)
    return partialIdResponse
  }
  // if one of them is false state send the other.
  if(partialIdResponse.state) return partialIdResponse
  return partialNameResponse  
}

const createAccount = async(id, name) =>
{
  const response = await window.apis.createAccount(id, name)
  return response
}

const deleteAccount = async(id) =>
{
  const response = await window.apis.deleteAccount(id)
  return response
}
const updateAccount = async(id, name) =>
{
  const response = await window.apis.updateAccount(id, name)
  return response
}

const getAccountsItsIdContain = async(id) =>
{
  const response = await window.apis.getAccountsItsIdContain(id)
  return response
}

const accountsServices = {
  getAllAccounts,
  createAccount,
  deleteAccount,
  updateAccount,
  getAccountsItsIdContain,
  getAccountById,
  getPossibleUsers
}
export default accountsServices