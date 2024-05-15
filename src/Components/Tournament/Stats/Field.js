import React, {useState, useEffect} from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import { Table } from "react-bootstrap";
// import { getTopFielder } from "services/admin/Tournamet";
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

const Field = () => {
  const [topFielder, setTopFielder] = useState([])
// const { id } = useParams()

const getData = async () => {
  // const params = { id : id }
  // await getTopFielder(params).then((res) => {
  //   if(res?.status){
  //     setTopFielder(res.data)
  //   }
  // })
}

useEffect(() => {
  getData()
}, [])

  return(
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
        <TableCell  width={"22%"}>
          Players
        </TableCell>
        <TableCell  align="center" >
          Matches
        </TableCell>
        <TableCell  align="center">
        Dismissal
        </TableCell>
        <TableCell  align="center">
        catches
        </TableCell>
        <TableCell  align="center">
        Run Out
        </TableCell>
        {/* <TableCell className=" fw-bold" align="center"></TableCell> */}
      </TableRow>
    </TableHead>
    <TableBody>
      {topFielder && topFielder.length > 0 && topFielder.map((item,index) => {
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
          <span className="ms-2">{item?.players_name || "-"}</span>
        </TableCell>
        <TableCell align="center">{item?.match || "-"}</TableCell>
        <TableCell align="center">{(item?.caught || 0)+(item?.run_out || 0)}</TableCell>
        <TableCell align="center">{item?.caught || 0}</TableCell>
        <TableCell align="center">{item?.run_out || 0}</TableCell>
      </TableRow>
        )
      })
      ||
      <TableRow>
      <TableCell colSpan={6} align="center">Data Not Available</TableCell>
      </TableRow>
      }
    
    </TableBody>
  </StyledTable>
</div>

  )
}

export default Field