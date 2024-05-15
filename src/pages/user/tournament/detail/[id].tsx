import Image from "next/image";
import React, { useEffect } from "react";
import { useState } from "react";
import { About,Fixtures,Matches,PointTable,StartMatch,Stats,Teams } from "@/Components/Tournament"
import { getSingleTournamentAbout } from "@/customApi/tournament";
import { useRouter } from "next/router";


export default function TournamentDetail () {
  const [currentPlate, setCurrentPlate] = useState(0);
  const [state, setState] = useState([]);
  const [addTeam, setAddTeam] = useState('Team')
  const [teamId, setTeamId] = useState('')
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
      router.push(`/user/tournament/detail/${router.query.id}?tab=${findTab.key}`)
    }
  }
  
  useEffect(() => {
    let findIndex = obj.findIndex((item)=> item.key===router.query.tab)
    setCurrentPlate(findIndex)    
  }, [])


  const getDetail = async () => {
    await getSingleTournamentAbout(router.query.id).then((res) => {
      setState(res?.data);
    });
  };

  useEffect(() => {
    getDetail();
  }, []);
  


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
      <div className="py-4 overflow-auto">
        {currentPlate===0 && <About state={state} />}
        {currentPlate===1 && <Teams teamId={teamId} setAddTeam ={setAddTeam} setTeamId={setTeamId} state={state} />}
        {currentPlate===2 && <Matches state={state} />}
        {currentPlate===3 && <Fixtures data={state} />}
        {currentPlate===4 && <Stats />}
        {currentPlate===5 && <PointTable />}
        {currentPlate===6 && <StartMatch state={state} />}
      </div>
    
    </div>
  );
};



TournamentDetail.auth = { userType: "USER" };