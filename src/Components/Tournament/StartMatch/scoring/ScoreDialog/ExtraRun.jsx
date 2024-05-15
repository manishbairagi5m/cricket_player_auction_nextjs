import React,{useState,useEffect} from 'react';
import {Button,TextField,
    Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,FormControlLabel,Checkbox} from '@mui/material'
import Image from 'next/image';


function ExtraRun(props) {
    const { onClose, extraRunType, open, handleAddRun } = props;
    const [extraType, setExtraType] = useState(extraRunType)
    const [state, setState] = useState(null)
    const [error, setError] = useState(false)
    let checkBoxStyle= { '& .MuiSvgIcon-root': { fontSize: 18 } ,  color: "#2B344A",
                        '&.Mui-checked': {
                              color: "#2B344A",
                            }, }

    const obj = {
         WD : "Wide Ball" ,
         NB : "No Ball"  ,
         BYE : "Bye Runs"  ,
         LB : "Leg Bye Runs" ,
         OVERTHROW : "Overthrow Runs" ,
        //  PENALTY : "Penalty Runs" ,
         "BYE&NB" : "Bye And No Ball Runs" ,
         "LB&NB" : "Leg Bye And No Ball Runs" ,
    }
    const imgobj = {
         WD : wide ,
         NB : no_ball,
         BYE : bye  ,
         LB : leg_bye ,
         "BYE&NB" : no_ball ,
         "LB&NB" : no_ball ,
    }

    const handleClose = () => {
        onClose(false);
        setState(null)
        setExtraType(extraRunType)
        setError(false)
    };

    const handleSubmit = () => {
        if(!state && extraType === "OVERTHROW"){
            setError(true)
        }else{
            if(extraType === "NB"){
                handleAddRun(Number(state), {run: 0, run_type: extraType})
            }else if(extraType === "OVERTHROW"){
                handleAddRun(Number(state))
            }else{
                handleAddRun(0, {run: Number(state), run_type: extraType})
            }
            setError(false)
            setState(null)
            setExtraType(extraRunType)
            onClose(false);
        }
    };

    const handleChange = (e) => {
        if(["","0","1","2","3","4","5","6"].includes(e.target.value)){
            setState(e.target.value)
        }
    }

    useEffect(() => {
      setExtraType(extraRunType)
    }, [extraRunType])


    
    return (
            <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
                <DialogTitle className="border border-bottom text-center fw-bold">
                    {extraType !== 'OVERTHROW' && obj[extraType] || 'Runs'}</DialogTitle>
                <DialogContent>
                     <div className='p-4 ps-3 d-flex justify-content-center align-items-center'>
                     {extraType !== 'OVERTHROW' && <Image src={`/Assets/Images/out_modals/${imgobj[extraType]}.png`} alt='img' width={50} height={50} className='me-4'/>}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Run"
                        value={state}
                        type="text"
                        variant="outlined"
                        onChange={(e) => handleChange(e)}
                        error={error}
                        helperText={error && "Please Add Penalty Runs"}
                    />
                     </div>
                     {extraRunType === "NB" &&
                     <div className='d-flex align-items-center justify-content-center p-4 pt-1'>
                      <FormControlLabel
                          onChange={(e) => e.target.checked ? setExtraType("BYE&NB") : setExtraType("NB")}
                          control={<Checkbox size='small' sx={checkBoxStyle}/>}
                          label="Bye"
                          checked={extraType === "BYE&NB"}
                          labelPlacement="end"
                        />
                      <FormControlLabel
                        onChange={(e) => e.target.checked ? setExtraType("LB&NB") : setExtraType("NB")}
                          control={<Checkbox size='small' sx={checkBoxStyle}/>}
                          label="Leg Bye"
                          checked={extraType === "LB&NB"}
                          labelPlacement="end"
                        />
                     </div>
                     }
                </DialogContent>
                <DialogActions className="m-0 p-0">
                    <div className="w-100 d-flex">
                        <Button
                        size="large"
                        onClick={() => handleClose()}
                        className="w-100 rounded-0 text-dark bglightgrey fw-bold"
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
                        onClick={() => handleSubmit()}
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


        
    );
}

export default ExtraRun