import React, { useState,useEffect } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { Table } from "react-bootstrap";
import { getTopBatsman } from "@/customApi/tournament";
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

const Bat = () => {
const [topBatsman, setTopBatsman] = useState([])
const router = useRouter()

const getData = async () => {
  const params = { id : router.query.id }
  await getTopBatsman(params).then((res) => {
    if(res?.status){
      setTopBatsman(res.data)
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
            <TableCell  width={"18%"}>
              Players
            </TableCell>
            <TableCell  align="center" width={"8%"}>
              Matches
            </TableCell>
            <TableCell  align="center" >
              Innings
            </TableCell>
            <TableCell  align="center">
            Run
            </TableCell>
            <TableCell  align="center">
            4s
            </TableCell>
            <TableCell  align="center">
            6s
            </TableCell>
            <TableCell  align="center">
            50s
            </TableCell>
            <TableCell  align="center">
            100s
            </TableCell>
            <TableCell  align="center">
            Avg
            </TableCell>
            <TableCell  align="center">
            SR
            </TableCell>
            {/* <TableCell className=" fw-bold" align="center"></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {topBatsman && topBatsman.length > 0 && topBatsman.map((item,index) => {
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
            <TableCell align="center">{item?.runs_scored || 0}</TableCell>
            <TableCell align="center">{item?.fours || 0}</TableCell>
            <TableCell align="center">{item?.sixes || 0}</TableCell>
            <TableCell align="center">{item?.fifty || 0}</TableCell>
            <TableCell align="center">{item?.hundred || 0}</TableCell>
            <TableCell align="center">{item?.avg || 0}</TableCell>
            <TableCell align="center">{item?.strike_rate || 0}</TableCell>
          </TableRow>
            )
          }) ||
          <TableRow>
          <TableCell align="center" colSpan={10} className="text-center">Data Not Available</TableCell>
          </TableRow>
          }
        </TableBody>
      </StyledTable>
    </div>

  );
};

export default Bat;
