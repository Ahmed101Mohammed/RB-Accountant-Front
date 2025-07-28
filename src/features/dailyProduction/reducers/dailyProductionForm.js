import { createSlice } from "@reduxjs/toolkit";
import { currentDate } from "../../../reducers/utils/currentDate.js";
const dailyProductionFormSlice = createSlice({
  name: 'dailyProduction',
  initialState: {
    createMode: true,
    visibale: false,
    dailyProductionId: null,
    date: currentDate(),
    shifts: []
  },
  reducers: {
    setDate(state, action) {
      state.date = action.payload;
      return state;
    },
    addShift(state, action) {
      if(state.shifts.length >= 3) return state;
      state.shifts.push({
        name: '',
        startAt: null,
        endAt: null,
        items: []
      });
      return state;
    },
    updateShift(state, action) {
      const { shiftIndex, field, value } = action.payload;
      // No shifts with same name.
      if(field === 'name')
      {
        let shift = state.shifts.filter(shift => shift.name === value);
        if(shift.length !== 0) return state;
      }

      // No intersections between shifts.
      const intValue = Number.parseInt(value);
      if(field === 'startAt' || field === 'endAt')
      {
        let shift = state.shifts.filter((shift, index) => 
          {
            if(index === shiftIndex) return false;
            const start = Number.parseInt(shift.startAt);
            const end = Number.parseInt(shift.endAt)
            return (shift.startAt && shift.endAt && intValue > start && intValue < end)
          });
        if(shift.length !== 0) return state;
      }

      const start = Number.parseInt(state.shifts[shiftIndex]['startAt']);
      const end = Number.parseInt(state.shifts[shiftIndex]['endAt']);
      if((field === 'endAt' && !Number.isNaN(start)) || (field === 'startAt' && !Number.isNaN(end)))
      {
        let start_ = null;
        let end_ = null;
        if(field === 'startAt')
        {
          start_ = intValue;
          end_ = end;
        }
        else
        {
          start_ = start;
          end_ = intValue;
        }
        if(start_ >= end_) return state;
        let shift = state.shifts.filter((shift, index) => 
          {
            if(index === shiftIndex) return false;
            const start = Number.parseInt(shift.startAt);
            const end = Number.parseInt(shift.endAt)
            return (shift.startAt && shift.endAt && (start_ <= start && end_ >= end))
          });
        if(shift.length !== 0) return state;
      }

      state.shifts[shiftIndex][field] = value;
      return state;
    },
    addItem(state, action) {
      const { shiftIndex } = action.payload;
      state.shifts[shiftIndex].items.push({
        accountId: '',
        itemId: '', // customerId
        details: []
      });
      return state;
    },
    updateItem(state, action) {
      const { shiftIndex, itemIndex, field, value } = action.payload;
      state.shifts[shiftIndex].items[itemIndex][field] = value;
      return state;
    },
    addDetail(state, action) {
      const { shiftIndex, itemIndex } = action.payload;
      state.shifts[shiftIndex].items[itemIndex].details.push({
        machineId: '',
        employeeId: '',
        startAt: null,
        endAt: null,
        highQualityQuantity: 0,
        lowQualityQuantity: 0
      });
      return state;
    },
    updateDetail(state, action) {
      const { shiftIndex, itemIndex, detailIndex, field, value } = action.payload;
      if(field === 'startAt' || field === 'endAt')
      {
        const start = Number.parseInt(state.shifts[shiftIndex].items[itemIndex].details[detailIndex]['startAt']);
        const end = Number.parseInt(state.shifts[shiftIndex].items[itemIndex].details[detailIndex]['endAt']);
        const intValue = Number.parseInt(value);
        if((field === 'endAt' && !Number.isNaN(start)) || (field === 'startAt' && !Number.isNaN(end)))
        {
          let start_ = null;
          let end_ = null;
          if(field === 'startAt')
          {
            start_ = intValue;
            end_ = end;
          }
          else
          {
            start_ = start;
            end_ = intValue;
          }

          if (start_ >= end_) return state;
        }
      }
      state.shifts[shiftIndex].items[itemIndex].details[detailIndex][field] = value;
      return state;
    },
    deleteDetail(state, action) {
      const { shiftIndex, itemIndex, detailIndex } = action.payload;
      state.shifts[shiftIndex].items[itemIndex].details.splice(detailIndex, 1);
      return state;
    },
    deleteItem(state, action) {
      const { shiftIndex, itemIndex } = action.payload;
      state.shifts[shiftIndex].items.splice(itemIndex, 1);
      return state;
    },
    deleteShift(state, action) {
      const { shiftIndex } = action.payload;
      state.shifts.splice(shiftIndex, 1);
      return state;
    },
    reSetDailyProduction(state, action)
    {
      state.date = currentDate();
      state.shifts = [];
      return state;
    },
    setCreateMode(state, action)
    {
      state.createMode = action.payload? true : false;
      return state;
    },
    setDailyProductionForm(state, action)
    {
      state.date = action.payload.date;
      state.shifts = action.payload.shifts;
    },
    setVisibility(state, action)
    {
      state.visibale = action.payload? true : false;
      return state;
    },
    setDailyProductionId(state, action)
    {
      state.dailyProductionId = action.payload;
      return state;
    }
  }
});

export const {
  setDate,
  addShift,
  updateShift,
  addItem,
  updateItem,
  addDetail,
  updateDetail,
  deleteDetail,
  deleteItem,
  deleteShift,
  reSetDailyProduction,
  setCreateMode,
  setDailyProductionForm,
  setVisibility,
  setDailyProductionId
} = dailyProductionFormSlice.actions;

export const dailyProductionFormReducer = dailyProductionFormSlice.reducer;