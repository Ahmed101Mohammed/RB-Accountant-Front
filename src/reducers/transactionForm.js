import { createSlice } from "@reduxjs/toolkit"
let currentDate = ()=>
  {
    const toDay = new Date()
    return `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2, '0')}-${toDay.getDate().toString().padStart(2, '0')}`
  }
const transactionFormReducer = createSlice({
  name: 'transactionForm',
  initialState: {
    state: true,// true for create, false for update or delete,
    participants: [{amount: "", id: "", role: "0"}, {amount: "", id: "", role: "0" }],
    comment: "",
    transactionId: null,
    date: currentDate(),
  },
  reducers: {
    setState(state, action) // used
    {
      const newState = {
        ...state,
        state: action.payload,
      }
      return newState
    },
    setComment(state, action) // used
    {
      const newState = {
        ...state,
        comment: action.payload
      }
      return newState
    },
    reSetComment(state, action)
    {
      const newState = {
        ...state,
        comment: ""
      }
      return newState;
    },
    setDate(state, action) // used;
    {
      const newState = {  
      ...state,
      date: action.payload
      }
      return newState
    },
    reSetDate(state, action)
    {
      const newState = {
        ...state,
        date: currentDate()
      }
      return newState;
    },
    setParticipants(state, action)
    {
      const newState = {
        ...state,
        participants: action.payload
      }
      return newState;
    },
    reSetParticipants(state, action)
    {
      const newState = {
        ...state,
        participants: [{amount: "", id: "", role: "0"}, {amount: "", id: "", role: "0" }]
      }
      return newState;
    },
    setTransactionId(state, action) // Why it here: Because this data needed from user to update and delete transaction even I make this for him.
    {
      const newState = {
        ...state,
        transactionId: action.payload
      }
      return newState;
    },
    reSetTransactionId(state, action) // Why it needed (you know there no input for it): Because the state will save the value for the next set, and may it used by mistake, so I prefere to reset the state after using it.
    {
      const newState = {
        ...state,
        transactionId: null
      }
      return newState;
    }    
  }
})

export const {
  setState,
  setComment,
  reSetComment,
  setDate,
  reSetDate,
  setParticipants,
  reSetParticipants,
  setTransactionId,
  reSetTransactionId
} = transactionFormReducer.actions
export default transactionFormReducer.reducer