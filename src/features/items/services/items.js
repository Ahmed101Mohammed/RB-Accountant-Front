import Joi from "joi"

export const getAllItems = async() => 
{
  const response = await window.apis.getAllItems()
  return response
}

export const getItemById = async(id) => 
{
  const response = await window.apis.getItemById(id)
  return response
}

export const getPossibleItems = async(partialIdintifier)=>
{
  let partialNameResponse = await window.apis.getItemsItsNameContain(partialIdintifier);
  let partialIdResponse = await window.apis.getItemsItsIdContain(partialIdintifier);
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

export const createItem = async(id, name) =>
{
  const response = await window.apis.createItem(id, name)
  return response
}

export const deleteItem = async(id) =>
{
  const response = await window.apis.deleteItem(id)
  return response
}
export const updateItem = async(internalId, body) =>
{
  const response = await window.apis.updateItem(internalId, body)
  return response
}

export const getItemsItsIdContain = async(id) =>
{
  const response = await window.apis.getItemsItsIdContain(id)
  return response
}