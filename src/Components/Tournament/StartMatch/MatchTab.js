import React, { useState, useEffect } from "react";
import TodayMatch from "./TodayMatch";
import MatchDetail from "./MatchDetail";
import PlayingXI from "./PlayingXI";
import MatchToss from "./MatchToss";
import MatchOpener from "./MatchOpener";
import MatchScoring from "./MatchScoring";
import { getTeamList } from "@/customApi/tournament";
import { useSelector, useDispatch } from "react-redux";
import * as scoreHelpler from "./scoring/scoreHelper";
import {
  createMatch,
  getMatchData,
  changeInnings,
} from "@/customApi/tournament";
import {
  match_id,
  toss,
  match_settings,
  striker,
  non_striker,
  bowler,
} from "@/lib/slice/matchSlice";
import {
  runs,
  overs,
  innings,
  resetScore,
} from "@/lib/slice/scoreSlice";
import { useRouter } from "next/router";

const MatchTab = ({ state }) => {
  const [matchValue, setMatchValue] = useState("today_match");
  const [matchData, setMatchData] = useState({});
  const [startMatchData, setStartMatchData] = useState({});
  const [team, setTeam] = useState([]);
  const [teamsDetailData, setTeamsDetailData] = useState({
    team1: { batsman: [], bowler: [] },
    team2: { batsman: [], bowler: [] },
  });
  const [team_A_Players, setTeamAPlayer] = useState([]);
  const [battingTeamLogo, setBattingTeamLogo] = useState("");
  const [team_B_Players, setTeamBPlayer] = useState([]);
  const [battingTeam, setBattingTeam] = useState(null);
  const [bowlingTeam, setBowlingTeam] = useState(null);
  const [firstBat, setFirstBat] = useState(null);
  const [runningMatchData, setRunningMatchData] = useState({});
  const statedata = useSelector((state) => state.match);
  const dispatch = useDispatch();
  const router = useRouter();
// console.log(team,'team')

  const setBatBallTeam = (statetoss) => {
    if (
      (statetoss.won_by === statedata.team1.team_id &&
        statetoss.choose === "BAT") ||
      (statetoss.won_by === statedata.team2.team_id &&
        statetoss.choose === "BALL")
    ) {
      // Bat First
      setFirstBat(statedata.team1);
      let team1Data = team.filter((item)=> item.team_id === statedata.team1.team_id)[0].team_logo
      setBattingTeamLogo(team1Data)
      setBattingTeam(arrangePalyers(statedata.team1, "team1"));
      setBowlingTeam(arrangePalyers(statedata.team2, "team2"));
    } else if (
      (statetoss.won_by === statedata.team1.team_id &&
        statetoss.choose === "BALL") ||
      (statetoss.won_by === statedata.team2.team_id &&
        statetoss.choose === "BAT")
    ) {
      // Ball First
      setFirstBat(statedata.team2);
      let team2Data = team.filter((item)=> item.team_id === statedata.team2.team_id)[0].team_logo
      setBattingTeamLogo(team2Data)
      setBattingTeam(arrangePalyers(statedata.team2, "team2"));
      setBowlingTeam(arrangePalyers(statedata.team1, "team1"));
    }
  };

  const arrangePalyers = (teamArr, team) => {
    let finalRes = {
      team_id: teamArr.team_id,
      team_name: teamArr.team_name,
      players: [],
    };
    if (team === "team1") {
      let players = teamArr.players.map((item) => {
        let a = team_A_Players.find((x) => x._id === item);
        return { players_id: a._id, players_name: a.name };
      });
      finalRes.players = players;
    } else {
      let players = teamArr.players.map((item) => {
        let a = team_B_Players.find((x) => x._id === item);
        return { players_id: a._id, players_name: a.name };
      });
      finalRes.players = players;
    }
    return finalRes;
  };

  const getDetail = async () => {
    let params = { tournament_id: router.query.id };
    await getTeamList(params).then((res) => {
      if (res?.status) {
        setTeam(res?.data);
      }
    });
  };

  useEffect(() => {
    getDetail();
  }, []);

  const handleStartGame = (strikedata) => {
    let finalReq = JSON.parse(JSON.stringify(statedata));
    finalReq.team1 = arrangePalyers(finalReq.team1, "team1");
    finalReq.team2 = arrangePalyers(finalReq.team2, "team2");
    finalReq.batsman = manageOpnerBatsman(strikedata);
    finalReq.bowler = manageBowler(strikedata);

    let innOj1 = { ...scoreHelpler.inningObj };
    let innOj2 = { ...scoreHelpler.inningObj };

    innOj1.batted_team_id = statedata.team1.team_id;
    innOj1.batting_team = statedata.team1.team_name;

    innOj2.batted_team_id = statedata.team2.team_id;
    innOj2.batting_team = statedata.team2.team_name;

    if (firstBat.team_id === statedata.team1.team_id) {
      innOj1.first_bat = true;
      // innOj1.striker_id = strikedata.striker.players_id
      // innOj1.non_striker_id = strikedata.non_striker.players_id
      // innOj1.current_bowler_id = strikedata.bowler.players_id
    }

    if (firstBat.team_id === statedata.team2.team_id) {
      innOj2.first_bat = true;
      // innOj2.striker_id = strikedata.striker.players_id
      // innOj2.non_striker_id = strikedata.non_striker.players_id
      // innOj2.current_bowler_id = strikedata.bowler.players_id
    }

    if (battingTeam.team_id === statedata.team1.team_id) {
      innOj1.batsmen = [
        {
          players_id: strikedata.striker.players_id,
          players_name: strikedata.striker.players_name,
        },
        {
          players_id: strikedata.non_striker.players_id,
          players_name: strikedata.non_striker.players_name,
        },
      ];
      innOj1.bowlers = [
        {
          players_id: strikedata.bowler.players_id,
          players_name: strikedata.bowler.players_name,
        },
      ];
      innOj1.striker_id = strikedata.striker.players_id
      innOj1.non_striker_id = strikedata.non_striker.players_id
      innOj1.current_bowler_id = strikedata.bowler.players_id
    }

    if (battingTeam.team_id === statedata.team2.team_id) {
      innOj2.batsmen = [
        {
          players_id: strikedata.striker.players_id,
          players_name: strikedata.striker.players_name,
        },
        {
          players_id: strikedata.non_striker.players_id,
          players_name: strikedata.non_striker.players_name,
        },
      ];
      innOj2.bowlers = [
        {
          players_id: strikedata.bowler.players_id,
          players_name: strikedata.bowler.players_name,
        },
      ];
      innOj2.striker_id = strikedata.striker.players_id
      innOj2.non_striker_id = strikedata.non_striker.players_id
      innOj2.current_bowler_id = strikedata.bowler.players_id
    }

    finalReq.innings = [innOj1, innOj2];
    finalReq.fixture_id = matchData._id;
    finalReq.batted_team_id = firstBat.team_id;
    delete finalReq.striker;
    delete finalReq.non_striker;

    try {
      createMatch(finalReq).then((res) => {
        if (res?.status) {
          dispatch(match_id(res.data._id));
          setRunningMatchData(res.data)
          setMatchValue("match_scoring");
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const udpateInning = (strikedata) => {
    let finalReq = {
      id: statedata.match_id,
      batsman: {},
      bowler: {},
      innings: {},
    };
    finalReq.batsman = manageOpnerBatsman(strikedata);
    finalReq.bowler = manageBowler(strikedata);

    let innOj1 = { ...scoreHelpler.inningObj };

    innOj1.batted_team_id = battingTeam.team_id;
    innOj1.batting_team = battingTeam.team_name;

    innOj1.batsmen = [
      {
        players_id: strikedata.striker.players_id,
        players_name: strikedata.striker.players_name,
      },
      {
        players_id: strikedata.non_striker.players_id,
        players_name: strikedata.non_striker.players_name,
      },
    ];
    innOj1.bowlers = [
      {
        players_id: strikedata.bowler.players_id,
        players_name: strikedata.bowler.players_name,
      },
    ];
    innOj1.striker_id = strikedata.striker.players_id
    innOj1.non_striker_id = strikedata.non_striker.players_id
    innOj1.current_bowler_id = strikedata.bowler.players_id
    finalReq.innings = innOj1;
    finalReq.batted_team_id = battingTeam.team_id;

    try {
      changeInnings(finalReq).then((res) => {
        if (res?.status) {
          setMatchValue("match_scoring");
          getCurrentMatchData(res.data[2])
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const manageOpnerBatsman = (strikedata1) => {
    let firstBatsman = scoreHelpler.batsManObj();
    let secondBatsman = scoreHelpler.batsManObj();
    firstBatsman.players_id = strikedata1.striker.players_id;
    firstBatsman.players_name = strikedata1.striker.players_name;
    firstBatsman.team_id = battingTeam.team_id;
    firstBatsman.batting_order = 1
    secondBatsman.players_id = strikedata1.non_striker.players_id;
    secondBatsman.players_name = strikedata1.non_striker.players_name;
    secondBatsman.team_id = battingTeam.team_id;
    secondBatsman.batting_order = 2

    // by manish to set team batsman all data
    let newdata = { ...teamsDetailData };
    newdata.team1.batsman = [{ ...firstBatsman }, { ...secondBatsman }];
    setTeamsDetailData(newdata);
    // by manish
    return [firstBatsman, secondBatsman];
  };
  const manageBowler = (strikedata1) => {
    let bowlerObj = scoreHelpler.bowlerObj();
    bowlerObj.players_id = strikedata1.bowler.players_id;
    bowlerObj.players_name = strikedata1.bowler.players_name;
    bowlerObj.team_id = bowlingTeam.team_id
    // by manish to set team bowler all data
    let newdata = { ...teamsDetailData };
    newdata.team2.bowler = [{ ...bowlerObj }];
    setTeamsDetailData(newdata);
    // by manish
    return bowlerObj;
  };

  const changeMatchInnings = () => {
    dispatch(resetScore());
    setBattingTeam(bowlingTeam);
    setBowlingTeam(battingTeam);
  };


// for getting current batsman from over last delivery or batsman array
  const getBatsmanFromOvers = (matchdata) => {
    // let deliveries =
    // matchdata.overs[matchdata.overs.length - 1].deliveries[
    //   matchdata.overs[matchdata.overs.length - 1].deliveries.length - 1
    // ];
    let over = matchdata.overs[matchdata.overs.length-1]
    if(over.deliveries.length === 0){
      over = matchdata.overs[matchdata.overs.length-2]
    }
    let deliveries = over.deliveries[over.deliveries.length - 1];
    dispatch(bowler(deliveries.bowler));
    if(deliveries?.wicket){
      if(deliveries.wicket.players_id === deliveries.non_striker.players_id){
        dispatch(non_striker(matchdata.batsman[matchdata.batsman.length-1]));
        dispatch(striker(deliveries.striker));
      }else{
        dispatch(striker(matchdata.batsman[matchdata.batsman.length-1]));
        dispatch(non_striker(deliveries.non_striker));
      }
    }else{
      let evens = [0,2,4,6]
      let odds = [1,3,5,7]
      let ball = String(Number(deliveries.over).toFixed(1))
      let totalrun = Number(deliveries.runs) + (deliveries?.extra?.run && Number(deliveries.extra.run) || 0)
      if(Number(ball.split(".")[1]) === 6 && (deliveries.extra.run_type === "" || deliveries.extra.run_type === "LB" || deliveries.extra.run_type === "BYE")){
        if(evens.includes(totalrun)){
          dispatch(striker(deliveries.non_striker));
          dispatch(non_striker(deliveries.striker));     
        }else{
          dispatch(striker(deliveries.striker));
          dispatch(non_striker(deliveries.non_striker));    
        }
      }
      else{
        if(odds.includes(totalrun)){
          dispatch(striker(deliveries.non_striker));
          dispatch(non_striker(deliveries.striker));     
        }else{
          dispatch(striker(deliveries.striker));
          dispatch(non_striker(deliveries.non_striker));    
        }
      }
    }
  }


  // for re set match data from match object when resume or undo
  const getCurrentMatchData = async (matchdata) => {
    if (matchdata?.innings?.length > 0) {
      setRunningMatchData(matchdata)
      setMatchValue("match_scoring");
      dispatch(match_id(matchdata._id));
      dispatch(toss({ ...matchdata.toss }));
      dispatch(match_settings({ ...matchdata.match_settings }));
      dispatch(overs(matchdata.overs));
      let curInning = matchdata.innings[0].first_bat 
      ? matchdata.innings[1].batsmen.length > 0 
      ? matchdata.innings[1] 
      : matchdata.innings[0] 
      : matchdata.innings[0].batsmen.length > 0 
      ? matchdata.innings[0]
      : matchdata.innings[1]
        dispatch(innings(curInning));
        dispatch(
          runs({
            totalRun: Number(curInning.runs_scored),
            batsmanRun: "",
          })
        );
      if (matchdata.overs.length > 0) {
        if(matchdata.innings[0].first_bat){
          if(matchdata.innings[1].batsmen.length > 0 && matchdata.innings[1].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)}
          else if(matchdata.innings[1].batsmen.length > 0){
            dispatch(striker(matchdata.innings[1].batsmen[0]));
            dispatch(non_striker(matchdata.innings[1].batsmen[1]));
            dispatch(bowler(matchdata.innings[1].bowlers[0]));
          }
          else if(matchdata.innings[0].batsmen.length > 0 && matchdata.innings[0].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)
          }
          else{
            dispatch(striker(matchdata.innings[0].batsmen[0]));
            dispatch(non_striker(matchdata.innings[0].batsmen[1]));
            dispatch(bowler(matchdata.innings[0].bowlers[0]));
          }
        }else{
          if(matchdata.innings[0].batsmen.length > 0 && matchdata.innings[0].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)
          }
          else if(matchdata.innings[0].batsmen.length > 0){
            dispatch(striker(matchdata.innings[0].batsmen[0]));
            dispatch(non_striker(matchdata.innings[0].batsmen[1]));
            dispatch(bowler(matchdata.innings[0].bowlers[0]));
          }
          else if(matchdata.innings[1].batsmen.length > 0 && matchdata.innings[1].batted_team_id === matchdata.overs[matchdata.overs.length-1].batted_team_id){
            getBatsmanFromOvers(matchdata)
          }
          else{
            dispatch(striker(matchdata.innings[1].batsmen[0]));
            dispatch(non_striker(matchdata.innings[1].batsmen[1]));
            dispatch(bowler(matchdata.innings[1].bowlers[0]));
          }
        }
        } else {
          let curInning = matchdata.innings[0].first_bat ? matchdata.innings[0] : matchdata.innings[1]
          dispatch(striker(curInning.batsmen[0]));
          dispatch(non_striker(curInning.batsmen[1]));
          dispatch(bowler(curInning.bowlers[0]));
        }
        let team1Data = team.filter((item)=> item.team_id === matchdata.team1.team_id)[0].team_logo
        let team2Data = team.filter((item)=> item.team_id === matchdata.team2.team_id)[0].team_logo

        if (matchdata.innings[0].first_bat) {
        if(matchdata.innings[1].batsmen.length > 0){
          setBattingTeamLogo(team2Data)
          setBattingTeam(matchdata.team2);
          setBowlingTeam(matchdata.team1);
        }else{
          setBattingTeamLogo(team1Data)
          setBattingTeam(matchdata.team1);
          setBowlingTeam(matchdata.team2);
        }
      } else {
        if(matchdata.innings[0].batsmen.length > 0){
          setBattingTeamLogo(team1Data)
          setBattingTeam(matchdata.team1);
          setBowlingTeam(matchdata.team2);
        }else{
          setBattingTeamLogo(team2Data)
          setBattingTeam(matchdata.team2);
          setBowlingTeam(matchdata.team1);
        }
      }
      getBothTeamDetailedData(matchdata);
    }
  };

  // to get both team batsman bowler full detailed data team wise 
  const getBothTeamDetailedData = (matchdata) => {
    let newdata = {  team1: { batsman: [], bowler: [] },team2: { batsman: [], bowler: [] }, };
    let type = ["batsman", "bowler"];
    for (let k = 0; k < type.length; k++) {
      for (let i = 0; i < matchdata[type[k]].length; i++) {
        for (let j = 0; j < matchdata.team1.players.length; j++) {
          if (
            matchdata.team1.players[j].players_id ===
            matchdata[type[k]][i].players_id
          ) {
            newdata.team1[type[k]].push(matchdata[type[k]][i]);
          }
        }
        for (let j = 0; j < matchdata.team2.players.length; j++) {
          if (
            matchdata.team2.players[j].players_id ===
            matchdata[type[k]][i].players_id
          ) {
            newdata.team2[type[k]].push(matchdata[type[k]][i]);
          }
        }
      }
    }
    setTeamsDetailData(newdata);
  };

  return (
    <>
      {matchValue === "today_match" ? (
        <TodayMatch
          setMatchValue={setMatchValue}
          setMatchData={setMatchData}
          team={team}
          setTeamAPlayer={setTeamAPlayer}
          setTeamBPlayer={setTeamBPlayer}
          getCurrentMatchData={getCurrentMatchData}
        />
      ) : matchValue === "match_detail" ? (
        <MatchDetail
          setMatchValue={setMatchValue}
          matchData={matchData}
          state={state}
          statedata={statedata}
          setStartMatchData={setStartMatchData}
          startMatchData={startMatchData}
          team={team}
        />
      ) : matchValue === "playing_xi" ? (
        <PlayingXI
          setMatchValue={setMatchValue}
          state={state}
          team_A_Players={team_A_Players}
          team_B_Players={team_B_Players}
        />
      ) : matchValue === "match_toss" ? (
        <MatchToss
          setMatchValue={setMatchValue}
          setStartMatchData={setStartMatchData}
          startMatchData={startMatchData}
          setBatBallTeam={setBatBallTeam}
        />
      ) : matchValue === "match_opening" ? (
        <MatchOpener
          battingTeam={battingTeam}
          bowlingTeam={bowlingTeam}
          handleStartGame={handleStartGame}
          udpateInning={udpateInning}
          runningMatchData={runningMatchData}
          teamsDetailData={teamsDetailData}
        />
      ) : matchValue === "match_scoring" ? (
        <MatchScoring
          battingTeam={battingTeam}
          battingTeamLogo={battingTeamLogo}
          bowlingTeam={bowlingTeam}
          changeMatchInnings={changeMatchInnings}
          setMatchValue={setMatchValue}
          teamsDetailData={teamsDetailData}
          getBothTeamDetailedData={getBothTeamDetailedData}
          getCurrentMatchData={getCurrentMatchData}
          runningMatchData={runningMatchData}
          setRunningMatchData={setRunningMatchData}
          team={team}
          team_A_Players={team_A_Players}
          team_B_Players={team_B_Players}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default MatchTab;
