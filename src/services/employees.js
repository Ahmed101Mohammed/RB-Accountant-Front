import Joi from "joi"

export const getAllEmployees = async() => 
{
  const response = await window.apis.getAllEmployees()
  return response
}

export const getEmployeeById = async(id) => 
{
  const response = await window.apis.getEmployeeById(id)
  return response
}

export const getPossibleEmployees = async(partialIdintifier)=>
{
  let partialNameResponse = await window.apis.getEmployeesItsNameContain(partialIdintifier);
  let partialIdResponse = await window.apis.getEmployeesItsIdContain(partialIdintifier)
  if(partialIdResponse.state && partialNameResponse.state) // if both are true state
  {
    let fullData = partialIdResponse.data.concat(partialNameResponse.data)
    let pureData = {}
    for(let data of fullData)
    {
      if(pureData[data.internalId]) continue
      pureData[data.internalId] = data
    }
    partialIdResponse.data = Object.values(pureData)
    return partialIdResponse
  }
  // if one of them is false state send the other.
  if(partialIdResponse.state) return partialIdResponse
  return partialNameResponse  
}

export const createEmployee = async(id, name) =>
{
  const response = await window.apis.createEmployee(id, name)
  return response
}

export const deleteEmployee = async(internalId) =>
{
  const response = await window.apis.deleteEmployee(internalId)
  return response
}
export const updateEmployee = async(internalId, body) =>
{
  const response = await window.apis.updateEmployee(internalId, body)
  return response
}

export const getEmployeesItsIdContain = async(id) =>
{
  const response = await window.apis.getEmployeesItsIdContain(id)
  return response
}