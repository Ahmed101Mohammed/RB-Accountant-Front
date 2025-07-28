import { createSlice } from "@reduxjs/toolkit"
const fromOldToNew = (dailyProductionA, dailyProductionB) => 
{
  return dailyProductionA.body.date < dailyProductionB.body.date ? -1 : 1;
}
const dailyProductionsSlice = createSlice({
  name: 'dailyProductions',
  initialState:[],
  reducers: {
    setDailyProductions(state, action)
    {
      let newState = action.payload;
      newState.sort(fromOldToNew);
      return newState;
    },

    addDailyProduction(state, action)
    {
      let dailyProduction = action.payload;
      let similarDailyProduction = state.filter(dailyProduction_ => dailyProduction.id === dailyProduction_.id);
      if(similarDailyProduction.length > 0) return state;
      state.push(dailyProduction);
      state.sort(fromOldToNew);
      return state;
    },

    removeDailyProduction(state, action)
    { 
      let id = action.payload;
      id = Number.parseInt(id);
      let newState = state.filter(dailyProduction => dailyProduction.id !== id);
      return newState;
    }
    
  }
})

export const { 
  setDailyProductions,
  addDailyProduction,
  removeDailyProduction,
} = dailyProductionsSlice.actions
export const dailyProductionsReducer = dailyProductionsSlice.reducer;