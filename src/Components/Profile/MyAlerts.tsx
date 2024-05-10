'use client'
import React, { useEffect } from 'react';

interface AlertProps {
  myAlerts : any;
  getMyAlertsData : any;
}

export default function MyAlerts ({ myAlerts, getMyAlertsData }:AlertProps)  {
    // let myAlerts = ["Bid Notifications","Live Auction Reminder","Saved Items Going Live","Bids Ending Soon","Rate Your Experience"]

    useEffect(() => {
      getMyAlertsData();
    }, []);

  return (
    <div className="col-md-9" data-aos="zoom-in-right">
          <div className="profile-box">
            <h5 className="text-start w-100">My Alerts</h5>
            <hr className="w-100" />
              {myAlerts && Array.isArray(myAlerts) && myAlerts.length>0 
              && myAlerts.map((item:any, i:number) => (
            <div className="row profile-my-alerts" key={i}>
              <div className='col-1 p-0'>
                <input type='checkbox' />
              </div>
                <div className='col-11'>
                  <h5>{item?.type}</h5>
                  <p>{item?.message}</p>
                </div>
            </div>
              ))}
          </div>
        
        </div>
  );
}
