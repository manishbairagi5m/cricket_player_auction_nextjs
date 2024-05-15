import React, { useEffect, useState } from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import io from "socket.io-client";


const ENDPOINT = process.env.REACT_APP_SOCKET_URL;
// const socket = io(ENDPOINT, {path: "/socket",autoConnect: false})
const socket = io(ENDPOINT, {path: "/socket", transports: ['websocket',"polling"]})
// const socket = io(ENDPOINT, {path: "/socket"})


const MatchLive = (props) => {
  const { setRunningMatchData,teamsDetailData,getBothTeamDetailedData,runningMatchData,team } = props
  const [battingTeam, setBattingTeam] = useState({});
  const [curPlayer, setCurPlayer] = useState({
    striker:{},
    non_striker:{},
    bowler:{},
  });
  const imagePath = process.env.REACT_APP_IMG_URL;

  const color = {
    0: { backgroundColor: "#EDEDED", color: "black" },
    4: { backgroundColor: "#6A6C70", color: "white" },
    6: { backgroundColor: "#265AF5", color: "white" },
    OUT: { backgroundColor: "#A00D00", color: "white" },
    default: { backgroundColor: "#DADADA", color: "black" },
  };
  const fontStyle = { fontFamily: "Inter-Bold" };
  const fontStyle1 = {
    fontFamily: "Inter-Bold",
    width: "50px",
    height: "50px",
  };

  /******** socket */
	const handleMatchData = (matchdata) => {
    getBothTeamDetailedData(matchdata)
		setRunningMatchData(matchdata)
    getCurrentInning(matchdata)
	}
	useEffect(() => {
    socket.on(`matchDetails/${runningMatchData._id}`, (data) => {
      console.log(data,'socket run')
      handleMatchData(data.data)
    });
  },[])

  if(battingTeam?.batting_team && runningMatchData?.team1){
    document.title = `${battingTeam.batting_team.split(" ")[0]}  ${battingTeam.runs_scored}/${battingTeam.wickets_lost} (${battingTeam.overs_played}) vs ${
      battingTeam.batted_team_id === runningMatchData.team1.team_id ? runningMatchData.team2.team_name : runningMatchData.team1.team_name}`
  }

  useEffect(() => {
    getCurrentInning(runningMatchData)
  }, [])
  

	/******** socket */
  let teamLogo = team?.length > 0 && (team.filter((item1) => item1.team_id === battingTeam.batted_team_id))[0]


  const getBatsmanFromOvers = (matchdata) => {
    let over = matchdata.overs[matchdata.overs.length-1]
    if(over.deliveries.length === 0){
      over = matchdata.overs[matchdata.overs.length-2]
    }
    let deliveries = over.deliveries[over.deliveries.length - 1];
    if(deliveries?.wicket){
      if(deliveries.wicket.players_id === deliveries.non_striker.players_id){
        setCurPlayer({striker:deliveries.striker,
                non_striker:matchdata?.outcome ? null : matchdata.batsman[matchdata.batsman.length-1],
                bowler:deliveries.bowler});
      }else{
        setCurPlayer({striker:matchdata?.outcome ? null : matchdata.batsman[matchdata.batsman.length-1],
          non_striker:deliveries.non_striker,
          bowler:deliveries.bowler});
      }
    }else{
      let evens = [0,2,4,6]
      let odds = [1,3,5,7]
      let ball = String(Number(deliveries.over).toFixed(1))
      let totalrun = Number(deliveries.runs) + (deliveries?.extra?.run && Number(deliveries.extra.run) || 0)
      if(Number(ball.split(".")[1]) === 6 && (deliveries.extra.run_type === "" || deliveries.extra.run_type === "LB" || deliveries.extra.run_type === "BYE")){
        if(evens.includes(totalrun)){
          setCurPlayer({striker:deliveries.non_striker,
            non_striker:deliveries.striker,
            bowler:deliveries.bowler});
        }else{
          setCurPlayer({striker:deliveries.striker,
            non_striker:deliveries.non_striker,
            bowler:deliveries.bowler});    
        }
      }
      else{
        if(odds.includes(totalrun)){
          setCurPlayer({striker:deliveries.non_striker,
            non_striker:deliveries.striker,
            bowler:deliveries.bowler});
        }else{
          setCurPlayer({striker:deliveries.striker,
            non_striker:deliveries.non_striker,
            bowler:deliveries.bowler});    
        }
      }
    }
  }

  const getCurrentInning = (matchdata) => {
    let curinning = matchdata.innings[0].first_bat
    ? matchdata.innings[1].batsmen.length > 0
    ? matchdata.innings[1]
    : matchdata.innings[0]
    : matchdata.innings[0].batsmen.length > 0
    ? matchdata.innings[0]
    : matchdata.innings[1]
    setBattingTeam(curinning)
      if (matchdata.overs.length > 0) {
        if(matchdata.innings[0].first_bat){
          if(matchdata.innings[1].batsmen.length > 0 && matchdata.innings[1].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)}
          else if(matchdata.innings[1].batsmen.length > 0){
            setCurPlayer({striker:matchdata.innings[0].batsmen[0],
              non_striker:matchdata.innings[0].batsmen[1],
              bowler:matchdata.innings[0].bowlers[0]});
          }
          else if(matchdata.innings[0].batsmen.length > 0 && matchdata.innings[0].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)
          }
          else{
            setCurPlayer({striker:matchdata.innings[0].batsmen[0],
              non_striker:matchdata.innings[0].batsmen[1],
              bowler:matchdata.innings[0].bowlers[0]});
          }
        }else{
          if(matchdata.innings[0].batsmen.length > 0 && matchdata.innings[0].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)
          }
          else if(matchdata.innings[0].batsmen.length > 0){
            setCurPlayer({striker:matchdata.innings[0].batsmen[0],
              non_striker:matchdata.innings[0].batsmen[1],
              bowler:matchdata.innings[0].bowlers[0]});
          }
          else if(matchdata.innings[1].batsmen.length > 0 && matchdata.innings[1].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)
          }
          else{
            setCurPlayer({striker:matchdata.innings[1].batsmen[0],
              non_striker:matchdata.innings[1].batsmen[1],
              bowler:matchdata.innings[1].bowlers[0]});
          }
        }
        } else {
          let curInning = matchdata.innings[0].first_bat ? matchdata.innings[0] : matchdata.innings[1]
          setCurPlayer({striker:curInning.batsmen[0],
            non_striker:curInning.batsmen[1],
            bowler:curInning.bowlers[0]});
        }
  }
