import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Slide,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { runs, overs, innings } from "@/lib/slice/scoreSlice";
import { striker,non_striker,bowler } from "@/lib/slice/matchSlice";
import { updateMatch, wicket, updateRun, addNextBatsman, addNextBowler,undoData  } from "@/customApi/tournament";
import * as scoreHelpler from '@/Components/Tournament/StartMatch/scoring/scoreHelper'
import ExtraRun from "@/Components/Tournament/StartMatch/scoring/ScoreDialog/ExtraRun";
import NewbatsMan from "@/Components/Tournament/StartMatch/scoring/ScoreDialog/NewBatsMan";
import NewBowler from "@/Components/Tournament/StartMatch/scoring/ScoreDialog/NewBowler";
import Out from "@/Components/Tournament/StartMatch/scoring/ScoreDialog/Out";
import EndMatch from "@/Components/Tournament/StartMatch/scoring/ScoreDialog/EndMatch";
import ChangeInning from "@/Components/Tournament/StartMatch/scoring/ScoreDialog/ChangeInning";
import io from "socket.io-client";
import { scoreFunctions } from "@/Components/Tournament/StartMatch/scoring/scoreFunctions";
import Image from "next/image";

const wideNoBallRun = 1

const ENDPOINT = process.env.REACT_APP_SOCKET_URL;
// const socket = io(ENDPOINT, {path: "/socket",autoConnect: false})
const socket = io(ENDPOINT, {path: "/socket", transports: ['websocket',"polling"]})
// const socket = io(ENDPOINT, {path: "/socket"})
// io.connect(url, {
//   "transports": ['websocket']
// })





