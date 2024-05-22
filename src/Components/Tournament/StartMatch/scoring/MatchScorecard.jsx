import React, {useState,useEffect} from 'react'
import { Grid,Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow } from "@mui/material";
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { scoreFunctions } from "./scoreFunctions"

const MatchScorecard = ({runningMatchData,teamsDetailData}) => {
  const [toggle, setToggle] = useState({0:false,1:false})
  const [updatedData, setUpdatedData] = useState({})
  const fontStyle = {fontFamily:'Poppins-Bold'}
  const tableHead = {backgroundColor:'#0000006B'}

  const getTypeWicket = (wicketdata) => {
    switch (wicketdata?.kind) {
      case "CAUGHT" : case "CAUGHT_BEHIND" : {
        return `c ${wicketdata?.fielder?.players_name} b ${wicketdata?.bowler?.players_name}`
      }
      case "CAUGHT&BOWLED": {
        return `c & b ${wicketdata?.bowler?.players_name}`
      }
      case "BOLD": {
        return `b ${wicketdata?.bowler?.players_name}`
      }
      case "LBW": {
        return `lbw b ${wicketdata?.bowler?.players_name}`
      }
      case "HIT_WICKET": {
        return `hit wicket b ${wicketdata?.bowler?.players_name}`
      }
      case "RUN_OUT" : {
        return `run out by ${wicketdata?.fielder?.players_name}`
      }
      case "RUN_OUT(MANKADED)" : {
        return `runout mankand by ${wicketdata?.fielder?.players_name}`
      }
      case "STAMPING": {
        return `st ${wicketdata?.fielder?.players_name} b ${wicketdata?.bowler?.players_name}`
      }
      case "RETIRED_HURT": {
        return `retired hurt`
      }
      case "RETIRED_OUT": {
        return `retired out`
      }
      case "OBSTR(THE_FILED)": {
        return `OBSTR (The Field)`
      }
      case "ABSENT_HURT": {
        return `Absent Hurt`
      }
      default: {
        return `not out`
      }
    }
  }

  const getTeamAllExtra = (teamid) => {
    let total = 0
    let b = 0
    let lb = 0
    let nb = 0
    let wd = 0
    for(let i=0;i<runningMatchData.overs.length;i++){
      if(teamid === runningMatchData.overs[i].batted_team_id){
        for(let j=0;j<runningMatchData.overs[i].deliveries.length;j++){
          if(runningMatchData.overs[i].deliveries[j].extra.run_type === 'LB'){
                lb += Number(runningMatchData.overs[i].deliveries[j].extra.run)
          }
          else if(runningMatchData.overs[i].deliveries[j].extra.run_type === 'WD'){
                wd += (Number(runningMatchData.overs[i].deliveries[j].extra.run)+1)
          }
          else if(runningMatchData.overs[i].deliveries[j].extra.run_type === 'BYE'){
                b += Number(runningMatchData.overs[i].deliveries[j].extra.run)
          }
          else if(runningMatchData.overs[i].deliveries[j].extra.run_type.includes('NB')){
                nb += (Number(runningMatchData.overs[i].deliveries[j].extra.run)+1)
          }
        }
      }
    }
    total = (b + lb + nb + wd)
    return ({total:total,bye:b,leg_bye:lb,no_ball:nb,wide:wd})
  } 


  const didNotBat = (batsmandata) => {
    let team = runningMatchData.team1.team_id === batsmandata.batted_team_id ? runningMatchData.team1 : runningMatchData.team2
    let arr = team.players.map((item) => item.players_name)
    let arr1 = batsmandata.batsmen.map((item) => item.players_name)
    let newarr = [] 
    for(let i=0;i<arr.length;i++){
      if(!arr1.includes(arr[i])){
        newarr.push(arr[i])
      }
    }
    return newarr
  }

  const getPowerPlayRuns = (teamid) => {
    let power_play_runs = 0
    let count = 0
    for(let i=0;i<runningMatchData.overs.length;i++){
      if(teamid === runningMatchData.overs[i].batted_team_id){
        count += 1
        for(let j=0;j<runningMatchData.overs[i].deliveries.length;j++){
          if(count <= runningMatchData.match_settings.power_play){
            power_play_runs += Number(runningMatchData.overs[i].deliveries[j].runs)
            if(runningMatchData.overs[i].deliveries[j].extra.run_type){
              if(runningMatchData.overs[i].deliveries[j].extra.run_type === 'WD' || runningMatchData.overs[i].deliveries[j].extra.run_type.includes('NB')){
                power_play_runs += (Number(runningMatchData.overs[i].deliveries[j].extra.run)+1)
              }else{
                power_play_runs += (Number(runningMatchData.overs[i].deliveries[j].extra.run))
              }
            }
          }
        }
      }
  }
  return power_play_runs
}

const getFallOfWicket = (teamid) => {
  let fall_of_wicket = []
  let runs = 0
  let wicket = 0
  for(let i=0;i<runningMatchData.overs.length;i++){
    if(teamid === runningMatchData.overs[i].batted_team_id){
      for(let j=0;j<runningMatchData.overs[i].deliveries.length;j++){
        runs += Number(runningMatchData.overs[i].deliveries[j].runs)
        if(runningMatchData.overs[i].deliveries[j].extra.run_type){
          if(runningMatchData.overs[i].deliveries[j].extra.run_type === 'WD' || runningMatchData.overs[i].deliveries[j].extra.run_type.includes('NB')){
            runs += (Number(runningMatchData.overs[i].deliveries[j].extra.run)+1)
          }else{
            runs += (Number(runningMatchData.overs[i].deliveries[j].extra.run))
          }
        }
        if(runningMatchData.overs[i].deliveries[j]?.wicket?.is_wicket){
          wicket += 1
          fall_of_wicket.push({runs:runs,wicket:wicket,over:runningMatchData.overs[i].deliveries[j]?.over,
          players_name:runningMatchData.overs[i].deliveries[j]?.wicket?.players_name})
        }
      }
  }
}
return fall_of_wicket
}

  const calculateBowlerMaiden = (bowlerid) => {
    let maiden = 0
    for(let i=0;i<runningMatchData.overs.length;i++){
      if(runningMatchData.overs[i].deliveries.length > 0 && runningMatchData.overs[i].deliveries[0].bowler.players_id === bowlerid){
        let run = 0
        for(let j=0;j<runningMatchData.overs[i].deliveries.length;j++){
          run = run + runningMatchData.overs[i].deliveries[j].runs
        }
        if(run === 0){
          maiden += 1
        }
      }
    }
    return maiden
  }


  const getData = () => {
    let alldata = JSON.parse(JSON.stringify(runningMatchData))
    if(alldata?.innings){
      alldata.innings[0]["team_extra"] = {...getTeamAllExtra(alldata.innings[0].batted_team_id)}
      alldata.innings[1]["team_extra"] = {...getTeamAllExtra(alldata.innings[1].batted_team_id)}
      alldata.innings[0]["did_not_bat"] = didNotBat(alldata.innings[0])
      alldata.innings[1]["did_not_bat"] = didNotBat(alldata.innings[1])
      alldata.innings[0]["fall_of_wicket"] = getFallOfWicket(alldata.innings[0].batted_team_id)
      alldata.innings[1]["fall_of_wicket"] = getFallOfWicket(alldata.innings[1].batted_team_id)
      alldata.innings[0]["power_play_runs"] = getPowerPlayRuns(alldata.innings[0].batted_team_id)
      alldata.innings[1]["power_play_runs"] = getPowerPlayRuns(alldata.innings[1].batted_team_id)
  
      if(alldata.innings[0].batted_team_id === alldata.team1.team_id){
          alldata.innings[0].batsmen = [...teamsDetailData.team1.batsman]
          alldata.innings[0].bowlers = [...teamsDetailData.team2.bowler]
          alldata.innings[1].batsmen = [...teamsDetailData.team2.batsman]
          alldata.innings[1].bowlers = [...teamsDetailData.team1.bowler]
      }else{
        alldata.innings[1].batsmen = [...teamsDetailData.team2.batsman]
        alldata.innings[1].bowlers = [...teamsDetailData.team1.bowler]
        alldata.innings[0].batsmen = [...teamsDetailData.team1.batsman]
        alldata.innings[0].bowlers = [...teamsDetailData.team2.bowler]
      }
    }
    setUpdatedData(alldata)
  }
  
  useEffect(() => {
    getData()
    if(Object.keys(runningMatchData).length > 0){
      if(runningMatchData.innings[1]?.batsmen.length === 0){
        setToggle({...toggle, ["1"]:true})
      }
    }
  }, [])

  let firstBatInningArray = (updatedData?.innings && updatedData?.innings.length > 0)
  ? updatedData.innings[0].first_bat
  ? updatedData.innings
  : updatedData.innings.reverse()
  : []
// console.log(runningMatchData,'runningMatchData')
// console.log(teamsDetailData,'teamsDetailData')
// console.log(updatedData,'updatedDataupdatedDataupdatedData')
// console.log(firstBatInningArray,'firstBatInningArray')
// console.log(scoreFunctions.getOutCome(updatedData))

  return ( <>
    <Grid item lg={12} md={6} sm={12} xs={12}>
    <div style={fontStyle} className='p-3 fw-bold'>{runningMatchData && Object.keys(runningMatchData).length > 0 && scoreFunctions.getOutCome(runningMatchData)}</div>
      </Grid>
      {firstBatInningArray &&
     firstBatInningArray.map((item,index) => { 
        return (
<> 
          <div key={index} style={{backgroundColor: '#222B42'}} className="text-white d-flex justify-content-between w-100 fw-bold p-3 pe-4" 
          onClick={() => setToggle({...toggle,[index]:!toggle[index]})}>
            <div>{item.batting_team} Inning {item?.runs_scored}-{item?.wickets_lost} ({scoreFunctions.getApproxOvers(item.overs_played)})</div>
            <div>{!toggle[index] && <FaChevronDown /> || <FaChevronRight />}</div>
          </div>
    <Grid item lg={12} md={6} sm={12} xs={12} style={toggle[index] && {display:'none'} || {}}>
    <Table className="mui-table border" width="100%" overflow="auto" >
        <TableHead className='table-head' sx={{borderBottom:'2px solid #DADADA'}}>
          <TableRow style={tableHead}>
            <TableCell width='15%' className="text-white fw-bold ps-3">Batsman</TableCell>
            <TableCell align="center" className='w-50 text-white fw-bold' ></TableCell>
            <TableCell align="center" className='text-white fw-bold' >Run</TableCell>
            <TableCell align="center" className='text-white fw-bold' >Ball</TableCell>
            <TableCell align="center" className='text-white fw-bold' >4s</TableCell>
            <TableCell align="center" className='text-white fw-bold' >6s</TableCell>
            <TableCell align="center" className='text-white fw-bold' >SR</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
            {item?.batsmen && item.batsmen.length > 0 && item.batsmen.map((batsmen, index1) => {
              return (
            <TableRow key={index1}>
              <TableCell className="ps-3 fw-bold text-primary">{batsmen?.players_name}</TableCell>
              <TableCell className="text-secondary ps-5">{getTypeWicket(batsmen?.wickets)}</TableCell>
              <TableCell align="center" className="fw-bold ">{batsmen?.runs_scored}</TableCell>
              <TableCell align="center" className="fw-bold">{batsmen?.balls_faced}</TableCell>
              <TableCell align="center" className="fw-bold">{batsmen?.fours}</TableCell>
              <TableCell align="center" className="fw-bold">{batsmen?.sixes}</TableCell>
              <TableCell align="center" className="fw-bold">{batsmen?.strike_rate && batsmen.strike_rate.toFixed(2) || 0}</TableCell>
            </TableRow>
              )
            })}
              <TableRow >
              <TableCell className="ps-3 fw-bold">Extra</TableCell>
              <TableCell className="text-secondary"></TableCell>
              <TableCell align="start" colSpan={5} className="text-secondary ">
              <b>{item.team_extra?.total}</b>{`  B ${item.team_extra?.bye}  ,LB ${item.team_extra?.leg_bye}  ,WD ${item.team_extra?.wide}  ,NB ${item.team_extra?.no_ball}`}</TableCell>
            </TableRow>
              <TableRow >
              <TableCell className="ps-3 fw-bold">Total</TableCell>
              <TableCell className="ps-3 fw-bold"></TableCell>
              <TableCell align='start' className="text-secondary" colSpan={5}>{item?.runs_scored}-{item?.wickets_lost} ({scoreFunctions.getApproxOvers(item.overs_played)} ov)  {item?.run_rate}</TableCell>
            </TableRow>
              <TableRow >
              <TableCell className="ps-3 fw-bold">Did Not Bat</TableCell>
              <TableCell className="ps-5 text-secondary" colSpan={6}>{item?.did_not_bat && item.did_not_bat.join()}</TableCell>
            </TableRow>
              <TableRow style={tableHead}>
              <TableCell colSpan={7} className="ps-3 text-white fw-bold">Fall Of Wickets</TableCell>
            </TableRow>
              <TableRow >
              <TableCell colSpan={7} className="ps-3 text-secondary fw-bold">
              {item?.fall_of_wicket && item?.fall_of_wicket.map((fallwicket,fallindex) => {
                return `${fallwicket.runs}-${fallwicket.wicket} (${fallwicket.players_name}, ${scoreFunctions.getApproxOvers(fallwicket.over)}) `
              })}
              </TableCell>
            </TableRow>
          </TableBody>
          </Table>
          <Table className="mui-table border" width="100%" overflow="auto">
        <TableHead className='table-head' sx={{borderBottom:'2px solid #DADADA'}}>
            <TableRow style={tableHead}>
            <TableCell width='15%' className="text-white fw-bold ps-3">Bowler</TableCell>
            <TableCell align="center" width='38%'></TableCell>
            <TableCell align="center" className='text-white fw-bold' >Over</TableCell>
            <TableCell align="center" className='text-white fw-bold' >Maiden</TableCell>
            <TableCell align="center" className='text-white fw-bold' >Run</TableCell>
            <TableCell align="center" className='text-white fw-bold' >Wicket</TableCell>
            {/* <TableCell align="center" className='text-white fw-bold' >NB</TableCell>
            <TableCell align="center" className='text-white fw-bold' >WD</TableCell> */}
            <TableCell align="center" className='text-white fw-bold' >Economy</TableCell>
            </TableRow></TableHead><TableBody>
            {item?.bowlers && item.bowlers.length > 0 && item.bowlers.map((bowler, index2) => {
              return (
            <TableRow key={index2}>
              <TableCell className="ps-3 fw-bold text-primary">{bowler?.players_name}</TableCell>
              <TableCell className="text-secondary"></TableCell>
              <TableCell align="center" className="fw-bold ">{scoreFunctions.getApproxOvers(bowler?.overs_bowled)}</TableCell>
              <TableCell align="center" className="fw-bold">{calculateBowlerMaiden(bowler?.players_id)}</TableCell>
              <TableCell align="center" className="fw-bold">{bowler?.runs_conceded}</TableCell>
              <TableCell align="center" className="fw-bold">{bowler?.wickets_taken}</TableCell>
              {/* <TableCell align="center" className="fw-bold">{bowler?.nb}</TableCell>
              <TableCell align="center" className="fw-bold">{bowler?.wd}</TableCell> */}
              <TableCell align="center" className="fw-bold">{bowler?.economy_rate}</TableCell>
            </TableRow>
              )
            })}
              <TableRow style={tableHead}>
              <TableCell className="ps-3 text-white fw-bold">Powerplays</TableCell>
              <TableCell colSpan={5} align='center' className="text-white fw-bold">Overs</TableCell>
              <TableCell className="text-white fw-bold">Runs</TableCell>
            </TableRow>
              <TableRow>
              <TableCell className="ps-3 fw-bold">Mandatory</TableCell>
              <TableCell colSpan={5} align='center'>0.1-{runningMatchData?.match_settings?.power_play && runningMatchData?.match_settings?.power_play.toFixed(1)}</TableCell>
              <TableCell >{item?.power_play_runs}</TableCell>
            </TableRow>
            </TableBody></Table>
    </Grid>
</>
        )
      })}
    </>
  )
}

export default MatchScorecard