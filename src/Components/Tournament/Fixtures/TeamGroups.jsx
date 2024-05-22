import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { getGroups, getTeamList,CreateGroup } from "@/customApi/tournament";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const TeamGroups = ({ tournamentData, group,groupData,getGroupData,isTournamentStarted }) => {
  const [state, setState] = useState([]);
  const [team, setTeam] = useState([]);
  const [groupId, setGroupId] = useState([]);
  const router = useRouter();

  const getData = async () => {
    await getGroups().then((res) => {
      getDetail();
      if (res?.status) {
        setGroupId(res.data);
        let data = {group_A:[],group_B:[]};
        if(group === "ABCD"){
        data = {group_A:[],group_B:[],group_C:[],group_D:[]};
        }
      for (let i = 0; i < tournamentData?.no_of_teams/(group === "ABCD" && 4 || 2); i++) {
      for (let j = 0; j < (group === "ABCD" && 4 || 2); j++) {
        if(groupData[j]){
          data[Object.keys(data)[j]].push({team_id: groupData[j].team[i] || ''})
        }else{
          data[Object.keys(data)[j]].push({team_id: ''})
        }
      }
      }
        setState({ ...data });
      }
    });
  };



  const getDetail = async () => {
    let params = { tournament_id: router.query.id };
    await getTeamList(params).then((res) => {
      if (res?.status) {
        setTeam(res?.data);
      }
    });
  };

  const handleChange = (e, i, grp) => {
    const { name, value } = e.target;
      let arr = [...state[grp]];
      arr[i][name] = value;
      setState({...state,[grp]: [...arr]});
  };

  const handleDisabled = (val) => {
    let isExist = false;
    if (val) {
      for (let i = 0; i < Object.keys(state).length; i++) {
        for (let j = 0; j < state[Object.keys(state)[i]].length; j++) {
          if (state[Object.keys(state)[i]][j].team_id === val) {
            isExist = true;
          }
      }
      }
    }
    return isExist;
  };

  const getGroupId = (gname) => {
    let data = groupId.reduce((acc,cur) => {
      if(cur.name === gname){
        acc = cur._id
      }
      return acc
    },'')
    return data
  }

  const handleSubmit = async () => {
    if(!isTournamentStarted(true)){
      let params = {team_id:[],tournament_id:router.query.id,group_id:''}
      let resdata = ''
      for(let i=0;i<Object.keys(state).length;i++){
        params = {team_id:[],tournament_id:router.query.id,group_id:getGroupId(Object.keys(state)[i])}
        for(let j=0;j<state[Object.keys(state)[i]].length;j++){
          state[Object.keys(state)[i]][j]?.team_id && params.team_id.push(state[Object.keys(state)[i]][j]?.team_id)
        }
        await CreateGroup(params).then((res) => {
          if(res?.status){
            resdata = res
          }
        }).catch((err) => {
          toast.error(err.message)
        })
      }
      if(resdata){
        toast.success(resdata.message)
        getGroupData()
        getData()
      }
    }
}


  useEffect(() => {
    getData();
  }, [group,groupData]);

  return (
    <div className="ps-5 pe-5">
      <Table className="" width="75%" overflow="auto">
        <TableHead className="table-head bglightgrey">
          <TableRow>
            <TableCell className="fw-bold text-center">Group A</TableCell>
            <TableCell className="fw-bold text-center">Group B</TableCell>
            {group === "ABCD" && <>
              <TableCell className="fw-bold text-center">Group C</TableCell>
              <TableCell className="fw-bold text-center">Group D</TableCell>
              </>}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell className="text-center">
              {state.group_A &&
                state.group_A.length > 0 &&
                state.group_A.map((item, index) => {
                  return (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Select Team
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="text-start"
                          value={item.team_id}
                          name="team_id"
                          label="Select Team"
                          onChange={(e) => handleChange(e, index, "group_A")}
                        >
                        <MenuItem value="">None</MenuItem>
                          {team &&
                            team.length > 0 &&
                            team.map((item, index) => {
                              return (
                                <MenuItem
                                key={index}
                                  disabled={handleDisabled(item.team_id)}
                                  value={item.team_id}
                                >
                                  {item.team_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      <br />
                    </>
                  );
                })}
              <br />
            </TableCell>
            <TableCell className="text-center">
              {state.group_B &&
                state.group_B.length > 0 &&
                state.group_B.map((item, index) => {
                  return (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Select Team
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="text-start"
                          value={item.team_id}
                          name="team_id"
                          label="Select Team"
                          onChange={(e) => handleChange(e, index, "group_B")}
                        >
                        <MenuItem value="">None</MenuItem>
                          {team &&
                            team.length > 0 &&
                            team.map((item, index) => {
                              return (
                                <MenuItem
                                key={index}
                                  disabled={handleDisabled(item.team_id)}
                                  value={item.team_id}
                                >
                                  {item.team_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      <br />
                    </>
                  );
                })}
              <br />
            </TableCell>
                {state?.group_C &&
            <TableCell className="text-center">
              {state?.group_C &&
                state.group_C.length > 0 &&
                state.group_C.map((item, index) => {
                  return (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Select Team
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="text-start"
                          value={item.team_id}
                          name="team_id"
                          label="Select Team"
                          onChange={(e) => handleChange(e, index, "group_C")}
                        >
                        <MenuItem value="">None</MenuItem>
                          {team &&
                            team.length > 0 &&
                            team.map((item, index) => {
                              return (
                                <MenuItem
                                key={index}
                                  disabled={handleDisabled(item.team_id)}
                                  value={item.team_id}
                                >
                                  {item.team_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      <br />
                    </>
                  );
                })}
              <br />
            </TableCell>}
            {state?.group_D &&
            <TableCell className="text-center">
              {state?.group_D &&
                state.group_D.length > 0 &&
                state.group_D.map((item, index) => {
                  return (
                    <>
                      <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
                        <InputLabel id="demo-select-small-label">
                          Select Team
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          className="text-start"
                          value={item.team_id}
                          name="team_id"
                          label="Select Team"
                          onChange={(e) => handleChange(e, index, "group_D")}
                        >
                        <MenuItem value="">None</MenuItem>
                          {team &&
                            team.length > 0 &&
                            team.map((item, index) => {
                              return (
                                <MenuItem
                                key={index}
                                  disabled={handleDisabled(item.team_id)}
                                  value={item.team_id}
                                >
                                  {item.team_name}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      <br />
                    </>
                  );
                })}
              <br />
            </TableCell>}

          </TableRow>
        </TableBody>
      </Table>
        <div className="w-100 d-flex justify-content-center">
          <Button
            style={{
              backgroundColor: "#222B42",
            }}
            className="mt-3 fw-bold w-25"
            variant="contained"
          onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
    </div>
  );
};

export default TeamGroups;
