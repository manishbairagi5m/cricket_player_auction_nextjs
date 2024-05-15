import * as React from 'react';
import {
    Button, TextField, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
    Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, Grid,
    InputLabel, Select, MenuItem
} from '@mui/material';

function NewbatsMan(props) {
    const { onClose, open, batting, handleNextBatsman } = props;
    const [outType, setOutType] = React.useState()
    const [newBatsman, setNewbatsman] = React.useState(null)
    
    const handleClose = () => {
        onClose(false);
    };
    
    const handleSave = () => {
        handleNextBatsman(newBatsman)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth='sm'>
            <DialogTitle>New Batsman</DialogTitle>
            <DialogContent>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                    {batting?.players.length > 0 && 
                        <FormControl fullWidth>
                            <InputLabel>New Batsman</InputLabel>
                            {
                                batting !== null
                                && <Select
                                    value={batting.players}
                                    onChange={(e) => setNewbatsman(e.target.value)}
                                >
                                    {
                                        batting.players.map(item => <MenuItem key={item._id} value={{ players_id: item.players_id, players_name: item.players_name }}>{item.players_name}</MenuItem>)
                                    }
                                </Select>
                            }
                        </FormControl>
                    }
                    </Grid>

                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => handleSave()}>Save</Button>
            </DialogActions>
        </Dialog>

    );
}

export default NewbatsMan