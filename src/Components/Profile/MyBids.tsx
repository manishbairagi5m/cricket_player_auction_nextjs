'use client'
import React, { useEffect, useState } from 'react';
import ProductCard from '../StyledComponents/ProductCard';

interface BidsProps {
  handlePlaceBid:any;
  RemoveToWatchList:any;
  AddToWatchList:any;
  getMyBidsListData:any;
  myBidsList:any;
}

const MyBids:React.FC<BidsProps> = ({handlePlaceBid,RemoveToWatchList,AddToWatchList,getMyBidsListData,myBidsList}: BidsProps) => {
  const [updateData, setUpdateData] = useState<any>([]);
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
        getMyBidsListData();
      }, []);


      useEffect(() => {
        const interval : any = setInterval(() => {
          if(myBidsList) setUpdateData([...myBidsList])
          }, 1000);
        return () => {
          clearInterval(interval);
        };
      }, [myBidsList]);

  return (
    <div className="col-md-9" data-aos="zoom-in-right">
          <div className="profile-box">
            <h5 className="text-start w-100">My Bids</h5>
            <hr className="w-100" />
            <div className="row w-100 mt-2">
              {myBidsList && Array.isArray(myBidsList) && myBidsList.length>0 
              && myBidsList.map((item: any, index: number) => (
                <div
                  className="col-md-6 mb-5"
                  key={index}
                  data-aos={item.aos}
                  data-aos-duration="1200"
                >
                   <ProductCard
                    item={item}
                    handlePlaceBid={handlePlaceBid}
                    RemoveToWatchList={RemoveToWatchList}
                    AddToWatchList={AddToWatchList}
                  />
                </div>
              )) || <div className='text-center text-white'>Auctions not available</div>}
            </div>
          </div>     
        </div>
  );
}

export default MyBids