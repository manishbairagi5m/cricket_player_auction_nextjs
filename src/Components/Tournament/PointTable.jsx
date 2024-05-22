import React,{useEffect, useState} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getMatchList,getGroupWiseTeam,getTeamList } from "@/customApi/tournament";
import { useRouter } from "next/router";



export default function PointsTable (){
  const router = useRouter()
  const [matchData,setMatchData] = useState([])
  const [teamPoints,setTeamPoints] = useState([])
  const [groupsData,setGroupsData] = useState([])
  let groupObj = {
    group_A: "Group A",
    group_B: "Group B",
    group_C: "Group C",
    group_D: "Group D",
  }

  const getAllTeamDetails = async () => {
    let params = {tournament_id: router.query.id }
    await getTeamList(params).then((res) => {
      if(res?.status){
        let grpdata = []
        for(let i=0;i<res.data.length;i++){
          grpdata.push(res.data[i].team_name)
        }
        setGroupsData([{group_name:"group_A",team_name:[...grpdata]}])
      }
    })
  }

  const getGroupsData = async (teamdata) => {
    const params = { tournament_id : router.query.id}
    await getGroupWiseTeam(params).then((res) => {
      if(res?.status){
        if(res.data.length > 0){
          setGroupsData(res.data)
        }else{
          if(Object.keys(teamdata).length > 0){
            setGroupsData([{group_name:"group_A",team_name:[...Object.keys(teamdata)]}])
          }else{
            getAllTeamDetails()
          }
        }
      }
    })
  }

  const getData = async () => {
    const params = { tournament_id : router.query.id}
    await getMatchList(params).then((res) => {
      if(res?.status){
        setMatchData(res.data)
        let resData = res.data
        let obj = {match:1,win:0,loose:0,tied:0,no_result:0,pts:0,nrr:0}
        let data = {}
        for(let i=0;i<resData.length;i++){
          if(resData[i]?.match?.outcome){
            let teamA = resData[i].teamA_name
            let teamB = resData[i].teamB_name
            data[teamA] = data[teamA] ? {...data[teamA], match:data[teamA].match+1 || 1} : {...obj}
            data[teamB] = data[teamB] ? {...data[teamB], match:data[teamB].match+1 || 1} : {...obj}
            if(resData[i].match?.outcome?.winner === resData[i].teamA_id){
              data[teamA] = {...data[teamA], win : data[teamA].win+1 || 1,pts : data[teamA].pts+2 || 2}
              data[teamB] = {...data[teamB], loose : data[teamB].loose+1 || 1,}
            }else if(resData[i].match?.outcome?.winner === resData[i].teamB_id){
              data[teamB] = {...data[teamB], win : data[teamB].win+1 || 1,pts : data[teamB].pts+2 || 2}
              data[teamA] = {...data[teamA], loose : data[teamA].loose+1 || 1,}
            }else{
              // if(resData[i].match.outcome?.winner){
                data[teamA] = {...data[teamA], tied : data[teamA].tied+1 || 1,pts : data[teamA].pts+1 || 1}
                data[teamB] = {...data[teamB], tied : data[teamB].tied+1 || 1,pts : data[teamB].pts+1 || 1}
              // }
              // else{
              //   data[teamA] = {...data[teamA],no_result : data[teamA].no_result+1 || 1}
              //   data[teamB] = {...data[teamB],no_result : data[teamB].no_result+1 || 1}
              // }
            }
            data[teamA].nrr += resData[i].match.innings[0].net_run_rate
            data[teamB].nrr += resData[i].match.innings[1].net_run_rate
          }else{
            data[resData[i].teamA_name] = data[resData[i].teamA_name] ? {...data[resData[i].teamA_name]} : {...obj,match:0}
            data[resData[i].teamB_name] = data[resData[i].teamB_name] ? {...data[resData[i].teamB_name]} : {...obj,match:0}
          }
        }
        getGroupsData(data)
        setTeamPoints(data)
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ backgroundColor: "#F5F5F5" }}>
      <TableContainer component={Paper} className="p-4">
        {groupsData && groupsData.length > 0 && groupsData.map((item,index) => {
          return ( <div className="mt-3 border rounded" key={index}>
        <div style={{ backgroundColor: "#DADADA", padding: 12, }} key={index}>
          <b>{groupsData.length > 1 && groupObj[item.group_name]} League {(new Date()).getFullYear()}</b>
        </div>
        <Table sx={{ minWidth: 400 }} aria-label="customized table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#222B42" }}>
              <TableCell align="center" width="15%" >
                <b>Team</b>
              </TableCell>
              <TableCell className="pe-2" align="right">
                <b>M</b>
              </TableCell>
              <TableCell className="pe-2" align="right">
                <b>W</b>
              </TableCell>
              <TableCell className="pe-2" align="right">
                <b>L</b>
              </TableCell>
              <TableCell className="pe-1" align="right">
                <b>Tied</b>
              </TableCell>
              <TableCell className="pe-1" align="right">
                <b>NR</b>
              </TableCell>
              <TableCell className="pe-1" align="right">
                <b>Pts</b>
              </TableCell>
              <TableCell className="pe-4" align="right">
                <b>NRR</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {item?.team_name.length > 0 && 
            item.team_name.sort((a,b)=> {
              return teamPoints[b]?.pts - teamPoints[a]?.pts
            }).sort((a,b)=> {
              if(teamPoints[b]?.pts === teamPoints[a]?.pts){
                return teamPoints[b]?.nrr - teamPoints[a]?.nrr
              }
            }).map((teamname,index1) => {
                return (
              <TableRow key={index1}>
                <TableCell align="center" >{teamname}</TableCell>
                <TableCell className="ps-5" align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.match || 0}</TableCell>
                <TableCell align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.win || 0}</TableCell>
                <TableCell align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.loose || 0}</TableCell>
                <TableCell align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.tied || 0}</TableCell>
                <TableCell align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.no_result || 0}</TableCell>
                <TableCell align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.pts || 0}</TableCell>
                <TableCell className="pe-4" align="right">{Object.keys(teamPoints).length > 0 && teamPoints[teamname]?.nrr 
                                                                  && teamPoints[teamname].nrr.toFixed(3) || "0.000"}
                </TableCell>
              </TableRow>
                )
            })}
          </TableBody>
        </Table>
        </div>)
        })}

     
      </TableContainer>
    </div>
  );
};

