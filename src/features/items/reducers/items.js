import { createSlice } from "@reduxjs/toolkit"

const itemsSlice = createSlice({
  name: 'items',
  initialState:[],
  reducers: {
    setItems(state, action)
    {
      state = action.payload;
      return state;
    },

    addItem(state, action)
    {
      state.push(action.payload);
      return state;
    }
  }
})

export const { 
  setItems, 
  addItem
} = itemsSlice.actions
export const itemsReducer = itemsSlice.reducer