const MatchLive = (props) => {
  const { batting, bowling,changeMatchInnings,setMatchValue,setRunningMatchData,teamsDetailData,getCurrentMatchData,
    getBothTeamDetailedData,runningMatchData,battingTeamLogo } = props
  const matchState = useSelector(state => state.match)
	const scoreState = useSelector(state => state.score)
  const dispatch = useDispatch()
  const [extraRunType, setExtraRunType] = useState();
  const [loader, setLoader] = useState(false);
	const [openExtraRunDialog, setOpenExtraRunDialog] = useState(false);
	const [openEndMatchDialog, setOpenEndMatchDialog] = useState(false);
	const [openChangeInningDialog, setOpenChangeInningDialog] = useState(false);
	const [openOutDialog, setOpenOutDialog] = useState(false);
	const [openNewBatDialog, setOpenNewBatDialog] = useState(false);
	const [openNewBowlerDialog, setOpenNewBowlerDialog] = useState(false);
	const [undoEnable, setUndoEnable] = useState(true);
  const imagePath = process.env.REACT_APP_IMG_URL;
	const handleClickOpen = (type) => {
    if(checkIsInningCompleted(runningMatchData,true) || isBowlerNotSelected()){
    return false
  }else{
		setOpenExtraRunDialog(true);
		setExtraRunType(type);
  }
	};
	const handleClose = () => setOpenExtraRunDialog(false);
	const handleEndMatchClose = () => setOpenEndMatchDialog(false);
	const handleChangeInningClose = () => setOpenChangeInningDialog(false);
	const handleOutOpen = () => setOpenOutDialog(true);
	const handleOutClose = () => setOpenOutDialog(false);
	const handleNewBatClose = () => setOpenNewBatDialog(false);
	const handleNewBowlerClose = () => setOpenNewBowlerDialog(false);

// every button scoring details 

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

  // console.log(scoreState,'scoreStatescoreState')
  // console.log(runningMatchData,'runningMatchData')
  // console.log(batting,'batting')
  // console.log(bowling,'bowling')
  // console.log(teamsDetailData,'teamsDetailData')
  // console.log(matchState,'matchStatematchState')

  /******** socket */
	const handleMatchData = (matchdata) => {
    getBothTeamDetailedData(matchdata)
		setRunningMatchData(matchdata)
    checkIsInningCompleted(matchdata,true)
	}

  useEffect(() => {
		socket.on(`matchDetails/${matchState.match_id}`, (data) => {
			console.log(data,'socket data run')
			handleMatchData(data.data)
		});
    // return ()=>{
      //   socket.disconnect()
      // }
    }, [])
    /******** socket */
    if(scoreState?.innings && matchState?.team1){
      document.title = `${scoreState.innings.batting_team.split(" ")[0]}  ${scoreState.innings.runs_scored}/${scoreState.innings.wickets_lost} (${scoreState.innings.overs_played}) vs ${
        scoreState.innings.batted_team_id === matchState.team1.team_id ? matchState.team2.team_name : matchState.team1.team_name}`
    }

  const getCurInning = () => {
    let inning = {}
    if(runningMatchData.innings[0].first_bat){
      if(runningMatchData.innings[1].batsmen.length > 0){
        inning = runningMatchData.innings[1]
      }else{
        inning = runningMatchData.innings[0]
      }
    }else{
      if(runningMatchData.innings[0].batsmen.length > 0){
        inning = runningMatchData.innings[0]
      }else{
        inning = runningMatchData.innings[1]
      }
    }
    return inning
  }

	const handleWicket = (wicketType, outBy,extra,outbatsman=null) => {
    setLoader(true)
		let params = {
			id: matchState.match_id,
      team_id:batting.team_id,
			player: outbatsman && {players_id:outbatsman.players_id,players_name:outbatsman.players_name} || matchState.striker,
			bowler: matchState.bowler,
			fielder: outBy ? outBy : (wicketType === "CAUGHT&BOWLED" || wicketType === "RUN_OUT(MANKADED)") ? matchState.bowler : {},
			wicket_type: wicketType
		}
		try {
			wicket(params).then(res => {
        if(res?.status){
          // For wicket
          let wicketObj = {
            is_wicket: true,
            players_id: outbatsman && outbatsman.players_id || matchState.striker.players_id,
            players_name: outbatsman && outbatsman.players_name || matchState.striker.players_name,
            wicket_type : wicketType
          }
          if(extra.run_type && extra.run_type !== 'NB'){
            handleAddRun(0, extra, wicketObj)
          }else{
            if(extra?.run_type && (extra.run_type === 'NB')){
              handleAddRun(extra?.run && Number(extra.run) || 0, {run_type:'NB',run:0}, wicketObj)
            }else{
              handleAddRun(extra?.run && Number(extra.run) || 0, null, wicketObj)
            }
          }
        }
        setLoader(false)
				// setOpenNewBatDialog(true)
			})
      setLoader(false)

		} catch (error) {
			console.log("error---", error)
      setLoader(false)
		}
	}
	
	const switchBatsMan = () => {
    dispatch(striker(matchState.non_striker))
		dispatch(non_striker(matchState.striker))
	}
  
	const handleNextBatsman = (nextBatsman,outbatsman,extra) => {
    setLoader(true)
    const ball = increaseBall().toFixed(1)
    if(outbatsman && outbatsman.players_id === matchState.non_striker.players_id){
      if(Number(ball.split(".")[1]) === 6){
        if(extra?.run_type && (extra.run_type === "WD" || extra.run_type.includes("NB"))){
        dispatch(non_striker(nextBatsman))
        }else{
        dispatch(non_striker(matchState.striker))
        dispatch(striker(nextBatsman)) 
        }
      }else{
        dispatch(non_striker(nextBatsman))
      }
    }else{
      if(Number(ball.split(".")[1]) === 6){
        if(extra?.run_type && (extra.run_type === "WD" || extra.run_type.includes("NB"))){
          dispatch(striker(nextBatsman))
          }else{
          dispatch(striker(matchState.non_striker))
          dispatch(non_striker(nextBatsman))
          }
      }else{
        dispatch(striker(nextBatsman))
      }
    }
		let newPlayer = scoreHelpler.batsManObj()
		newPlayer.players_id = nextBatsman.players_id
		newPlayer.players_name = nextBatsman.players_name
    newPlayer.team_id = batting.team_id

		let params = {
			id: matchState.match_id,
			batsman: newPlayer
		}
		addNextBatsman(params).then(res => {
			handleNewBatClose()
      setLoader(false)
		})
	}
	const handleNextBowler = (nextBowler) => {
    setLoader(true)
		let nwBowler = scoreHelpler.bowlerObj()
		nwBowler.players_id = nextBowler.players_id
		nwBowler.players_name = nextBowler.players_name
    nwBowler.team_id = batting.team_id

		let params = {
			id: matchState.match_id,
			bowler: nwBowler
		}
    dispatch(bowler(nextBowler))
		addNextBowler(params).then(res => {
      if(res?.status){
        handleNewBowlerClose()
        handleMatchData(res.data[2])
      }
      setLoader(false)
		})
    setLoader(false)
	}

	const increaseBall = () => {
		const ball = scoreState.innings.overs_played.toFixed(1)
		let currentBall = 0
		if (Number(ball) === 0) {
			currentBall = 0.1
		} else {
			const prevBall = ball.split('.')
			if ((Number(prevBall[1]) >= 6)) {
				let nextOver = Number(prevBall[0]) + 1
				currentBall = nextOver + 0.1
			} else {
				currentBall = Number(ball) + 0.1
			}
		}
		return Number(currentBall.toFixed(1))
	}
  

	const runPerBall = (run, extra) => {
		let runB = 0
		if (extra !== null) {
			if (extra.run_type === 'WD' || extra.run_type.includes('NB')) {
				runB = wideNoBallRun + Number(extra.run)
			} else {
				runB = Number(extra.run)
			}
		}
		runB = runB + run
		return runB
	}

	const setCurrentBatsMan = (run,currentBall,extra,wicket,switchbat=false) => {
		const evens = [0, 2, 4, 6]
		const odds = [1, 3, 5, 7]
		let batsMan = { striker: '', non_striker: '' }
    if(wicket?.wicket_type && Number(currentBall.split(".")[1]) === 6){
    }else{
      if(wicket?.wicket_type && wicket.wicket_type === 'RUN_OUT'){
      }else{
        if(extra?.run_type){
          if(extra.run_type.includes("NB")){
            if(extra.run_type === 'NB'){
              if (odds.includes(run)) {
                switchbat && switchBatsMan()
                batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
              }
            }else{
              if (odds.includes(extra.run)) {
                switchbat && switchBatsMan()
                batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
              }
            }
          }
          else if(extra.run_type === 'WD'){
            if (odds.includes(extra.run)) {
              switchbat && switchBatsMan()
              batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
            }
          }
          else{
            if (odds.includes(extra.run) && Number(currentBall.split(".")[1]) !== 6) {
              switchbat && switchBatsMan()
              batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
            } else if (evens.includes(extra.run) && Number(currentBall.split(".")[1]) === 6) {
              switchbat && switchBatsMan()
              batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
            }
          }
        }else{
          if (odds.includes(run) && Number(currentBall.split(".")[1]) !== 6) {
            switchbat && switchBatsMan()
            batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
          } else if (evens.includes(run) && Number(currentBall.split(".")[1]) === 6) {
            switchbat && switchBatsMan()
            batsMan = { striker: matchState.non_striker, non_striker: matchState.striker }
          }
      }
      }
    }
		return batsMan
	}

	const manageInning = () => {
		const inningObj = {
			batted_team_id: batting.team_id,
			batting_team: batting.team_name,
			runs_scored: scoreState.runs.totalRun,
			wickets_lost: scoreState?.innings?.wickets_lost || 0,
      run_rate:scoreState?.innings?.run_rate,
			overs_played: scoreState.innings.overs_played,
      striker_id : matchState.striker.players_id,
      non_striker_id : matchState.non_striker.players_id,
      current_bowler_id : matchState.bowler.players_id,
      batsmen: [matchState.striker.players_name, matchState.non_striker.players_name],
			bowlers: [matchState.bowler.players_name]
		}
		return inningObj
	}


	const   manageOver = (run, extra, wicket) => {
		// Positioning batsman, Strike or Non-Strike
    const prevBall = scoreState.innings.overs_played.toFixed(1)
		let ovr = JSON.parse(JSON.stringify(scoreState.overs))
		const ball = increaseBall().toFixed(1)
		const currentBall = ball.split('.')
		setCurrentBatsMan(run,ball,extra,wicket,true)
		let ovObj = {
			over: extra === null ? Number(ball) 
          : (extra.run_type === 'WD' || extra.run_type.includes('NB'))
          ? Number(prevBall)
          : Number(ball) ,
			striker: matchState.striker,
			non_striker: matchState.non_striker,
      // striker_id : matchState.striker.players_id,
      // non_striker_id : matchState.non_striker.players_id,
			runs: run,
			extra: extra === null ? { run: 0, run_type: '' } : { run: extra.run, run_type: extra.run_type }
		}
    if(wicket?.wicket_type === "RUN_OUT(MANKADED)" || wicket?.wicket_type === "RETIRED_OUT" || wicket?.wicket_type === "RETIRED_HURT"){
      ovObj.over = Number(prevBall)
    }

		if (wicket !== null) {
			ovObj.wicket = wicket
		}

		if (ovr.length === 0) {
			ovr = [{
				over: currentBall[0],
				bowler: matchState.bowler,
				deliveries: [ovObj]
			}]
		} else {
			if (Number(currentBall[1]) === 1) {
				ovr = [...ovr, { over: currentBall[0], bowler: matchState.bowler, deliveries: [ovObj] }]
				// switchBatsMan()
			} else {
				let lastElement = ovr[ovr.length - 1]
				ovr[ovr.length - 1] = { over: currentBall[0], bowler: matchState.bowler, deliveries: [...lastElement.deliveries, ovObj] }
			}

		}
		dispatch(overs(ovr))

		return { ...ovObj, bowler: matchState.bowler }
	}

  const checkIsInningCompleted = (runningMatchData,showmodal=false) => {
    let isTrue = false
    if(runningMatchData?.outcome){
      if(showmodal){
      setOpenEndMatchDialog(true)
    }
    isTrue = true
    }else{
      if(runningMatchData.innings[0].first_bat){
        if(runningMatchData.innings[1].batsmen.length > 0){
          // let alloutteam2 = teamsDetailData.team2.batsman.filter((item) => item.wickets.kind.length === 0)
          // (teamsDetailData.team2.batsman.length === runningMatchData.team2.players.length && alloutteam2.length === 1)
          if((runningMatchData.innings[1].wickets_lost >= runningMatchData.innings[1].batsmen.length-1)
            || runningMatchData.match_settings.no_of_overs <= getApproxOvers(runningMatchData.innings[1].overs_played)
            || runningMatchData.innings[1].runs_scored > runningMatchData.innings[0].runs_scored){
              if(showmodal){
                setOpenEndMatchDialog(true)
              }
          isTrue = true
        }
      }else{
          if((runningMatchData.innings[0].wickets_lost >= runningMatchData.innings[0].batsmen.length-1)
            || runningMatchData.match_settings.no_of_overs <= getApproxOvers(runningMatchData.innings[0].overs_played)){
            if(showmodal){
          setOpenChangeInningDialog(true)}
          isTrue = true
        }
        }
      }else{
        if(runningMatchData.innings[0].batsmen.length > 0){
          if((runningMatchData.innings[0].wickets_lost >= runningMatchData.innings[0].batsmen.length-1)
            || runningMatchData.match_settings.no_of_overs <= getApproxOvers(runningMatchData.innings[0].overs_played) 
            || runningMatchData.innings[0].runs_scored > runningMatchData.innings[1].runs_scored){
              if(showmodal){
          setOpenEndMatchDialog(true)}
          isTrue = true
        }
      }else{
          if((runningMatchData.innings[1].wickets_lost >= runningMatchData.innings[1].batsmen.length-1)
            || runningMatchData.match_settings.no_of_overs <= getApproxOvers(runningMatchData.innings[1].overs_played)){
            if(showmodal){
          setOpenChangeInningDialog(true)}
          isTrue = true
          }
        }
      }
    }
  return isTrue
  }

  const waitAfterHit = () => {
    setTimeout(
      () => setLoader(false), 
      1000
    );
  }

  const isBowlerNotSelected = () => {
    if(runningMatchData.overs.length === 0){ return false}
    const thisBall = ((increaseBall()).toFixed(1)).split('.') 
    let over = runningMatchData.overs[runningMatchData.overs.length-1]
    if(over.deliveries.length === 0 && runningMatchData.over.length > 1){
      over = runningMatchData.overs[runningMatchData.overs.length-2]
    }
    let lastDelivery = over.deliveries[over.deliveries.length - 1];
    // let lastDelivery = runningMatchData.overs.length > 0 && runningMatchData.overs[runningMatchData.overs.length-1].deliveries[runningMatchData.overs[runningMatchData.overs.length-1].deliveries.length-1]
    if(!matchState.bowler || Object.keys(matchState.bowler).length === 0 ||
    (Number(thisBall[1]) === 1 && runningMatchData.overs.length > 0 
      && Number(lastDelivery.over.split(".")[1]) === 6 && lastDelivery.bowler.players_id === matchState.bowler.players_id )
    ) {
      setOpenNewBowlerDialog(true)
      return true
    }else{
      return false
    }
  }

	const handleAddRun = (run, extra = null, wicket = null) => {
    setLoader(true)
    const incBall = increaseBall()
    const checkLastBall = incBall.toFixed(1)
    const thisBall = checkLastBall.split('.')
		//---------------Runs----------------
    if(checkIsInningCompleted(runningMatchData,true)
      ){
        setLoader(false)
      return false
    }else if(isBowlerNotSelected()){
      setLoader(false)
      return false
    }    
    else{
      let scoreRun = scoreState.runs
      const runPBall = runPerBall(run, extra)
  
      const runObj = {
        totalRun: scoreRun.totalRun + runPBall, batsmanRun: run + scoreRun.batsmanRun
      }  
      //---------------Runs-------------END---
      //---------------Inning Object----------------
      let inningObj = manageInning()
  		let updatedStriker = setCurrentBatsMan(run,checkLastBall,extra,wicket)
      inningObj.striker_id = updatedStriker?.striker && updatedStriker.striker.players_id || matchState.striker.players_id
      inningObj.non_striker_id = updatedStriker?.non_striker && updatedStriker.non_striker.players_id || matchState.non_striker.players_id
      
      if (extra === null || (extra.run_type === 'BYE' || extra.run_type === 'LB')) {
        if(wicket?.wicket_type === "RUN_OUT(MANKADED)" || wicket?.wicket_type === "RETIRED_OUT" || wicket?.wicket_type === "RETIRED_HURT"){
        }else{
          inningObj.overs_played = incBall
          if (Number(thisBall[1]) === 6 && getApproxOvers(Math.ceil(incBall)) !== Number(runningMatchData.match_settings.no_of_overs)) {
            // swapBatsman()
            setOpenNewBowlerDialog(true)
          }
        }
      }
      inningObj.runs_scored = scoreRun.totalRun + runPBall // This updates for total run
      let deliveryData = manageOver(run, extra, wicket)
      if(extra && Number(thisBall[1]) === 1 && (extra.run_type.includes("NB") || extra.run_type === "WD")){
        inningObj.overs_played = getApproxOvers(inningObj.overs_played)
        deliveryData.over = getApproxOvers(deliveryData.over)
      }
      if(wicket && Number(thisBall[1]) === 1 && (wicket?.wicket_type === "RUN_OUT(MANKADED)" 
        || wicket?.wicket_type === "RETIRED_OUT" || wicket?.wicket_type === "RETIRED_HURT")){
        inningObj.overs_played = getApproxOvers(inningObj.overs_played)
        deliveryData.over = getApproxOvers(deliveryData.over)
      }
      if(wicket?.is_wicket){
        inningObj.wickets_lost = Number(inningObj.wickets_lost) + 1
      }
      //---------------Over-------------END---
      let newdeliveryData = JSON.parse(JSON.stringify(deliveryData))
      if(deliveryData?.wicket?.wicket_type){
        delete newdeliveryData.wicket.wicket_type
        newdeliveryData.wicket.kind = deliveryData?.wicket?.wicket_type
      }
      let data = {
        id: matchState.match_id,
        innings: inningObj,
        overs: newdeliveryData,
        wicket_type:deliveryData?.wicket?.wicket_type
      }
  
      try {
        //**Updates in DB */
        updateMatch(data).then(res => {
          if(res?.status){
            // console.log(res.data,'rere')
            handleMatchData(res.data)
            dispatch(innings(inningObj))
            dispatch(runs(runObj))
            setUndoEnable(true)
            waitAfterHit()
          }else{
            setLoader(false)
          }
        })
      } catch (error) {
        setLoader(false)
        console.log("error---", error)
      }
    }
	}

	const undo = () => {
    if(!runningMatchData?.outcome){
      setLoader(true)
      try{
        let data = {
          id: matchState.match_id,
          batted_team_id: batting.team_id,
        }
        undoData(data).then(res => {
          if(res?.status){
            if(res.data.length > 0){
              getCurrentMatchData(res.data[2])
            }
            setUndoEnable(false)
          }
          setLoader(false)
        })
      } catch(err) {
        setLoader(false)
      }
    }
	}

  const checkUndoPossible = ()=> {
    if(runningMatchData.overs.length === 0 || (getCurInning().overs_played.toFixed(1).split(".")[0] === '0' 
      && getCurInning().overs_played.toFixed(1).split(".")[1] === "0" && Number(getCurInning().runs_scored) === 0)){
      return false
    }else{
      return true
    }
  }

// to get all data of striker ,non striker,current bowler
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
// to get all data of striker ,non striker,current bowler


const swapBatsman = () => {
  if(checkIsInningCompleted(runningMatchData,true)){
    return false
  }else{
    dispatch(striker(matchState.non_striker))
		dispatch(non_striker(matchState.striker))
  }
}

const getApproxOvers = (overs) => {
  return (String(overs).split(".")[1] === "6" && Number(String(overs).split(".")[0])+1 || overs)
}


const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;
const imageLoader = (img, defaultimg) => {
  return img ? `${IMAGEURL}${img}` : `${defaultimg}`;
};

  return (
    <Grid container spacing={3}>
      <Grid item lg={5} md={6} sm={12} xs={12}>
        <div className="my-card p-3">
          <div className="d-flex justify-content-between">
            <div>
              <Image
                src="/Assets/Images/indiaflag.jpg"
                loader={()=> imageLoader(battingTeamLogo,'/Assets/Images/indiaflag.jpg')}
                className="me-2 rounded-circle"
                width={30}
                height={30}
                style={{
                  objectFit: "cover",
                }}
                alt="img"
              />
              {batting?.team_name},{runningMatchData.innings[0].first_bat 
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
            <div style={fontStyle}>{getCurInning()?.runs_scored} - {getCurInning()?.wickets_lost} ({getApproxOvers(getCurInning()?.overs_played)} 
              )</div>
            <div style={fontStyle}>{getCurInning()?.run_rate 
                                  ? (Number.isInteger(getCurInning()?.run_rate))
                                  ? getCurInning()?.run_rate 
                                  : getCurInning()?.run_rate.toFixed(2)
                                  : 0
                                }</div>
          </div>
        </div>
      </Grid>

      {/* over box  */}
      <Grid item lg={7} md={6} sm={12} xs={12} >
        <div className="my-card p-3 pb-2 overflow-auto">
          <div className="d-flex align-items-center">
            <span className="me-2">This Over</span>
            {runningMatchData?.overs?.length > 0 && (runningMatchData.overs[runningMatchData.overs.length-1].batted_team_id === batting?.team_id)
            && runningMatchData.overs[runningMatchData.overs.length-1].deliveries.length > 0
            && runningMatchData.overs[runningMatchData.overs.length-1].deliveries.map((item,index) => {
              let keyitem = item?.wicket ? color["OUT"] : color[item.runs] ? color[item.runs] : color["default"];
              return (
                <div className="text-center ms-2 h-100 d-flex flex-column align-items-center" key={index}>
                  <div
                    className="rounded-circle p-1 d-flex justify-content-center align-items-center"
                    style={{ ...fontStyle1, ...keyitem }}
                  >
                    {item?.wicket
                    ? ((item?.runs > 0 && "W "+item.runs) || (item?.extra?.run && "W "+item.extra.run) || "W")
                    : item?.extra?.run 
                    ? item.extra.run
                    : item.runs
                  }
                  </div>
                  <div style={{ opacity: (item?.extra.run_type ? item.extra.run_type !== "OVERTHROW" ? 1 : 0 : 0) }} className="fs-6">
                    {item?.extra.run_type ? item.extra.run_type !== "OVERTHROW" ? item.extra.run_type : "-" :"-"}
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

      {/* batsman table */}
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
              getPlayerData(matchState.striker,'batsman').players_name}
              *</TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.striker,'batsman').runs_scored}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.striker,'batsman').balls_faced}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.striker,'batsman').fours}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.striker,'batsman').sixes}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.striker,'batsman')?.strike_rate || 0}
              </TableCell>
            </TableRow>
            <TableRow >
              <TableCell className="ps-3 fw-bold">{
              getPlayerData(matchState.non_striker,'batsman').players_name}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.non_striker,'batsman').runs_scored}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.non_striker,'batsman').balls_faced}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.non_striker,'batsman').fours}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.non_striker,'batsman').sixes}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.non_striker,'batsman')?.strike_rate || 0}
              </TableCell>
            </TableRow>
          
          </TableBody>
        </Table>
      </Grid>

        {/* bowler table  */}
      <Grid item lg={12} md={6} sm={12} xs={12}>
        <Table className="mui-table my-card" width="100%" overflow="auto">
          <TableHead
            className="table-head"
            sx={{ borderBottom: "2px solid #DADADA" }}
          >
            <TableRow>
              <TableCell className="text-primary fw-bold w-50 ps-3">
                <div className="d-flex align-items-center">Bowler
                <span style={{ backgroundColor: "#D9D9D978",color: "rgba(52, 49, 76, 1)",padding:"2px 10px"}} 
                className="ms-4 cursor-pointer rounded" onClick={() => {!checkIsInningCompleted(runningMatchData,true) && setOpenNewBowlerDialog(true)}}
                >Change</span></div>
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
              {getPlayerData(matchState.bowler,'bowler').players_name}
                </TableCell>
              <TableCell align="center" className="fw-bold">
              {getApproxOvers(getPlayerData(matchState.bowler,'bowler').overs_bowled)}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.bowler,'bowler').maiden}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.bowler,'bowler').runs_conceded}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.bowler,'bowler').wickets_taken}
              </TableCell>
              <TableCell align="center" className="fw-bold">
              {getPlayerData(matchState.bowler,'bowler')?.economy_rate || 0}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>


      {/* <Grid item lg={12} md={6} sm={12} xs={12} >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            cursor:'pointer'
          }}
          style={{opacity:`${loader ? "0.5" : "1"}`}}
        >
          {buttonArrayObj.map((item) => {
            return (
            <Box sx={{flexGrow: 1}}
            bgcolor={item.bgcolor}
            className={`tableButtonHover border ${item.class}`}
             // style: {opacity:`${undoEnable && checkUndoPossible() ? "1" : "0.5"}`}
            style={item?.style || {minWidth:'110px',maxWidth:'150px'}}
            onClick={() => item.click}
            >
              <div style={{width:'105px'}}>
              {item.name} <br /> {item.name1}
              </div>
            </Box>
            )})}

        </Box>
      </Grid> */}


      <Grid item lg={12} md={6} sm={12} xs={12}>
        <Table className="mui-table" width="100%" overflow="auto" style={{opacity:`${loader ? "0.5" : "1"}`}} >
          <TableBody style={{ cursor: "pointer" }}>
            <TableRow style={{ backgroundColor: "#D9D9D978" }}>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                onClick={() => {!loader && handleClickOpen('WD')}}
              >
                WD
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                onClick={() => {
                  !loader && handleClickOpen('NB')}}
              >
                NB
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                onClick={() => {!loader && handleClickOpen('BYE')}}
              >
                BYE
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                onClick={() => {!loader && handleClickOpen('LB')}}
              >
                LB
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold text-danger"
                onClick={() => {checkIsInningCompleted(runningMatchData,true) || isBowlerNotSelected() || handleOutOpen()}}
              >
                OUT
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold text-success"
                style={{opacity:`${undoEnable && checkUndoPossible() ? "1" : "0.5"}`}}
                onClick={() => {!loader && undoEnable && checkUndoPossible() && undo()}}
              >
                UNDO
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                onClick={() => {!loader && swapBatsman()}}
              >
                SWAP <br /> BATSMAN
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                style={{opacity:`${scoreFunctions.checkInningsNumber(runningMatchData,batting) ? "0.5" : "1"}`}}
                onClick={() => {
                  // checkIsInningCompleted(runningMatchData,true)  
                  if(!scoreFunctions.checkInningsNumber(runningMatchData,batting)){setOpenChangeInningDialog(true)}
                }}
              >
                CHANGE <br /> INNING
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleAddRun(0)}
              >
                0
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleAddRun(1)}
              >
                1
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleAddRun(2)}
              >
                2
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleAddRun(3)}
              >
                3
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleAddRun(4)}
              >
                4
              </TableCell>
                 <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleClickOpen('OVERTHROW')}
              >
                5,7
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 fs-5 border fw-bold"
                onClick={() => !loader && handleAddRun(6)}
              >
                6
              </TableCell>
              <TableCell
                align="center"
                className="tableButtonHover p-4 border fw-bold"
                style={{opacity:`${scoreFunctions.checkInningsNumber(runningMatchData,batting) ? "1" : "0.5"}`,backgroundColor:"#D9D9D978"}}
                onClick={() => {
                  // checkIsInningCompleted(runningMatchData,true)
                  if(scoreFunctions.checkInningsNumber(runningMatchData,batting)){setOpenEndMatchDialog(true)}
                }}
              >
                END <br /> MATCH
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* all modals  */}
        <ExtraRun
								open={openExtraRunDialog}
								onClose={handleClose}
								extraRunType={extraRunType}
								handleAddRun={handleAddRun}
							/>
        <EndMatch
								open={openEndMatchDialog}
								onClose={handleEndMatchClose}
                matchid={matchState.match_id}
                setMatchValue={setMatchValue}
                runningMatchData={runningMatchData}
                batting={batting}
                checkIsInningCompleted={checkIsInningCompleted}
							/>

        <ChangeInning
								open={openChangeInningDialog}
								onClose={handleChangeInningClose}
                changeMatchInnings={changeMatchInnings}
                setMatchValue={setMatchValue}
                runningMatchData={runningMatchData}
                checkIsInningCompleted={checkIsInningCompleted}
							/>
					<Out
            open={openOutDialog}
            onClose={handleOutClose}
            handleWicket={handleWicket}
            bowling={bowling}
            batting={batting}
            handleNextBatsman={handleNextBatsman}
            runningMatchData={runningMatchData}
            matchState={matchState}
            curInning={getCurInning}
          />
          <NewbatsMan
						open={openNewBatDialog}
						onClose={handleNewBatClose}
						batting={batting}
						handleNextBatsman={handleNextBatsman}
					/>
					<NewBowler
						open={openNewBowlerDialog}
						onClose={handleNewBowlerClose}
						bowling={bowling}
						handleNextBowler={handleNextBowler}
            runningMatchData={runningMatchData}
            currentBowler={getPlayerData(matchState.bowler,'bowler')}
					/>
          {/* all modals  */}
      </Grid>

    </Grid>
  );
};

export default MatchLive;
