import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ModalsState {
  uTCDate: number;
}

const initialState: ModalsState = {
  uTCDate: 0,
};

export const UTCDateSlice = createSlice({
  name: 'uTCDate',
  initialState:initialState,
  reducers: {
    setUTCDate: (state:any, action: PayloadAction<number>) => {
      state.uTCDate = action.payload;
    },
    UTCIncrement: (state:any) => {
      state.uTCDate += 100;
    },
  }
})

export const { UTCIncrement,setUTCDate } = UTCDateSlice.actions

export default UTCDateSlice.reducer