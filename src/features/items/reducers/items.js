import { createSlice } from "@reduxjs/toolkit"
const fromHighToLowIdPrefix = (itemA, itemB) => 
{
  const itemAParts = itemA.body.id.split('-');
  const itemBParts = itemB.body.id.split('-');
  const prefixAInt = Number.parseInt(itemAParts[0]);
  const prefixBInt = Number.parseInt(itemBParts[0]);
  const postfixAInt = Number.parseInt(itemAParts[1]);
  const postfixBInt = Number.parseInt(itemAParts[1]);

  const prefixAStr = itemAParts[0];
  const prefixBStr = itemBParts[0];
  const postfixAStr = itemAParts[1];
  const postfixBStr = itemBParts[1];

  // if pres are integer
  if(Number.isFinite(prefixAInt) && Number.isFinite(prefixBInt))
  {
    if(prefixAInt < prefixBInt) return -1;
    if(prefixBInt < prefixAInt) return 1;

    if(Number.isFinite(postfixAInt) && Number.isFinite(postfixBInt))
    {
      if(postfixAInt < postfixBInt) return -1;
      return 1;
    }
    if(Number.isFinite(postfixAInt)) return -1;
    if(Number.isFinite(postfixBInt)) return 1;

    if(postfixAStr < postfixBStr) return -1;
    return 1;
  }

  // if one pres is integer

  if(Number.isFinite(prefixAInt)) return -1;
  if(Number.isFinite(prefixBInt)) return 1;

  // if pres are not integer
  if(prefixAStr < prefixBStr) return -1;
  if(prefixBStr < prefixAStr) return 1;

  if(Number.isFinite(postfixAInt) && Number.isFinite(postfixBInt))
  {
    if(postfixAInt < postfixBInt) return -1;
    return 1;
  }
  if(Number.isFinite(postfixAInt)) return -1;
  if(Number.isFinite(postfixBInt)) return 1;

  if(postfixAStr < postfixBStr) return -1;
  return 1;
}

const itemsSlice = createSlice({
  name: 'items',
  initialState:[],
  reducers: {
    setItems(state, action)
    {
      state = action.payload;
      state.sort(fromHighToLowIdPrefix);
      return state;
    },

    addItem(state, action)
    {
      state.push(action.payload);
      state.sort(fromHighToLowIdPrefix);
      return state;
    }
  }
})

export const { 
  setItems, 
  addItem
} = itemsSlice.actions
export const itemsReducer = itemsSlice.reducer