import React, { useState,useEffect } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { Table } from "react-bootstrap";
// import { getOverAllStats } from "services/admin/Tournamet";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const Overall = () => {
  const [topStats, setTopStats] = useState([])
  // const { id } = useParams()

const getData = async () => {
  // const params = { id : id }
  // await getOverAllStats(params).then((res) => {
  //   if(res?.status){
  //     setTopStats(res.data)
  //   }
  // })
}

useEffect(() => {
  getData()
}, [])

  return (
    <div className="pb-3">
      {/* Batting  */}
      <h4 className='mb-2'>Batting</h4>
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
        <TableCell className=" w-bold" align="center">
          Matches
        </TableCell>
        <TableCell className=" fw-bold" align="center">
          Innings
        </TableCell>
        <TableCell className=" fw-bold" align="center" >
        Not Out
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Run
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Highest
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Duck
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        50s
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        100s
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        4s
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        6s
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
          <TableRow>
          <TableCell align="center" className="text-center">{topStats?.match || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.innings || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.not_out || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.runs_scored || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.highest || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.duck || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.fifty || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.hundred || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.fours || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.sixes || 0}</TableCell>
          </TableRow>
    </TableBody>
  </StyledTable>

{/* Bowling  */}
<h4 className="mt-4 mb-2">Bowling</h4>
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
        <TableCell className=" w-bold" align="center">
          Matches
        </TableCell>
        <TableCell className=" fw-bold" align="center">
          Innings
        </TableCell>
        <TableCell className=" fw-bold" align="center" >
        Over
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Run
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Maidens
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Wkt
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Best/Bowl
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        5Wkt
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Wide
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        No/Ball
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Dot{"'"}s/ball
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
          <TableRow>
          <TableCell align="center" className="text-center">{topStats?.match || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.innings || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.overs || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.runs_scored || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.maidens || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.wickets || 0}</TableCell>
          <TableCell align="center" className="text-center">{'-'}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.five_wickest || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.wides || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.no_ball || 0}</TableCell>
          <TableCell align="center" className="text-center">{'-'}</TableCell>
          </TableRow>
    </TableBody>
  </StyledTable>

{/* Fielding  */}
<h4 className="mt-4 mb-3">Fieldings</h4> 
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
        <TableCell className=" w-bold" align="center">
          Matches
        </TableCell>
        <TableCell className=" fw-bold" align="center">
          Catches
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Run Out{"'"}s
        </TableCell>
        <TableCell className=" fw-bold" align="center">
        Stumping
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
          <TableRow>
          <TableCell align="center" className="text-center">{topStats?.match || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.catches || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.run_outs || 0}</TableCell>
          <TableCell align="center" className="text-center">{topStats?.stumpings || 0}</TableCell>
          </TableRow>
    </TableBody>
  </StyledTable>
</div>



  )
}

export default Overall