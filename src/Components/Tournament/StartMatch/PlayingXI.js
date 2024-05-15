import {
  Button,
  Checkbox,
} from "@mui/material";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import React, { useState } from "react";
import {  team1, team2, } from '@/lib/slice/matchSlice';
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Image from "next/image";

const PlayingXI = ({ setMatchValue,state,team_A_Players,team_B_Players }) => {
  const statedata = useSelector(state => state.match)
  const dispatch = useDispatch()
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [teamArr, setTeamArr] = useState({
    teamA:[],
    teamB:[],
  })

  const handleChange = (e,eid,type) => {
    if(e.target.checked){
        if(teamArr[type].length < state?.min_players){
        setTeamArr({...teamArr, [type]:[...teamArr[type],eid]})
      }
      }else{
        let arr = teamArr[type].filter((item) => item !== eid)
        setTeamArr({...teamArr, [type]:[...arr]})
      }
  }

  const handleSubmit = () => {
    // if(teamArr.teamA.length === state.min_players && teamArr.teamA.length === state.min_players ){
      if(teamArr.teamA.length > 1 && teamArr.teamB.length > 1){
        dispatch(team1({ ...statedata.team1, players:teamArr.teamA }))
        dispatch(team2({ ...statedata.team2, players:teamArr.teamB }))
        setMatchValue("match_toss")
      }else{
        toast.error("Select Players")
      }
    // }else{
    //   toast.error(`Please Select ${state.min_players} Player For Both Team`)
    // }

  }

  const checkAll = (e,team) => {
    if(e.target.checked){
      if(team === "teamA"){
        let teamAa = team_A_Players.map((item) => item._id)
        let teamA = team_A_Players.length > 11 ? teamAa.slice(0,11) : teamAa
        setTeamArr({...teamArr, teamA:[...teamA]})
      }else{
        let teamBb = team_B_Players.map((item) => item._id)
        let teamB = team_B_Players.length > 11 ? teamBb.slice(0,11) : teamBb
        setTeamArr({...teamArr, teamB:[...teamB]})
      }
    }else{
      if(team === "teamA"){
      setTeamArr({...teamArr, teamA:[]})
      }else{
      setTeamArr({...teamArr, teamB:[]})
      }
    }
  }

  const checkIsSelectedTeamA = (item) => {
    let isTrue = false
    let data = teamArr.teamA.length > 0 && teamArr.teamA.filter((item1) => item1 === item._id)
    if(data.length > 0){
      return true
    }
    return isTrue
  }
  const checkIsSelectedTeamB = (item) => {
    let isTrue = false
    let data = teamArr.teamB.length > 0 && teamArr.teamB.filter((item1) => item1 === item._id)
    if(data.length > 0){
      return true
    }
    return isTrue
  }
  
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const imageLoader = (img, defaultimg) => {
    return img ? `${IMAGEURL}${img}` : `${defaultimg}`;
  };


  return (
    <SimpleCard>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h6>{statedata.team1.team_name} Team (Selected : {teamArr.teamA.length}) </h6>
        <div>
       Select Random {state?.min_players} Players  <Checkbox
                  onChange={(e)=> checkAll(e,'teamA')}
                  /> 
                  </div>
        </div>

        <div>
          <h6>Select Playing {state?.min_players}</h6>
        </div>
      </div>

      <div className="palying11">
        <ul className="data">
          {team_A_Players && team_A_Players.map((item,index) => {
            return (
              <li key={index}
                className="d-inline-block  text-center"
                style={{ marginRight: "25px", marginBottom: "25px" }}
              >
                <div className="playinf11-img position-relative">
                  
                  <Image
                    src="/favicon.png"
                    loader={() => imageLoader(item?.img)}
                    width={125}
                    height={125}
                    alt="img"
                    style={{
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <Checkbox
                  onChange={(e)=> handleChange(e,item._id,'teamA')}
                  checked={checkIsSelectedTeamA(item)}
                    style={{
                      position: "absolute",
                      top: 4,
                      padding: 0,
                      right: 0,
                      // color: "#C4C4C4",
                    }}
                    {...label}
                  />
                  <h6 className="mt-2" style={{fontSize:'14px'}}>{item?.name}</h6>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div>
          <h6>{statedata.team2.team_name} Team (Selected : {teamArr.teamB.length})</h6>
          <div>
       Select Random {state?.min_players} Players  <Checkbox
                  onChange={(e)=> checkAll(e,'teamB')}
                  /> 
                  </div>
        </div>
      </div>


      <div className="palying11">
        <ul className="data">
          {team_B_Players && team_B_Players.map((item,index) => {
            return (
              <li key={index}
                className="d-inline-block  text-center"
                style={{ marginRight: "25px", marginBottom: "25px" }}
              >
                <div className="playinf11-img position-relative">
                <Image
                    src="/favicon.png"
                    loader={() => imageLoader(item?.img)}
                    width={125}
                    height={125}
                    alt="img"
                    style={{
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <Checkbox
                    onChange={(e)=> handleChange(e,item._id,'teamB')}
                    checked={checkIsSelectedTeamB(item)}
                    style={{
                      position: "absolute",
                      top: 4,
                      padding: 0,
                      right: 0,
                      // color: "#C4C4C4",
                    }}
                    {...label}
                    // defaultChecked
                  />
                  <h6 className="mt-2" style={{fontSize:'14px'}}>{item?.name}</h6>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="w-100 d-flex justify-content-center">
        <Button
          variant="contained"
          className="bg-dark text-white w-25 me-3 fw-bold"
          onClick={() => setMatchValue("match_detail")}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          className="bg-dark text-white w-25 pe-5 fw-bold"
          onClick={() => handleSubmit()}
        >
          Let’s Play
        </Button>
      </div>
    </SimpleCard>
  );
};

export default PlayingXI;
