import Image from "next/image";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import { About,BoardMembers,Franchise,Players,StartAuction,Teams } from "@/Components/Auction"


export default function TournamentDetail () {
  const [currentPlate, setCurrentPlate] = useState(0);
  const searchParams = useSearchParams()
  const router = useRouter()

  let obj = [
    {label:"About", key:"about"},
    {label:"Board Member", key:"board_member"},
    {label:"Franchise", key:"franchise"},
    {label:"Players", key:"player"},
    {label:"Teams", key:"team"},
    {label:"Start Auction", key:"start_auction"},
  ]

  const handleTabs = (item:any,i:number) => {
    setCurrentPlate(i)
    let findTab = obj.find((itm,i)=> item.key===itm.key)
    if(findTab){
      router.push(`/user/auction/detail/sdjff12fsdf4sf5?tab=${findTab.key}`)
    }
  }
  
  useEffect(() => {
    let param = searchParams.get('tab')
    let findIndex = obj.findIndex((item)=> item.key===param)
    setCurrentPlate(findIndex)    
  }, [])
  


  return (
    <div className="tournament-detail">
      {currentPlate !== 6 &&
      <div className="container-fluid g-0">
        {/* {
        state?.tournament_banner && 
        <Image
          src={ APIimage + state?.tournament_banner}
          width={300}
          height={320}
          alt="img"
          className="w-100"
          style={{ height: "320px" }}
        />
        || */}        
        <Image
          src="/Assets/Images/cricket-tournament-banner.png"
          width={1100}
          height={300}
          alt="img"
          className="w-100"
        />
           {/* } */}
      </div>
      }

      <div className="tournament-tabs">
          <ul>
            {obj.map((item:any,i:number)=> (
            <li style={{color:`${currentPlate>=0 && currentPlate===i ? "#191966" : "black"}`}}
            onClick={()=> handleTabs(item,i)} key={i}>{item.label}</li>
            ))}
            {currentPlate>=0 &&
              <div className="tournament-current-plate" 
                style={{left:`${currentPlate*130}px`}} >
                <div></div></div>
            }
          </ul>
      </div>

      <div className="py-3 overflow-auto">
        {currentPlate===0 && <About />}
        {currentPlate===1 && <BoardMembers />}
        {currentPlate===2 && <Franchise />}
        {currentPlate===3 && <Players />}
        {currentPlate===4 && <Teams />}
        {currentPlate===5 && <StartAuction />}
      </div>
    
    </div>
  );
};



TournamentDetail.auth = { userType: "USER" };