import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  styled,
  Button,
} from "@mui/material";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import React, { useState } from "react";
import { TiPlus } from "react-icons/ti";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { updateMatchData,addMatchSetting } from "@/customApi/tournament";
import logo from "/public/favicon.png";
import { useDispatch,useSelector } from "react-redux";
import {  striker, non_striker,bowler } from '@/lib/slice/matchSlice';

const MatchOpener = ({
  battingTeam,
  bowlingTeam,
  handleStartGame,
  udpateInning,
  runningMatchData,
  teamsDetailData
}) => {
  const dispatch = useDispatch()
  const statedata = useSelector(state => state.match)
  const scoreState = useSelector(state => state.score)
  const [state, setState] = useState({
    striker: "",
    bowler: "",
    non_striker: "",
  });
  const boxStyle = {
    width: "100%",
    height: "180px",
    textAlign: "center",
    border: "1px dashed black",
    borderRadius: "10px",
  };

  // console.log(state,'state')

  // const checkInnings = () => {
  //   let isTrue = false
  //   if(Object.keys(runningMatchData).length > 0){
  //     if(runningMatchData.innings[0].first_bat){
  //       let alloutteam1 = teamsDetailData.team1.batsman.filter((item) => item.wickets.kind.length === 0)
  //       if((teamsDetailData.team1.batsman.length === runningMatchData.team1.players.length && alloutteam1.length === 1)
  //         || getApproxOvers(runningMatchData.innings[0].overs_played) === runningMatchData.match_settings.no_of_overs){
  //         isTrue = true
  //       }
  //     }else{
  //       let alloutteam2 = teamsDetailData.team2.batsman.filter((item) => item.wickets.kind.length === 0)
  //       if((teamsDetailData.team2.batsman.length === runningMatchData.team2.players.length && alloutteam2.length === 1)
  //         || getApproxOvers(runningMatchData.innings[1].overs_played) === runningMatchData.match_settings.no_of_overs){
  //         isTrue = true
  //       }
  //     }
  //   }
  //   return isTrue
  // }

  const checkInningsNumber = () => {
    let isTrue = false
    if(Object.keys(runningMatchData).length > 0){
      if(runningMatchData.innings[0].first_bat){
        if(runningMatchData.innings[1].batted_team_id === battingTeam.team_id){
            isTrue = true
        }
      }else{
        if(runningMatchData.innings[0].batted_team_id === battingTeam.team_id){
          isTrue = true
      }
      }
    }
    return isTrue
  }

  const handleSubmit = async () => {
    if (Object.values(state).includes("")) {
      toast.error("Please Select Players");
    } else {
        dispatch(striker(state.striker))
        dispatch(non_striker(state.non_striker))
        dispatch(bowler(state.bowler))
        handleStartGame(state)
    }
  };
  const startNewInnings = async () => {
    if (Object.values(state).includes("")) {
      toast.error("Please Select Players");
    } else {
        dispatch(striker(state.striker))
        dispatch(non_striker(state.non_striker))
        dispatch(bowler(state.bowler))
        udpateInning(state)
    }
  };

  return (
    <SimpleCard>
      {/* <div className="w-25 mb-2">
      </div> */}

      <div className="row">
        <div className="col-4">
          <h6 className="mb-3">Batting - {battingTeam?.team_name}</h6>
          <div className="row">
            <div className="col-6 mb-3">
              <div
                className=" d-flex justify-content-center align-items-center position-relative"
                style={boxStyle}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                  }}
                >
                  {state?.striker && (
                    <MdCancel
                      className="fs-4 text-danger"
                      onClick={() => setState({ ...state, striker: "" })}
                    />
                  )}{" "}
                </div>
                {state?.striker && state?.striker?.img ? (
                  <img
                    src={state.striker.img}
                    className="w-100 h-100"
                    alt="img"
                  />
                ) : state?.striker?.players_name ? (
                  state?.striker?.players_name
                ) : (
                  <div>
                    <TiPlus style={{ fontSize: "30px" }} />
                    <br />
                    <h6>Select Striker</h6>
                  </div>
                )}
              </div>
            </div>
            <div className="col-6 mb-3">
              <div
                className=" d-flex justify-content-center align-items-center position-relative"
                style={boxStyle}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                  }}
                >
                  {state?.non_striker && (
                    <MdCancel
                      className="fs-4 text-danger"
                      onClick={() => setState({ ...state, non_striker: "" })}
                    />
                  )}{" "}
                </div>
                {state?.non_striker && state?.non_striker?.img ? (
                  <img
                    src={state.non_striker.img}
                    className="w-100 h-100"
                    alt="img"
                  />
                ) : state?.non_striker?.players_name ? (
                  state?.non_striker?.players_name
                ) : (
                  <div>
                    <TiPlus style={{ fontSize: "30px" }} />
                    <br />
                    <h6>Select Non Striker</h6>
                  </div>
                )}
              </div>
            </div>

            <h6 className="mb-3">Bowling - {bowlingTeam?.team_name}</h6>

            <div className="col-6">
              <div
                className="d-flex justify-content-center align-items-center position-relative"
                style={boxStyle}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                  }}
                >
                  {state?.bowler && (
                    <MdCancel
                      className="fs-4 text-danger"
                      onClick={() => setState({ ...state, bowler: "" })}
                    />
                  )}{" "}
                </div>
                {state?.bowler && state?.bowler?.img ? (
                  <img
                    src={state.bowler.img}
                    className="w-100 h-100"
                    alt="img"
                  />
                ) : state?.bowler?.players_name ? (
                  state?.bowler?.players_name
                ) : (
                  <div>
                    <TiPlus style={{ fontSize: "30px" }} />
                    <br />
                    <h6>Select Bowler</h6>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12">
              {checkInningsNumber() && 
              <Button
                variant="contained"
                className="bg-dark text-white m-auto rounded d-block p-2 w-100 mt-4 fw-bold"
                onClick={() => startNewInnings()}
              >
                START NEW INNINGS
              </Button>
              ||
              <Button
                variant="contained"
                className="bg-dark text-white m-auto rounded d-block p-2 w-100 mt-4 fw-bold"
                onClick={() => handleSubmit()}
              >
                START INNINGS
              </Button>
              }
            </div>
          </div>
        </div>

        <div className="col-8">
          <div
            className="p-2 rounded"
            style={{ boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.25)" }}
          >
            <h5 className="mt-3 ms-2 mb-3">{battingTeam?.team_name} Team </h5>

            <div className="d-flex flex-wrap  text-center ms-2 gap-3">
              {battingTeam.players && battingTeam.players.length > 0 && battingTeam.players.map((item,index) => {
                return (
                  <div key={index}
                    onClick={() => {
                      if(state?.striker){
                        if(state.striker.players_id !== item.players_id){
                          setState({ ...state, non_striker: item })
                        }
                      }else{
                        if(state.non_striker.players_id !== item.players_id){
                          setState({ ...state, striker: item })
                        }
                      }
                      // state?.striker
                      // ? (state.striker.players_id !== item.players_id)
                      // ? setState({ ...state, non_striker: item })
                      // : null
                      // : setState({ ...state, striker: item })
                    }}
                  >
                    {(item?.img && (
                      <img
                        src={item?.img}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )) || (
                      <img
                        src={logo}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <h6 className="mt-3" style={{ fontSize: "12px" }}>
                      {item.players_name}
                    </h6>
                  </div>
                );
              })}
            </div>
            <h5 className=" ms-2 mt-3 mb-3">{bowlingTeam?.team_name} Team</h5>

            <div className="d-flex flex-wrap mb-5 text-center ms-2 gap-3">
              {bowlingTeam.players && bowlingTeam.players.length > 0 && bowlingTeam.players.map((item,index) => {
                return (
                  <div onClick={() => setState({ ...state, bowler: item })} key={index}>
                    {(item?.img && (
                      <img
                        src={item?.img}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )) || (
                      <img
                        src={logo}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <h6 className="mt-3" style={{ fontSize: "12px" }}>
                      {item.players_name}
                    </h6>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SimpleCard>
  );
};

export default MatchOpener;
