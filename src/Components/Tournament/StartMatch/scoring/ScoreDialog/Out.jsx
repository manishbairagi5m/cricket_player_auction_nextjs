import  React, {useState} from 'react';
import {
    Button, TextField, Dialog, DialogActions,Checkbox,
    DialogContent, DialogContentText, DialogTitle,
    Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid,
    InputLabel, Select, MenuItem,  Slide,FormHelperText
} from '@mui/material';
import { ImCross } from "react-icons/im";
import Image from 'next/image';

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function Out(props) {
    const { onClose, open, handleWicket, bowling,batting,handleNextBatsman,runningMatchData,matchState,curInning } = props;
    const [outType, setOutType] = useState()
    const [outLabel, setOutLabel] = useState("")
    const [outHelping, setOutHelping] = useState(null)
    const [newBatsman, setNewbatsman] = useState({})
    const [outBatsman, setOutBatsman] = useState(null)
    const [extra, setExtra] = useState({run:"0",run_type:''})
    const [outModal, setOutModal] = useState(false)
    const [validate, setValidate] = useState({helper:false,new_batsman:false,out_batsman:false})
    const fontStyle = { fontFamily: "Poppins-Bold" }
    let checkBoxStyle= { '& .MuiSvgIcon-root': { fontSize: 18 } ,  color: "#2B344A",
                        '&.Mui-checked': {
                              color: "#2B344A",
                            }, }

    const outArr = [
    {value: "BOLD" ,      label: "Bowled", image: bowled },
    {value: "CAUGHT" ,    label: "Caught", image: caught },
    {value: "CAUGHT_BEHIND" ,    label: "Caught Behind", image: caught_behind },
    {value: "CAUGHT&BOWLED" ,    label: "Caught & Bowled", image: caught_bowled },
    {value: "STAMPING" ,  label: "Stumped", image: stumped },
    {value: "RUN_OUT" ,   label: "Runout", image: runout },
    {value: "LBW" ,       label: "LBW", image: lbw },
    {value: "HIT_WICKET" ,label: "Hit Wicket", image: hit_wicket },
    {value: "RETIRED_HURT" ,          label: "Retired Hurt", image: retired_hurt },
    {value: "RETIRED_OUT" ,          label: "Retired Out", image: retired_out },
    {value: "RUN_OUT(MANKADED)" ,          label: "Runout Mankand", image: runout_mankand },
    {value: "OBSTR(THE_FILED)" ,    label: "Obstr. Field", image: obstr_field },
  ];

    const handleClose = () => {
        onClose(false);
    };
    const handleOut = (value) => {
        setOutType(value)
        handleClose()
        setOutModal(true)
    }

    const alreadyPLayedPLayers = (playerid) => {
      let player = false  
      if(runningMatchData?.batsman){
        for(let i=0;i<runningMatchData?.batsman.length;i++){
          if(runningMatchData.batsman[i].players_id === playerid && runningMatchData.batsman[i].wickets.kind !== "RETIRED_HURT"){
            player = true
          }
          if(runningMatchData.batsman[i].players_id === playerid && runningMatchData.batsman[i].wickets.kind === "RETIRED_HURT"){
            if(matchState.striker.players_id === playerid || matchState.non_striker.players_id === playerid){
              player = true
            }
          }

        }
      }
      return player
    }

    const checkPlayers = () => {
      if(batting?.team_id && runningMatchData?.batsman){
        let data = runningMatchData.batsman.find((item)=> {
          if(item.team_id === batting.team_id && item.wickets.kind === "RETIRED_HURT" &&
           matchState.striker?.players_id !== item.players_id && matchState.non_striker?.players_id !== item.players_id){
            return item
          }
        })
        return data ? true : false
      }
    }

    const checkValidation = () => {
      let validated = {...validate}
      if(outLabel === "Runout"){
        if(!outBatsman){
          validated = {...validated,out_batsman:true}
        }else{
          validated = {...validated,out_batsman:false}
        }
        if(!outHelping){
          validated = {...validated,helper:true}
        }else{
          validated = {...validated,helper:false}
        }
      }else if(outLabel === "Caught" || outLabel === "Caught Behind" || outLabel === "Stumped"){
        if(!outHelping){
          validated = {...validated,helper:true}
        }else{
          validated = {...validated,helper:false}
        }
      }else{
        validated = {...validated,out_batsman:false,helper:false}
      }
      if(batting?.players && (batting.players.length !== curInning()?.batsmen.length) && batting.players.length > 0){
        if(Object.values(newBatsman).length > 0){
          validated = {...validated,new_batsman:false}
        }else{
          validated = {...validated,new_batsman:true}
        }
      }else{
        validated = {...validated,new_batsman:false}
      }
      setValidate(validated)
      if(Object.values(validated).includes(true)){
        return false
      }else{
        return true
      }
    }

    const handleSave = () => {
      if(checkValidation()){
        if((outLabel === "Caught" || outLabel === "Caught Behind" || outLabel === "Stumped" || outLabel === "Runout")){
          handleWicket(outType, {players_id:outHelping.players_id,players_name:outHelping.players_name},extra,outBatsman)
          handleClose()
          handleCancel()
        }else if(outLabel === "Runout Mankand"){
          handleWicket(outType,"",extra,{players_id:matchState.non_striker.players_id,players_name:matchState.non_striker.players_name})
          handleClose()
          handleCancel()
        }
        else if(outLabel === "OBSTR(THE_FILED)"){
          handleWicket(outType,"",extra,outBatsman)
          handleClose()
          handleCancel()
        }
        else{
          handleWicket(outType,"",extra)
          handleClose()
          handleCancel()
        }
        if(batting?.players && batting.players.length > 0 && (batting.players.length !== curInning()?.batsmen.length || checkPlayers())){
          if(outBatsman){
            handleNextBatsman({players_id:newBatsman.players_id,players_name:newBatsman.players_name},outBatsman,extra)
          }else if(outLabel === "Runout Mankand"){
            handleNextBatsman({players_id:newBatsman.players_id,players_name:newBatsman.players_name},{players_id:matchState.non_striker.players_id,players_name:matchState.non_striker.players_name})
          }else{
            handleNextBatsman({players_id:newBatsman.players_id,players_name:newBatsman.players_name})
          }
        }
      }else{
        return false
      }
    }

    const handleCancel = () => {
      setOutBatsman(null)
      setOutHelping(null)
      setNewbatsman({})
      setExtra({run:0,run_type:''})
      setValidate({helper:false,new_batsman:false,out_batsman:false})
      setOutModal(false)
    }


    return ( <>

    {/* select out how dialog  */}
         <Dialog 
        open={open}
        keepMounted
        fullWidth={true}
        maxWidth={"sm"}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-title" className="fw-bold">
          <div className="d-flex justify-content-between">
            Out How
            <ImCross onClick={() => handleClose()} />
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} className="mb-5">
            {outArr.map((item,index3) => {
              return (
                <Grid item lg={2.4} md={6} sm={12} xs={12} sx={{ mt: 1 }} key={index3}>
                  <div 
                    className="border rounded borderhover overflow-hidden"
                    style={{ height: "115px", width: "90px",cursor:'pointer' }}
                    onClick={() => {handleOut(item.value);setOutLabel(item.label)}}
                  >
                    <div className="w-100 d-flex justify-content-center align-items-center" style={{height:'87%'}}>
                      <Image src={`/Assets/Images/out_modals${item.image}.png`} alt="img" width={65} height={65} />
                    </div>
                    <div
                      className="fw-bold text-center bglightgrey "
                      style={{ fontStyle, fontSize: "10px" }}
                    >
                      {item?.label}
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>
      </Dialog> 



{/* select wicket and type  */}
        <Dialog open={outModal} onClose={() => handleCancel()} maxWidth='xs' fullWidth>
        <DialogTitle className="border border-bottom text-center fw-bold">
            {outLabel}
            </DialogTitle>
            <DialogContent className='p-5 pt-3'>
                <Grid container spacing={1}>

                  {/* select who helped  */}
                    {(outLabel === "Caught" || outLabel === "Caught Behind" || outLabel === "Stumped" || outLabel === "Runout") &&
                    <Grid item xs={12}>
                        {bowling?.players.length > 0 && 
                        <FormControl fullWidth error={validate.helper}>
                            <InputLabel >Who Helped</InputLabel>
                            {
                                bowling !== null
                                && <Select
                                    label="Who Helped"
                                    // value={bowling.players}
                                    onChange={(e) => setOutHelping(e.target.value)}
                                >
                                    {
                                        bowling.players.map(item => <MenuItem key={item._id} 
                                          // disabled={item.players_id === matchState.bowler.players_id}
                                           value={item}>{item.players_name}</MenuItem>)
                                    }
                                </Select>
                            }
                             <FormHelperText>{validate.helper && "Helper Required" || ""}</FormHelperText>
                        </FormControl>
                        }
                    </Grid>}  

                {/* wicket condition label  */}
                    <Grid item xs={12}>
                    {(outLabel === "Bowled" || outLabel === "LBW" || outLabel === "Hit Wicket"
                    || outLabel === "Obstr. Field" || outLabel === "Retired Hurt" || outLabel === "Retired Out" || 
                    outLabel === "Caught & Bowled" || outLabel === "Runout Mankand") && <>
                       <div className='p-2 d-flex justify-content-center align-items-center text-secondary'>
                        Confirm Out - {outLabel}
                        </div>
                        {outLabel !== "Runout Mankand" && 
                       <div className='p-2 d-flex justify-content-center align-items-center text-secondary'>
                        Batsman - {matchState.striker?.players_name}
                        </div>}
                        {outLabel === "Runout Mankand" && 
                       <div className='p-2 d-flex justify-content-center align-items-center text-secondary'>
                        Batsman - {matchState.non_striker?.players_name}
                        </div>}
                       <div className='p-2 d-flex justify-content-center align-items-center text-secondary'>
                        Bowler - {matchState.bowler?.players_name}
                        </div>
                        </>
                        }
                    </Grid>

                    
                    {/* select out batsman  */}
                    {(outLabel === "Runout" || outLabel === "Obstr. Field") &&
                    <Grid item xs={12}>
                      {[matchState.striker,matchState.non_striker].length > 0 && 
                        <FormControl fullWidth error={validate.out_batsman}>
                            <InputLabel id="demo-simple-select-label" >Select Out Batsman</InputLabel>
                            {
                                batting !== null
                                && <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select Out Batsman"
                                    onChange={(e) => setOutBatsman(e.target.value)}
                                >
                                    {
                                        [matchState.striker,matchState.non_striker].map(item => <MenuItem key={item._id} value={item}>{item.players_name}</MenuItem>)
                                    }
                                </Select>
                            }
                              <FormHelperText>{validate.out_batsman && "Out Batsman Required" || ""}</FormHelperText>
                        </FormControl>
                      }
                    </Grid>
                    }

        {/* for extra run  */}
              {outLabel === "Stumped" ? 
              <Grid item xs={12} className='ms-1 mt-1'>
              <FormControlLabel
                  onChange={(e) => e.target.checked ? setExtra({run:0,["run_type"]:"WD"}) : setExtra({run:0,["run_type"]:""})}
                  control={<Checkbox sx={checkBoxStyle}/>}
                  label="Wide"
                  labelPlacement="end"
                />
                </Grid>
              :""}


              {/* for runout and extra all type   */}
              {outLabel === "Runout" ?  <>
                    <Grid item xs={12} className='mt-2'>
                      <TextField
                          fullWidth
                          id="run"
                          label="Run"
                          name="run"
                          type="text"
                          value={extra.run}
                          variant="outlined"
                          onChange={(e) => {
                            if(["","0","1","2","3","4","5","6"].includes(e.target.value)){
                            setExtra({...extra,[e.target.name]:e.target.value})}
                          }}
                      />
                    </Grid> 
                    <Grid item xs={12}>
                      <FormControlLabel
                          onChange={(e) => e.target.checked ? setExtra({...extra,["run_type"]:"WD"}) : setExtra({...extra,["run_type"]:""})}
                          control={<Checkbox size='small' sx={checkBoxStyle}/>}
                          label="Wide"
                          checked={extra.run_type === "WD"}
                          labelPlacement="end"
                        />
                      <FormControlLabel
                          onChange={(e) => e.target.checked ? setExtra({...extra,["run_type"]:"NB"}) : setExtra({...extra,["run_type"]:""})}
                          control={<Checkbox size='small' sx={checkBoxStyle}/>}
                          label="No Ball"
                          checked={extra.run_type === "NB"}
                          labelPlacement="end"
                        />
                      <FormControlLabel
                          onChange={(e) => e.target.checked ? setExtra({...extra,["run_type"]:"BYE"}) : setExtra({...extra,["run_type"]:""})}
                          control={<Checkbox size='small' sx={checkBoxStyle}/>}
                          label="Bye"
                          checked={extra.run_type === "BYE"}
                          labelPlacement="end"
                        />
                      <FormControlLabel
                          onChange={(e) => e.target.checked ? setExtra({...extra,["run_type"]:"LB"}) : setExtra({...extra,["run_type"]:""})}
                          control={<Checkbox size='small' sx={checkBoxStyle}/>}
                          label="Leg Bye"
                          checked={extra.run_type === "LB"}
                          labelPlacement="end"
                        />
                    </Grid>
                    </> :""}

                    <Grid item xs={12}>
                      <hr />
                      </Grid> 
                        {/* select new batsman  */}
                    <Grid item xs={12}>
                      {batting?.players && batting.players.length > 0 &&  (batting.players.length !== curInning()?.batsmen.length || checkPlayers()) &&
                        <FormControl fullWidth error={validate.new_batsman}>
                            <InputLabel id="demo-simple-select-label" >Select New Batsman</InputLabel>
                            {
                                batting !== null && runningMatchData?.batsman
                                && <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Select New Batsman"
                                    onChange={(e) => setNewbatsman(e.target.value)}
                                >
                                    {
                                        batting.players.map(item => <MenuItem key={item._id} value={item} disabled={alreadyPLayedPLayers(item.players_id)}>
                                          {item.players_name}</MenuItem>)
                                    }
                                </Select>
                            }
                              <FormHelperText>{validate.new_batsman && "New Batsman Required" || ""}</FormHelperText>
                        </FormControl>
                      } 
                    </Grid>
                </Grid>
            </DialogContent>
                <DialogActions className="m-0 p-0">
                    <div className="w-100 d-flex">
                        <Button
                        size="large"
                        className="w-100 rounded-0 text-dark bglightgrey fw-bold"
                        onClick={() => handleCancel()}
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
                        onClick={() => handleSave()}
                        sx={{
                            ":hover": {
                            bgcolor: "#222B42",
                            color: "white",
                            },
                        }}
                        >
                        Confirm
                        </Button>
                    </div>
                </DialogActions>
        </Dialog>
        </>
    );
}

export default Out