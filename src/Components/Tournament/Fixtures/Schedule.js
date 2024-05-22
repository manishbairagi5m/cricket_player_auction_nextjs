import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  styled,
  Table,
  TableBody,
  InputLabel,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { getMatchList,getScorerList,changeScorerFixture } from "@/customApi/tournament";
import { scoreFunctions } from "@/Components/Tournament/StartMatch/scoring/scoreFunctions";
import { Helper } from "@/Helper";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Schedule = () => {
  const [matchList, setMatchlist] = useState([]);
  const [scorerModal, setScorerModal] = useState(false);
  const [scorerList, setScorerList] = useState(null);
  const [selectScorer, setSelectScorer] = useState({ scorer_id:null,fixture_id:null});

  const router = useRouter();
  
  let obj = {
    PRE_LEAGUE : "Pre League",
    LEAGUE : "League",
    SUPER_LEAGUE : "Super League",
    PRE_QF : "Pre QF",
    QF : "QF",
    SEMI_FINAL : 'Semi Final',
    FINAL : "Final",
  }

  const getData = async () => {
    const params = {
      tournament_id: router.query.id,
    };
    await getMatchList(params)
      .then((res) => {
        setMatchlist(res?.data);
        getScorer()       
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getScorer = async () => {
    await getScorerList().then((res)=>{
      if(res?.status){
        setScorerList(res.data)
      }
    })
  }

  const handleScorer = async () => {
    await changeScorerFixture(selectScorer).then((res)=>{
      if(res?.status){
        setScorerModal(false)
        getData("",page)
        toast.success(res.message)
      }
    }).catch((err)=> {
      toast.error(err.message)
    })
  }



  useEffect(() => {
    getData();
  }, []);

  return (
    <Table sx={{ minWidth: 400 }} aria-label="customized table" style={{ tableLayout: "auto" }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#222B42" }}>
          <TableCell align="center">
            <b style={{ color: "#fff" }}>Match No.</b>
          </TableCell>
          <TableCell align="center" >
            <b style={{ color: "#fff" }}>Date</b>
          </TableCell>
          <TableCell align="center" >
            <b style={{ color: "#fff" }}>Time</b>
          </TableCell>
          <TableCell align="center" width="25%  " >
            <b style={{ color: "#fff" }}>Team</b>
          </TableCell>
          <TableCell align="center" >
            <b style={{ color: "#fff" }}>Team(IST)</b>
          </TableCell>
          <TableCell align="center" >
            <b style={{ color: "#fff" }}>Venue</b>
          </TableCell>
          <TableCell align="center" >
            <b style={{ color: "#fff" }}>Scorer</b>
          </TableCell>
          <TableCell align="center" >
          <b style={{ color: "#fff" }}>Action</b>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {matchList &&
          matchList.length > 0 &&
          matchList.filter((item)=> !item?.match?.outcome).map((item, index) => {
            return (
              (
                <StyledTableRow key={index}>
                  <TableCell align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">{item?.date &&  (item.date.slice(0,10)).split("-").reverse().join("-")}</TableCell>
                  <TableCell align="center">{item.date && Helper.convert24to12(item.date.slice(11,16))}</TableCell>
                  <TableCell align="center">
                    {item?.teamA_name} vs {item?.teamB_name}
                  </TableCell>
                  <TableCell align="center">
                    {obj[item?.tournament_stages]}
                  </TableCell>
                  <TableCell align="center">
                    {item.ground_name}
                  </TableCell>
                  <TableCell align="center">
                    {item?.scorer_name}
                  </TableCell>
                  <TableCell align="center" >
                  <Button variant="contained" onClick={()=> {setScorerModal(true);setSelectScorer({scorer_id:item?.scorer_id,fixture_id:item._id})}}
                      style={{ backgroundColor: "#222B42" }}
                      className="ps-2 pe-2"
                  >{item.scorer_id ? "Change" : 'Assign'} Scorer</Button>
                </TableCell>
                </StyledTableRow>
              )
            );
          }) || 
          <StyledTableRow >
            <TableCell align="center" colSpan={6}>
              No Schedule Matches
            </TableCell>
          </StyledTableRow>
          }
      </TableBody>

      <Dialog
          open={scorerModal}
          onClose={() => setScorerModal(false)}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "450px", 
              },
            },
          }}
        >
          <DialogTitle className="border border-bottom text-center">
            Assign/Change Scorer
          </DialogTitle>
          <DialogContent className="text-center" style={{padding:'0'}} >
            <div className="d-flex justify-content-center align-items-center p-4">
            <FormControl sx={{ m: 1, minWidth: 210 }}>
            <InputLabel id="demo-select-small-label">
              Select Scorer
              </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                name='scorer_id'
                className="text-start"
                value={selectScorer.scorer_id}
                label="Select Scorer"
                onChange={(e) => setSelectScorer({...selectScorer,[e.target.name]:e.target.value})}
              >
                <MenuItem value={null}>None</MenuItem>
                {scorerList && Array.isArray(scorerList) && scorerList.length > 0 && scorerList.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>{item?.name}</MenuItem>
                  )
                })}
              </Select>

            </FormControl>
            </div>
          </DialogContent>
          <DialogActions className="m-0 p-0">
          <div className="w-100 d-flex">
              <Button
                size="large"
                onClick={() => setScorerModal(false)}
                className="w-100 rounded-0 text-dark bglightgrey "
                sx={{
                  ":hover": {
                    bgcolor: "#DADADA",
                    color: "black",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="w-100 rounded-0 text-white mainbgadmin "
                onClick={() => handleScorer()}
                sx={{
                  ":hover": {
                    bgcolor: "#222B42",
                    color: "white",
                  },
                }}
              >
                Confirm Change
              </Button>
            </div>            
          </DialogActions>
        </Dialog>



    </Table>
  );
};

export default Schedule;
