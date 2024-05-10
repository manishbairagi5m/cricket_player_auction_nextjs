import Image from "next/image";
import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import {About,Fixtures,Matches,PointTable,StartMatch,Stats,Teams} from "@/Components/Tournament"


export default function TournamentDetail () {
  const [currentPlate, setCurrentPlate] = useState(0);
  const searchParams = useSearchParams()
  const router = useRouter()

  let obj = [
    {label:"About", key:"about"},
    {label:"Teams", key:"teams"},
    {label:"Matches", key:"matches"},
    {label:"Fixtures", key:"fixtures"},
    {label:"Stats", key:"stats"},
    {label:"Point Table", key:"point_table"},
    {label:"Start Match", key:"start_match"},
  ]

  const handleTabs = (item:any,i:number) => {
    setCurrentPlate(i)
    let findTab = obj.find((itm,i)=> item.key===itm.key)
    if(findTab){
      router.push(`/user/tournament/detail/sdjff12fsdf4sf5?tab=${findTab.key}`)
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
                style={{left:`${currentPlate*120}px`}} >
                <div></div></div>
            }
          </ul>
      </div>
      <div className="my-4 overflow-auto">
        {currentPlate===0 && <About state={{organizer_name:'ffdas'}} />}
        {currentPlate===1 && <Teams />}
        {currentPlate===2 && <Matches />}
        {currentPlate===3 && <Fixtures />}
        {currentPlate===4 && <Stats />}
        {currentPlate===5 && <PointTable />}
        {currentPlate===6 && <StartMatch />}
      </div>
    
    </div>
  );
};



TournamentDetail.auth = { userType: "USER" };