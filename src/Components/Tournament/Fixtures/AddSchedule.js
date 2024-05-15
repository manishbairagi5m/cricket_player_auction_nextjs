import React, { useState, useEffect } from "react";
import { Button, Checkbox } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from "@mui/material/Box";
import ScheduleMatches from "@/Components/Tournament/Fixtures/ScheduleMatches";
import TeamGroups from "@/Components/Tournament/Fixtures/TeamGroups";
import { getSingleTournamentAbout,getTeamList,CreateGroup,getGroupWiseTeam,deleteGroup,getMatchList, updateGroup } from "@/customApi/tournament";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddSchedule = ({tournament}) => {
  const [tab, setTab] = useState({
    'Pre League':'',
    'Super League':'',
    'Pre QF':'',
    'QF':'',
    'Semi Final':'',
    'Final':'',
  });
  let obj = {
    'PRE_LEAGUE':'Pre League',
    'SUPER_LEAGUE':'Super League',
    'PRE_QF':'Pre QF',
    'QF':'QF',
    'SEMI_FINAL':'Semi Final',
    'FINAL':'Final',
  }

  const [group, setGroup] = useState("");
  const [modal, setModal] = useState({open:false,data:''});
  const [isGroups, setIsGroups] = useState(false);
  const [tournamentData, setTournamentData] = useState({});
  const [groupData, setGroupData] = useState([]);
  const [value, setValue] = useState("League");
  const [team, setTeam] = useState([])
  const router = useRouter()


  const getFixtureData = async () => {
    const params = {tournament_id:router.query.id}
    await getMatchList(params).then((res) => {
      if(res?.status){
        let arr = {...tab}
        for(let i =0;i<res.data.length;i++){
          if(res.data[i].tournament_stages && res.data[i].tournament_stages != "LEAGUE"){
            arr[obj[res.data[i].tournament_stages]] = obj[res.data[i].tournament_stages]
          }
        }
        setTab(arr)
      }
    })
   }

  const handleageChange = (event) => {
    setGroup(event.target.value);
    deleteOtherGroup(event.target.value)
    if(event.target.value === 'A'){
      setIsGroups(false)
      setTeamGroupA()
    }
    else{
      setIsGroups(true)
    }
    setModal({open:false,data:''})
  };

  const deleteOtherGroup = async (grp) => {
    let params = []
    if(grp === 'A'){
      params = groupData.reduce((acc,cur) => {
        if(cur.group_name === 'group_B' || cur.group_name === 'group_C' || cur.group_name === 'group_D'){
          acc.push(cur._id)
        }
        return acc
      },[])
    }else if(grp === 'AB'){
      params = groupData.reduce((acc,cur) => {
        if(cur.group_name === 'group_C' || cur.group_name === 'group_D'){
          acc.push(cur._id)
        }
        return acc
      },[])
    }
    for(let k=0;k<params.length;k++){
      await deleteGroup(params[k]).then((res) => {
      })
    }
  }

  const setTeamGroupA = async () => {
      let params = {team_id:[],tournament_id:router.query.id,group_id:(groupData[0]?.group_name === 'group_A' && groupData[0]?._id)}
      for(let i =0;i<team?.length;i++){
        params.team_id.push(team[i].team_id)
      }
      await updateGroup(params).then((res) => {
        if(res?.status){
          toast.success(res.message)
        }
      }).catch((err) => {
        toast.error(err.message)
      })
  }


  const getTeamCount = async () => {
    await getSingleTournamentAbout(router.query.id)
      .then((res) => {
        getGroupData()
        setTournamentData(res?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setValue(e.target.value);
      setTab({...tab, [e.target.value]:e.target.value});
    } else {
      setValue("League");
      setTab({...tab, [e.target.value]:''});
    }
  };

  const getDetail = async () => {
    let params = {tournament_id:router.query.id}
    await getTeamList(params).then((res) => {
      if(res?.status){
        setTeam(res?.data);
      }
    });
  };

  const isTournamentStarted = (show=false) => {
    if(tournament.from_date){
      let remDate = new Date() - new Date(tournament?.from_date)
      if(Number(remDate) > 0){
        if(show){
          toast.error('Cannot re-shedule on going tournament')
        }
        return true
      }
    }
    return false
  }

  const getGroupData = async () => {
    const params = {tournament_id:router.query.id}
    await getGroupWiseTeam(params).then((res) => {
      if(res?.status){
        setGroupData(res.data)
        let noGroup = res.data.reduce((acc,cur) => {
          acc += cur.group_name[cur.group_name.length-1]
          return acc
        },'')
        setGroup(noGroup)
      }
    })
  }
  useEffect(() => {
    getDetail()
  }, [])

  useEffect(()=>{
    getTeamCount()
  }, [])

  useEffect(()=>{
    getFixtureData()
  }, [])

  return (
    <>
    {tournamentData && Object.keys(tournamentData).length > 0 && <>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div>
            <Checkbox
              value="League"
              checked
              style={{ color: "black" }}
            />
            League
          </div>
          {Object.keys(tab).map((item,index) => {
            return (
              <div key={index}>
              <Checkbox
                value={item}
                checked={Object.values(tab)[index]}
                style={{ color: "black" }}
                onChange={handleChange}
              />
              {item}
            </div>      
            )
          })}
        </div>
        <div className="d-flex justify-content-end  align-items-center">
          <span className="me-3">Groups: </span>{" "}
          <span>
            <Box sx={{ minWidth: 120, width: 215 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Number Of Groups
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={group}
                  disabled={isTournamentStarted()}
                  label="Number Of Groups"
                  onChange={(e) => setModal({open:true,data:e})}
                >
                  <MenuItem value='A'>A</MenuItem>
                  <MenuItem value='AB'>AB</MenuItem>
                  <MenuItem value='ABCD'>ABCD</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </span>
        </div>
      </div>
      {group && group !== 'A' &&
      <div style={{ backgroundColor: "#ECECEC", borderRadius: 50 }} className="mt-3 w-25">
              <button
                onClick={() => setIsGroups(true)}
                style={{
                  backgroundColor: isGroups ? "#222B42" : "",
                  color: isGroups ? "#FFFFFF" : "#222B42",
                  borderRadius: 50,
                  border: "none",
                }}
                className="p-2 ps-4 pe-4 w-50"
              >
                Groups
              </button>
              <button
                onClick={() =>setIsGroups(false)}
                style={{
                  backgroundColor: !isGroups ? "#222B42" : "",
                  color: isGroups ? "#222B42" : "#FFFFFF",
                  borderRadius: 50,
                  border: "none",
                }}
                className="p-2 ps-4 pe-4 w-50"
              >
                Matches
              </button>
            </div>}
      <hr className="mt-3 mb-2" />

    {Object.keys(tournamentData)?.length > 0 ? !isGroups  &&  <ScheduleMatches tournamentData={tournamentData} tab={tab} team={team}/> ||
    <TeamGroups tournamentData={tournamentData} group ={group} groupData={groupData} getGroupData={getGroupData} isTournamentStarted={isTournamentStarted}/> : ''}

    <Dialog
        open={modal.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setModal({...modal,open:false})}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Change Group</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="mt-4 mb-5">
              {`Are You Sure You Want to Change Group to ${modal?.data?.target?.value}`}
              </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <div className="w-100 d-flex">
            <Button
              size="large"
              className="w-100 rounded-0 text-dark bglightgrey fw-bold"
              onClick={() => setModal({...modal,open:false})}
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
              className="w-100 rounded-0 text-white mainbgadmin fw-bold"
              sx={{
                ":hover": {
                  bgcolor: "#222B42",
                  color: "white",
                },
              }}
              onClick={() => handleageChange(modal.data)}
            >
              Confirm
            </Button>
          </div>
        </DialogActions>
      </Dialog> </>
      || <div className="w-100 text-center">Data Not Available</div>}
    </>
  );
};

export default AddSchedule;
