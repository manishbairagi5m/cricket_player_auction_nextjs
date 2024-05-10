import { configureStore } from '@reduxjs/toolkit'
import modalsSlice from './slice/modalsSlice'
import UTCDateSlice from './slice/UTCDateSlice'
import AuctionSlice from './slice/AuctionSlice'

export default configureStore({
  reducer: {
    UTCDate: UTCDateSlice,
    modals: modalsSlice,
    auctions: AuctionSlice,
  }
})