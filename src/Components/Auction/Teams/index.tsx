import * as React from 'react';
import SimpleCard from '@/Components/StyledComponents/SimpleCard';
import { Container, Grid, InputAdornment, TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';

export interface ITeamListProps {
}

export default function TeamList (props: ITeamListProps) {

let arr = [
  { 
    name : "Chennai Super Kings",
    fundRemaining : "₹9,90,00,000",
    retainPlayers : "12",
    totalPlayers : "26",
  },
  { 
    name : "Chennai Super Kings",
    fundRemaining : "₹9,90,00,000",
    retainPlayers : "12",
    totalPlayers : "26",
  },
  { 
    name : "Chennai Super Kings",
    fundRemaining : "₹9,90,00,000",
    retainPlayers : "12",
    totalPlayers : "26",
  },
  { 
    name : "Chennai Super Kings",
    fundRemaining : "₹9,90,00,000",
    retainPlayers : "12",
    totalPlayers : "26",
  },
  { 
    name : "Chennai Super Kings",
    fundRemaining : "₹9,90,00,000",
    retainPlayers : "12",
    totalPlayers : "26",
  },
  { 
    name : "Chennai Super Kings",
    fundRemaining : "₹9,90,00,000",
    retainPlayers : "12",
    totalPlayers : "26",
  },
  
]


  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 2,mt: 0 }}>
        <Grid item lg={9} md={3} sm={12} xs={12}>
          <h5>Teams</h5>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12} className='d-flex justify-content-end'>
          <TextField
                fullWidth
                id="outlined-basic"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch />
                    </InputAdornment>
                  ),
                }}
                placeholder={`Search Team`}
                variant="outlined"
                size="small"
                // onChange={(e) => {
                //   getData(e.target.value, page, date, ground, sorting);
                // }}
              />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2,mt: 0 }}>
        {arr.map((item,i)=> (
          <Grid item lg={3} md={3} sm={12} xs={12} key={i}>
              <div className='auction-team'>
                <Image
                  src="/Assets/Images/teams.png"
                  width={130}
                  height={130}
                  alt='team'
                />
                <h6>{item.name}</h6>
                <p>Funds Remaining</p>
                <div>{item?.fundRemaining}</div>
                <div className='auction-team-bottom'>
                  <div>
                    <p>Retain Players</p>
                    <div>12</div>
                  </div>
                  <div>
                    <p>Total Players</p>
                    <div>26</div>
                  </div>
                </div>
              </div>
          </Grid>
        ))}
      </Grid>
    
  </Container>
  );
}
