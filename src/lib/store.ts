import { configureStore } from '@reduxjs/toolkit'
import modalsSlice from './slice/modalsSlice'
import UTCDateSlice from './slice/UTCDateSlice'
import AuctionSlice from './slice/AuctionSlice'
import matchSlice from './slice/matchSlice'
import scoreSlice from './slice/scoreSlice'

export default configureStore({
  reducer: {
    UTCDate: UTCDateSlice,
    modals: modalsSlice,
    auctions: AuctionSlice,
    match: matchSlice,
    score: scoreSlice,
  }
})