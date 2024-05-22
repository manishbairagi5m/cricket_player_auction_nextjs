import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import { scoreFunctions } from '@/Components/Tournament/StartMatch/scoring/scoreFunctions';
import Image from 'next/image';

function ChangeInning(props) {
    const { onClose, open ,changeMatchInnings, setMatchValue,runningMatchData,checkIsInningCompleted } = props;
    const matchState = useSelector(state => state.match)
    const handleClose = () => {
        onClose(false);
    };

    const handleChangeInning = () => {
		changeMatchInnings()
        setMatchValue("match_opening")
	}
    
   
    let inning1 = runningMatchData.innings[0].first_bat && runningMatchData.innings[0] || runningMatchData.innings[1]
    let inning2 = runningMatchData.innings[0].first_bat && runningMatchData.innings[1] || runningMatchData.innings[0]

    return (
        <Dialog open={open} maxWidth='xs' fullWidth>
                <DialogTitle className="border border-bottom text-center fw-bold">Change Inning</DialogTitle>
                <DialogContent>
                     <div className='p-4 d-flex justify-content-center align-items-center'>
                     {checkIsInningCompleted(runningMatchData) ?
                     <div className='w-100 d-flex flex-column align-items-center '>                   
                     <div className='p-2'>
                        <Image 
                            src="/Assets/Images/out_modals/change_inning.svg"
                            alt='img' 
                            width={60}
                            height={60}
                        />
                     </div>
                     <div className='p-2 text-success'>
                        {`${inning2?.batting_team} need ${inning1?.runs_scored+1} in ${matchState?.match_settings?.no_of_overs} over`}
                     </div>
                     <div>
                        {`Required Run Rate: ${inning1?.runs_scored && Math.floor(((Number(inning1.runs_scored)+1)/scoreFunctions.getBallFromOver(runningMatchData.match_settings.no_of_overs))*6)}`}
                     </div>
                     </div>
                       : 
                       <div className='w-100 d-flex flex-column align-items-center '>
                        <div className='p-2'>
                            Are You Sure You Want to Change Inning ?
                        </div>     
                       <div className='p-2'>
                       <Image 
                            src="/Assets/Images/out_modals/change_inning.svg"
                            alt='img' 
                            width={60}
                            height={60}
                        />
                       </div>
                       <div className='p-2 text-success'>
                          {`${inning2?.batting_team} need ${inning1?.runs_scored+1} in ${matchState?.match_settings?.no_of_overs} over`}
                       </div>
                       <div>
                          {`Required Run Rate: ${inning1?.runs_scored && Math.floor(((Number(inning1.runs_scored)+1)/scoreFunctions.getBallFromOver(runningMatchData.match_settings.no_of_overs))*6)}`}
                       </div>
                       </div>
                     }</div>
                </DialogContent>
                <DialogActions className="m-0 p-0">
                    <div className="w-100 d-flex">
                        <Button
                        onClick={() => handleClose()}
                        size="large"    
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
                        sx={{
                            ":hover": {
                            bgcolor: "#222B42",
                            color: "white",
                            },
                        }}
                        onClick={() => handleChangeInning()}
                        >
                        Confirm
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>


        
    );
}

export default ChangeInning