// to get all data of striker ,non striker,current bowler by manish 
 
const getPlayerData = (playerdata,type) => {
    let data = ""
    let teamtype = ["team1","team2"]
    if(Object.keys(teamsDetailData).length > 0){
      for(let i=0;i<teamtype.length;i++){
        for(let j=0;j<teamsDetailData[teamtype[i]][type].length;j++){
          if(playerdata?.players_id === teamsDetailData[teamtype[i]][type][j]?.players_id)
            data = teamsDetailData[teamtype[i]][type][j]
        }
      }
    }
    return data
  }
// to get all data of striker ,non striker,current bowler by manish 



const getApproxOvers = (overs) => {
  return (String(overs).split(".")[1] === "6" && Number(String(overs).split(".")[0])+1 || overs)
}

  return (
    <Grid container spacing={3}>
      <Grid item lg={5} md={6} sm={12} xs={12}>
        <div className="my-card p-3">
          <div className="d-flex justify-content-between">
            <div>
              <img
                src={imagePath+teamLogo?.team_logo}
                className="me-2 rounded-circle"
                style={{
                  width: 30,
                  height: 30,
                  objectFit: "cover",
                }}
              />
              {battingTeam?.batting_team},
              {runningMatchData.innings[0].first_bat 
              ? runningMatchData.innings[1].batsmen.length > 0 
              ? " 2nd Inning"
              : " 1st Inning"
              : runningMatchData.innings[0].batsmen.length > 0
              ? " 2nd Inning"
              : " 1st Inning" }
            </div>
            CRR
          </div>
          <div
            className="d-flex justify-content-between fs-5 mt-2"
            style={fontStyle}
          >
            <div style={fontStyle}>{battingTeam.runs_scored} - {battingTeam.wickets_lost} ({getApproxOvers(battingTeam?.overs_played)} 
              )</div>
            <div style={fontStyle}>{battingTeam?.run_rate}</div>
          </div>
        </div>
      </Grid>
      <Grid item lg={7} md={6} sm={12} xs={12}>
        <div className="my-card p-3 pb-2 overflow-auto">
          <div className="d-flex align-items-center">
            <span className="me-2">This Over</span>
            {runningMatchData?.overs?.length > 0 && runningMatchData.overs[runningMatchData.overs.length-1].deliveries.length > 0
            && runningMatchData.overs[runningMatchData.overs.length-1].deliveries.map((item,index) => {
              let keyitem = item?.wicket ? color["OUT"] : color[item.runs] ? color[item.runs] : color["default"];
              return (
                <div className="text-center ms-2 h-100" key={index}>
                  <div
                    className="rounded-circle p-1 d-flex justify-content-center align-items-center"
                    style={{ ...fontStyle1, ...keyitem }}
                  >
                    {item?.wicket ? "W" : item?.extra?.run ? item?.extra?.run : item.runs}
                  </div>
                  <div style={{ opacity: (item?.extra.run_type && 1) || 0 }}>
                    {item?.extra.run_type || "-"}
                  </div>
                </div>
              );
            }) || 
            <div className="text-center ms-2 h-100">
            <div style={{ ...fontStyle1 }}
              className="rounded-circle p-1 d-flex justify-content-center align-items-center opacity-0"
            >0
            </div>
            <div className="opacity-0">0
            </div>
          </div>
            }
          </div>
        </div>
      </Grid>
      <Grid item lg={12} md={6} sm={12} xs={12}>
        <Table className="mui-table my-card" width="100%" overflow="auto">
          <TableHead
            className="table-head"
            sx={{ borderBottom: "2px solid #DADADA" }}
          >
            <TableRow>
              <TableCell className="text-primary fw-bold w-50 ps-3">
                Batsman
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Run
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Ball
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                4s
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                6s
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                SR
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ "& td": { border: 0 } }}>
              <TableCell className="ps-3 fw-bold">{
              getPlayerData(curPlayer.striker,'batsman').players_name}
              *</TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.striker,'batsman').runs_scored}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.striker,'batsman').balls_faced}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.striker,'batsman').fours}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.striker,'batsman').sixes}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.striker,'batsman').strike_rate}
              </TableCell>
            </TableRow>
            <TableRow >
              <TableCell className="ps-3 fw-bold">{
              getPlayerData(curPlayer.non_striker,'batsman').players_name}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.non_striker,'batsman').runs_scored}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.non_striker,'batsman').balls_faced}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.non_striker,'batsman').fours}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.non_striker,'batsman').sixes}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.non_striker,'batsman').strike_rate}
              </TableCell>
            </TableRow>
          
          </TableBody>
        </Table>
      </Grid>

      <Grid item lg={12} md={6} sm={12} xs={12}>
        <Table className="mui-table my-card" width="100%" overflow="auto">
          <TableHead
            className="table-head"
            sx={{ borderBottom: "2px solid #DADADA" }}
          >
            <TableRow>
              <TableCell className="text-primary fw-bold w-50 ps-3">
                Bowler
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Over
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Maiden
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Run
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Wicket
              </TableCell>
              <TableCell align="center" className="text-primary fw-bold">
                Economy
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className="ps-3 fw-bold">
              {getPlayerData(curPlayer.bowler,'bowler').players_name}
                </TableCell>
              <TableCell align="center" className="fw-bold">
              {getApproxOvers(getPlayerData(curPlayer.bowler,'bowler').overs_bowled)}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.bowler,'bowler').maiden}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.bowler,'bowler').runs_conceded}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.bowler,'bowler').wickets_taken}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(curPlayer.bowler,'bowler').economy_rate}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

    </Grid>
  );
};

export default MatchLive;
