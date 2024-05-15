import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, Button, TextField } from "@mui/material";
import { GoPlus } from "react-icons/go";
import { FaChevronDown } from "react-icons/fa";
import { fixTeamMatch, getTeamList,getMatchList,getTournamentGround } from "@/customApi/tournament";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const SemiFinal = ({tournamentData,team,grounds}) => {
  const router = useRouter();
  const [match, setMatch] = useState([])

  const handleChange = (e,i) => {
    const { name,value} = e.target;
    let arr = [...match]
    arr[i][name] = value
    setMatch(arr)
  };
  
  const handleDisabled = (val) => {
    let isExist = false
    for(let i = 0; i< match.length;i++){
      if(match[i].teamA_id === val || match[i].teamB_id === val){
        isExist = true
      }
    }
    return isExist
  }

  const saveFixture = async (data) => {
    if(data?.match){
      toast.error("Cannot re-shedule running/completed match")
    }else{
    if(data.teamA_id && data.teamB_id && data.date && data.ground_id){
    let postData = {...data ,date:data.date+':00', tournament_stages: 'SEMI_FINAL',tournament_id:router.query.id}
    delete postData.match
    await fixTeamMatch(postData).then((res)=>{
      if(res?.status){
        toast.success(res.message)
      }
    }).catch((error)=>{
      toast.error(error.message)
    })
  }else{
    toast.error("Please fill all the fields of selected fixture")
    }}
 } 

 const getFixtureData = async () => {
  const params = {tournament_id:router.query.id, tournament_stages:'SEMI_FINAL'}
  await getMatchList(params).then((res) => {
    if(res?.status){
      let matcharr = []
      for(let i =0; i< 2 ;i++){
        if(res.data[i]){
          matcharr.push({teamA_id :res.data[i]?.teamA_id,teamB_id:res.data[i]?.teamB_id,date:res.data[i]?.date.slice(0,-3),fixture_id:res.data[i]._id, 
            ground_id:res.data[i]?.ground_id,match:res.data[i].match ? true : false})
        }else{
          matcharr.push({teamA_id :'',teamB_id:'',date:'', ground_id:''})
        }
      }
      setMatch(matcharr)
    }
  })
 }



useEffect(() => {
  getFixtureData()
}, []);


  return (
    <>
      <table className="mt-4 w-100 ">
        <thead>
          <tr>
          <th style={{ fontSize: 17, fontFamily: "Poppins-Bold"  }} className="text-center fw-bold pb-3" colSpan={2}>
              Semi Final Matches
            </th>
          </tr>
        </thead>
        <tbody className="mt-4">

{
  match?.map((item, index)=>{
    return(
      <tr key={index}>
      <td>{index+1}</td>
      <td>
        <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
          <InputLabel id="demo-select-small-label">
            Select Team
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            className="text-start"
            value={item.teamA_id}
            label="Select Team"
            name='teamA_id'
            onChange={(e) => handleChange(e,index)}
          >
            {(team).map((item) => {
              return ( 
                <MenuItem key={item._id} disabled={handleDisabled(item.team_id)} value={item?.team_id}>{item?.team_name}</MenuItem>
                )
            })}
          </Select>
          {/* <FaChevronDown className="svg-adjust"/> */}
        </FormControl>
      </td>
      <td className="text-center">V/S</td>
      <td className="text-center">
        <FormControl sx={{ m: 1, minWidth: 160 }} size="small">
          <InputLabel id="demo-select-small-label">
            Select Team
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            className="text-start"
            value={item.teamB_id}
            name='teamB_id'
            label="Select Team"
            onChange={(e) => handleChange(e,index)}
          >
             {(team).map((item) => {
              return ( 
                <MenuItem key={item._id} disabled={handleDisabled(item.team_id)} value={item?.team_id}>{item?.team_name}</MenuItem>
                )
            })}
          </Select>
        </FormControl>
      </td>
      <td className="text-center">
        <TextField
          sx={{ m: 1, minWidth: 160 }}
          fullWidth
          size="small"
          name="date"
          inputProps={{
            min: tournamentData?.from_date+"T00:00",
          }}
          className="text-start"
          type="datetime-local"
          value={item.date}
          onChange={(e) => handleChange(e,index)}
        />
      </td>

      <td className="ps-3 text-center">
        <FormControl sx={{ m: 1, minWidth: 210 }} size="small">
          <InputLabel id="demo-select-small-label">
          Select Ground
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            name='ground_id'
            value={item.ground_id}
            label="Select Ground"
            onChange={(e) => handleChange(e,index)}
          >
            {grounds.map((item1) => {
              return (
                <MenuItem key={item1?.spot_id} value={item1?.spot_id}>{item1?.spot_name}</MenuItem>
              )
            })}
          </Select>

        </FormControl>
      </td>

      <td>
        <Button
          style={{ backgroundColor: "#222B42" }}
          className="ms-3 ps-5 pe-5"
          variant="contained"
          onClick={() => saveFixture(item)}
        >
          Save
        </Button>
      </td>
      {/* <td style={{width : 78}} className="text-center ms-2"><TextField aria-readonly className="ms-2" size="small" value={"No Results"} sx={{ m: 1, minWidth: 160 }}/></td> */}
    </tr>
    )
  })
}     
        </tbody>
      </table>
  
    </>
  );
};

export default SemiFinal