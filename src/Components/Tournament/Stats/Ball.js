import React, { useState,useEffect } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { Table } from "react-bootstrap";
// import commonIcon from '../../../../../Assets/images/favicon.png'
// import { getTopBowler } from "services/admin/Tournamet";
// import { useParams } from "react-router-dom";
// import { loginImg } from "Assets";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

export const Ball = () => {
  const [topBowler, setTopBowler] = useState([])
// const { id } = useParams()

const getData = async () => {
  // const params = { id : id }
  // await getTopBowler(params).then((res) => {
  //   if(res?.status){
  //     setTopBowler(res.data.data)
  //   }
  // })
}

const getApproxOvers = (overs) => {
  return (String(overs).split(".")[1] === "6" && Number(String(overs).split(".")[0])+1 || overs)
}

useEffect(() => {
  getData()
}, [])


  return (
    // <SimpleCard>
    <div className="pb-3">
      <StyledTable
        className="mui-table stats"
        style={{ boxShadow: "none" }}
        width="100%"
        overflow="auto"
      >
        <TableHead
          className="table-head"
          style={{ backgroundColor: "#222B42" }}
        >
          <TableRow>
            <TableCell  width={"16%"}>
              Players
            </TableCell>
            <TableCell  align="center">
              Matches
            </TableCell>
            <TableCell  align="center">
              Innings
            </TableCell>
            <TableCell  align="center">
              Overs
            </TableCell>
            <TableCell  align="center">
              Balls
            </TableCell>
            <TableCell align="center">
              Wkts
            </TableCell>
            <TableCell  align="center">
              Runs
            </TableCell>
            <TableCell align="center">
              Economy
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topBowler && topBowler.length && topBowler.map((item,index) => {
            return (
          <TableRow key={index}>
            <TableCell className="ps-2">
            {/* {
                item.players_image && 
                <img
                  style={{ width: 50, height: 50, borderRadius: "50%", objectFit:'cover',border: '1px solid #8d8d8d', padding: '4px' }}
                  src={item.players_image}
                  alt=""
                /> || 
              <img
                style={{  width: 50, height: 50, borderRadius: "50%", objectFit:'cover',border: '1px solid #8d8d8d', padding: '4px'}}
                src={loginImg}
                alt=""
              />
              } */}
              <span className="ms-2">{item?.players_name || '-'}</span>
            </TableCell>
            <TableCell align="center">{item?.match || 0}</TableCell>
            <TableCell align="center">{item?.innings || 0}</TableCell>
            <TableCell align="center">{getApproxOvers(item?.overs_bowled || 0)}</TableCell>
            <TableCell align="center">{item?.balls || 0}</TableCell>
            <TableCell align="center">{item?.wickets_taken || 0}</TableCell>
            <TableCell align="center">{item?.runs_conceded || 0}</TableCell>
            <TableCell align="center">{item?.run_rate || 0}</TableCell>
          </TableRow>
            )
          })
          ||
          <TableRow>
          <TableCell align="center" colSpan={8} className="text-center">Data Not Available</TableCell>
          </TableRow>}
        </TableBody>
      </StyledTable>
    </div>
  )
};
