import Joi from "joi"

export const getAllMachines = async() => 
{
  const response = await window.apis.getAllMachines()
  return response
}

export const getMachineById = async(id) => 
{
  const response = await window.apis.getMachineById(id)
  return response
}

export const getPossibleMachines = async(partialIdintifier)=>
{
  const schema = Joi.object({
    partialIdintifier: Joi
        .string()
        .pattern(/^\d+$/, 'كود المكينة يحتوي على أرقام فقط')
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود المكينة 20 رقما',
          'string.pattern.base': 'كود المكينة يحتوي على أرقام فقط',
        }),
  })

  const validationResponse = schema.validate({partialIdintifier})
  let partialIdResponse;
  let partialNameResponse = await window.apis.getMachinesItsNameContain(partialIdintifier);

  if(validationResponse.error) return partialNameResponse // if the id formate is wrong
  partialIdResponse = await window.apis.getMachinesItsIdContain(partialIdintifier)
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

export const createMachine = async(id, name) =>
{
  const response = await window.apis.createMachine(id, name)
  return response
}

export const deleteMachine = async(internalId) =>
{
  const response = await window.apis.deleteMachine(internalId)
  return response
}
export const updateMachine = async(internalId, body) =>
{
  const response = await window.apis.updateMachine(internalId, body)
  return response
}

export const getMachinesItsIdContain = async(id) =>
{
  const response = await window.apis.getMachinesItsIdContain(id)
  return response
}