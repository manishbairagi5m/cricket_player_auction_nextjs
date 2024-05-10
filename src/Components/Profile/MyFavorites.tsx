'use client'
import { getMyWatchlist } from '@/customApi/auction';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { toast } from 'react-toastify';
import ProductCard from '../StyledComponents/ProductCard';

interface BidsProps {
  handlePlaceBid:any;
  RemoveToWatchList:any;
  getMyWatchlistData:any;
  watchlist:any;
}

const MyFavorites:React.FC<BidsProps> = ({handlePlaceBid,RemoveToWatchList,getMyWatchlistData,watchlist}: BidsProps) => {
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
        getMyWatchlistData()
       }, [])

       useEffect(() => {
        const interval : any = setInterval(() => {
          if(watchlist) setUpdateData([...watchlist])
          }, 1000);
        return () => {
          clearInterval(interval);
        };
      }, [watchlist]);

  return (
    <div className="col-md-9" data-aos="zoom-in-right">
          <div className="profile-box">
            <h5 className="text-start w-100">My Favorites</h5>
            <hr className="w-100" />
            <div className="row w-100 mt-2">
              {watchlist && Array.isArray(watchlist) && watchlist.length>0 
              && watchlist.map((item: any, index: number) => (
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
                  />
                  {/* <div className="dashboard-card">
                    <div className="imagebox">
                      <Image
                        src={`/Assets/Images/live-ring.png`}
                        width={410}
                        height={320}
                        alt="auction"
                      />
                      <div>
                        <Image
                          src={`/Assets/Images/dashboard-bid.png`}
                          width={20}
                          height={20}
                          alt="auction"
                        />
                      </div>
                      <FaRegHeart />
                    </div>
                    <div>
                      <h5>{item.label}</h5>
                      <div className="bid-detail">
                        <div>
                          Current Bid <br />
                          <span className="text-primary">
                            {item.currentBid}
                          </span>
                        </div>
                        <div className="text-right right-border">
                          Ends In <br />
                          <span className="text-danger">{item.endIn}</span>
                        </div>
                      </div>
                      <div className="text-end mb-4" style={{color:"#B122E6"}}>{item.bidsRem}</div>
                    </div>
                    <button className="auction-button">Submit A Bid</button>
                  </div> */}
                </div>
              )) || <div className='text-center text-white'>Auctions not available</div>}
            </div>
          </div>
        
        </div>
  );
}

export default MyFavorites