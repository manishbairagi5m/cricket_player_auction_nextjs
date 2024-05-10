import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalsState {
  auctionList: any;
  popularAuction: any;
  upcomingAuction: any;
  liveAuction: any;
  myFavorites: any;
  myAuction: any;
}

const initialState: ModalsState = {
  auctionList: [],
  popularAuction: [],
  upcomingAuction: [],
  liveAuction: [],
  myFavorites: [],
  myAuction: [],
};

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setAuctionList: (state, action: PayloadAction<any>) => {
      state.auctionList = action.payload;
    },
    setPopularAuction: (state, action: PayloadAction<any>) => {
      state.popularAuction = action.payload;
    },
    setUpcomingAuction: (state, action: PayloadAction<any>) => {
      state.upcomingAuction = action.payload;
    },
    setLiveAuction: (state, action: PayloadAction<any>) => {
      state.liveAuction = action.payload;
    },
    setMyFavorites: (state, action: PayloadAction<any>) => {
      state.myFavorites = action.payload;
    },
    setMyAuction: (state, action: PayloadAction<any>) => {
      state.myAuction = action.payload;
    },
  },
});

export const {
  setAuctionList,setPopularAuction,
  setUpcomingAuction,setLiveAuction,
  setMyFavorites,setMyAuction
} = auctionSlice.actions;

export default auctionSlice.reducer;
