'use client'
import React, { useEffect, useState } from 'react';
import ProductCard from '../StyledComponents/ProductCard';

interface BidsProps {
  RemoveToWatchList:any;
  AddToWatchList:any;
  getWinningBidsListData:any;
  winningBidsList:any;
}

const WinningBids:React.FC<BidsProps> = ({RemoveToWatchList,AddToWatchList,getWinningBidsListData,winningBidsList}: BidsProps) => {
      let liveAuction: any = [
        {
          label: "JWDA Penant Lamp Brshed Steel Brshed",
          currentBid: "$14,750 (USD)",
          endIn: "0d : 17h : 59m : 3s",
          aos: "zoom-in-right",
          auctionId: "#BB54112",
          bidsRem:"30Bid"
        },
        {
          label: "JWDA Penant Lamp Brshed Steel Brshed",
          currentBid: "$14,750 (USD)",
          endIn: "0d : 17h : 59m : 3s",
          aos: "zoom-in-right",
          auctionId: "#BB54112",
          bidsRem:"30Bid"
        },
        {
          label: "JWDA Penant Lamp Brshed Steel Brshed",
          currentBid: "$14,750 (USD)",
          endIn: "0d : 17h : 59m : 3s",
          aos: "zoom-in-right",
          auctionId: "#BB54112",
          bidsRem:"30Bid"
        },
        {
          label: "JWDA Penant Lamp Brshed Steel Brshed",
          currentBid: "$14,750 (USD)",
          endIn: "0d : 17h : 59m : 3s",
          aos: "zoom-in-right",
          auctionId: "#BB54112",
          bidsRem:"30Bid"
        },
      ];

      useEffect(() => {
        getWinningBidsListData();
      }, []);
    
  return (
    <div className="col-md-9" data-aos="zoom-in-right">
          <div className="profile-box">
            <h5 className="text-start w-100">Winning Bids</h5>
            <hr className="w-100" />
            <div className="row w-100 mt-2">
            {winningBidsList && Array.isArray(winningBidsList) && winningBidsList.length>0 
              && winningBidsList.map((item: any, index: number) => (
                <div
                  className="col-md-6 mb-5"
                  key={index}
                  data-aos="zoom-in-right"
                  data-aos-duration="1200"
                >
                   <ProductCard
                    item={item}
                    AddToWatchList={AddToWatchList}
                    RemoveToWatchList={RemoveToWatchList}
                  />
                </div>
              )) || <div className='text-center text-white'>Auctions not available</div>}
            </div>
          </div>
        
        </div>
  );
}

export default WinningBids