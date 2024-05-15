import React, {useEffect, useState} from 'react'
import { Grid,Table,
  TableBody,
  TableCell,
  TableRow } from "@mui/material";
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { scoreFunctions } from "./scoreFunctions"

const MatchOvers = ({runningMatchData}) => {
  const [toggle, setToggle] = useState({0:false,1:false})
  const [firstBatInningArray, setFirstBatInningArray] = useState({})
  const fontStyle = {fontFamily:'Poppins-Bold'}
  const fontStyle1 = {fontFamily:'Poppins-Bold', width:'35px', height:'35px'}
  const color = {
    '0' : {backgroundColor: '#EDEDED', color: 'black'},
    '4' : {backgroundColor: '#6A6C70', color: 'white'},
    '6' : {backgroundColor: '#265AF5', color: 'white'},
    'OUT' : {backgroundColor: '#A00D00', color: 'white'},
    'default' : {backgroundColor: '#DADADA', color: 'black'},
  }

  useEffect(() => {
    let runningmatch = JSON.parse(JSON.stringify(runningMatchData))
    let reverinningarr = (runningmatch?.innings && runningmatch?.innings.length > 0)
    ? runningmatch.innings[0].first_bat
    ? runningmatch.innings
    : runningmatch.innings.reverse()
    : []
    setFirstBatInningArray({...runningmatch,['innings']:[...reverinningarr]})
  }, [runningMatchData])

  
  return ( <>
    <Grid item lg={12} md={6} sm={12} xs={12}>
    <div style={fontStyle} className='p-2 fw-bold'>{runningMatchData && runningMatchData.length > 0 && scoreFunctions.getOutCome(runningMatchData)}
      </div>
      </Grid>
      {firstBatInningArray?.innings && firstBatInningArray?.innings.map((item,index) => {
        return ( <>
          <div style={{backgroundColor: '#222B42'}} className="text-white d-flex justify-content-between w-100 fw-bold p-3 pe-4" 
          onClick={() => setToggle({...toggle,[index]:!toggle[index]})}>
            <div>{item.batting_team} Inning {item?.runs_scored}-{item?.wickets_lost} ({scoreFunctions.getApproxOvers(item.overs_played)})</div>
            <div>{!toggle[index] && <FaChevronDown /> || <FaChevronRight />}</div>
          </div>
          <Grid item lg={12} md={6} sm={12} xs={12} style={toggle[index] && {display:'none'} || {}}>
              {firstBatInningArray?.overs?.length > 0 && JSON.parse(JSON.stringify(firstBatInningArray.overs)).reverse().map((overs,ovr_index) => {
                if(overs.batted_team_id === item.batted_team_id && overs.deliveries.length > 0){
                  let overRun = overs.deliveries.reduce((acc,cur) => {
                    acc = Number(acc) +  Number(cur.runs)
                    if(cur.extra.run_type === "BYE" || cur.extra.run_type === "LB"){
                    acc = Number(acc) +  Number(cur.extra.run) 
                    }else if(cur.extra.run_type === "WD"  || cur.extra.run_type.includes("NB")){
                    acc = Number(acc) +  Number(cur.extra.run) + 1
                    }
                    return acc
                  },"")
                  let over_players = {batsman:[],bowler:[]}
                  for(let i=0;i<overs.deliveries.length;i++){
                    if(!over_players.batsman.includes(overs.deliveries[i].striker.players_name)){
                      over_players.batsman.push(overs.deliveries[i].striker.players_name)
                    }
                    if(!over_players.bowler.includes(overs.deliveries[i].bowler.players_name)){
                      over_players.bowler.push(overs.deliveries[i].bowler.players_name)
                    }
                  }
                  return (
      <Table className="mui-table border" width="50%" overflow="auto" >
            <TableBody>
                <TableRow >
                <TableCell width='15%' className="ps-5 fw-bold">
                  <div className='fw-bold'>Ov {overs.over+1}</div>
                  <div className='text-secondary'>{overRun} run</div>
                  </TableCell>
                <TableCell className="text-secondary">
                <div>{over_players.bowler.join(" & ")} to {over_players.batsman.join(" & ")}</div>
                <div className="d-flex align-items-center mt-1">
                  {overs.deliveries.map((deliveries) => {
                    let keyitem = deliveries?.wicket ? color["OUT"] : color[deliveries.runs] ? color[deliveries.runs] : color["default"];
                    return (
                  <div className="text-center ms-2 h-100" key={index}>
                    <div
                      className="rounded-circle p-1 d-flex justify-content-center align-items-center"
                      style={{ ...fontStyle1, ...keyitem }}
                    >
                      {deliveries?.wicket
                    ? ((deliveries?.runs > 0 && "W "+deliveries.runs) || (deliveries?.extra?.run && "W "+deliveries.extra.run) || "W")
                    : deliveries?.extra?.run 
                    ? deliveries.extra.run
                    : deliveries.runs}
                    </div>
                    <div style={{ opacity: (deliveries?.extra.run_type && 1) || 0 }}>
                      {deliveries?.extra.run_type || "-"}
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
                </TableCell>
              </TableRow>
          
            </TableBody>
            </Table>
         
         )
        }
      })}
      </Grid>
         </>)
      })}
    </>
  )
}

export default MatchOvers