export const createDailyProductionRecord = async(dailyProductionData) =>
{
  const response = await window.apis.createDailyProductionRecord(dailyProductionData);
  return response
}

export const updateDailyProductionWithId = async(dailyProductionId, dailyProductionData) =>
{
  const response = await window.apis.updateDailyProductionWithId(dailyProductionId, dailyProductionData);
  return response
}

export const getAllDailyProductionRecords = async() =>
{
  const response = await window.apis.getAllDailyProductionRecords();
  return response
}

export const getDailyProductionById = async(dailyProductionId) =>
{
  const response = await window.apis.getDailyProductionById(dailyProductionId);
  return response
}

export const getItemStartAndEndProductionsDate = async(itemId) =>
{
  const response = await window.apis.getItemStartAndEndProductionsDate(itemId);
  return response;
}

export const getItemProductionQuantitiesTotalForAPeriod = async(itemId, startPeriod, endPeriod) =>
{
  const response = await window.apis.getItemProductionQuantitiesTotalForAPeriod(itemId, startPeriod, endPeriod);
  return response;
}

export const deleteDailyProductionById = async(dailyProductionId) =>
{
  const response = await window.apis.deleteDailyProductionById(dailyProductionId);
  return response;
}