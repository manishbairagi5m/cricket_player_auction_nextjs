import React, { useState,useEffect } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { Table } from "react-bootstrap";
import { getTopMvp } from "@/customApi/tournament";
import { useRouter } from "next/router";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const Mvp = () => {
  const [topMvp, setTopMvp] = useState([])
  const router = useRouter()

const getData = async () => {
  const params = { id : router.query.id }
  await getTopMvp(params).then((res) => {
    if(res?.status){
      setTopMvp(res.data)
    }
  })
}

useEffect(() => {
  getData()
}, [])

  return (
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

        <TableCell width={"22%"} style={{paddingLeft:'30px'}}>
          Players
        </TableCell>
        <TableCell  align="center" >
        Batting
        </TableCell>
        <TableCell align="center">
        Bowling
        </TableCell>
        {/* <TableCell className=" fw-bold" align="center">
        Fielding
        </TableCell> */}
        <TableCell  align="center">
        Total/point
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {topMvp && topMvp.length > 0 && topMvp.map((item,index) => {
        return (
      <TableRow key={index}>
        {/* <TableCell align="center">{index+1}</TableCell> */}
        <TableCell className="ps-2">
        {/* {
                item.players_image && 
                <img
                  style={{ width: 50, height: 50, borderRadius: "50%", objectFit:'cover', border: '1px solid #8d8d8d', padding: '4px' }}
                  src={item.players_image}
                  alt=""
                /> || 
              <img
                style={{  width: 50, height: 50, borderRadius: "50%", objectFit:'cover',border: '1px solid #8d8d8d', padding: '4px' }}
                src={loginImg}
                alt=""
              />
              } */}
          <span className="ms-2">{item?.players_name}</span>
        </TableCell>
        <TableCell align="center">{item?.batting_mvp && item?.batting_mvp.toFixed(2)}</TableCell>
        <TableCell align="center">{item?.bowling_mvp && item?.bowling_mvp.toFixed(2)}</TableCell>
        <TableCell align="center">{item?.total_mvp && item?.total_mvp.toFixed(2)}</TableCell>
      </TableRow>
        )
      })
      ||
          <TableRow>
          <TableCell align="center" colSpan={5} className="text-center">Data Not Available</TableCell>
          </TableRow>}
    
   
    </TableBody>
  </StyledTable>
</div>



  )
}

export default Mvp