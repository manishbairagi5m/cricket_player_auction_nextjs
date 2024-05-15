import * as React from 'react';
import {
    Button, Dialog, DialogActions,
    DialogContent, DialogTitle,
     FormControl, Grid,
    InputLabel, Select, MenuItem,FormHelperText
} from '@mui/material';
import { scoreFunctions } from '@/Components/Tournament/StartMatch/scoring/scoreFunctions';

function NewBowler(props) {
    const { onClose, open, bowling, handleNextBowler,runningMatchData,currentBowler } = props;
    const [newBowler, setNewBowler] = React.useState(null)
    const [validate, setValidate] = React.useState(false)
    
    const handleClose = () => {
        onClose(false);
    };
    
    const handleSave = () => {
        if(newBowler){
            handleNextBowler({players_id:newBowler.players_id,players_name:newBowler.players_name})
            setValidate(false)
            handleClose()
        }else{
            setValidate(true)
            return false
        }
    }

    const checkBowlers = (bowlerid) => {
        let isTrue = false
        let bowlerBowled = runningMatchData.bowler.filter((item) =>  item.players_id === bowlerid)
        if(bowlerBowled.length > 0){
            if(scoreFunctions.getApproxOvers(bowlerBowled[0]?.overs_bowled) >= runningMatchData.match_settings.over_per_bowler){
                isTrue = true
            }
        }
        if(currentBowler?.players_id === bowlerid){
            isTrue = true
        }
        return isTrue
    }
    return (
        <Dialog open={open} maxWidth='xs' fullWidth>
            <DialogTitle className="border border-bottom text-center fw-bold">Next Bowler</DialogTitle>
            <DialogContent className='p-5'>
                <Grid container spacing={2} >
                    <Grid item xs={12}>
                        {bowling?.players.length > 0 &&
                        <FormControl fullWidth error={validate}>
                            <InputLabel id="demo-simple-select-label" >Next Bowler</InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                label="Next Bowler"
                                    onChange={(e) => setNewBowler(e.target.value)}
                                >
                                    {
                                        bowling.players.map((item) => {return <MenuItem key={item._id} disabled={checkBowlers(item.players_id)} value={item}>
                                            {item.players_name}</MenuItem>})
                                    }
                                </Select>
                               <FormHelperText>{validate && "Helper Required" || ""}</FormHelperText>
                        </FormControl>
                        }
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions className='m-0 p-0'>
                {/* <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleSave()}>Save</Button> */}
                <div className="w-100 d-flex">
                        <Button
                        size="large"
                        className="w-100 rounded-0 text-dark bglightgrey fw-bold"
                        onClick={() => handleClose()}
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

    );
}

export default NewBowler