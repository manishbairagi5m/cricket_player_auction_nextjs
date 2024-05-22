import * as React from 'react';
import SimpleCard from '@/Components/StyledComponents/SimpleCard';
import { Container, Grid, InputAdornment, TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';

export interface IPlayersProps {
}

export default function Players (props: IPlayersProps) {

let arr = [
  { 
    name : "Virat Kohli",
    team : "RCB",
    batStyle : "Right Handed Bat",
    bowlStyle : "Right-arm medium",
    age : "37 Years",
    basePrize : "10000/-",
    prizePaid : "1000000/-",
    status: "SOLD"
  },
  { 
    name : "Virat Kohli",
    team : "RCB",
    batStyle : "Right Handed Bat",
    bowlStyle : "Right-arm medium",
    age : "37 Years",
    basePrize : "10000/-",
    status: "UNSOLD"
  },
  { 
    name : "Virat Kohli",
    team : "RCB",
    batStyle : "Right Handed Bat",
    bowlStyle : "Right-arm medium",
    age : "37 Years",
    basePrize : "10000/-",
    prizePaid : "1000000/-",
    status: "SOLD"
  },
  { 
    name : "Virat Kohli",
    team : "RCB",
    batStyle : "Right Handed Bat",
    bowlStyle : "Right-arm medium",
    age : "37 Years",
    basePrize : "10000/-",
    status: "PENDING"
  },
  { 
    name : "Virat Kohli",
    team : "RCB",
    batStyle : "Right Handed Bat",
    bowlStyle : "Right-arm medium",
    age : "37 Years",
    basePrize : "10000/-",
    status: "PENDING"
  },
]


  return (
    <Container>
    {/* <SimpleCard> */}
      <Grid container spacing={2} sx={{ mb: 2,mt: 0 }}>
        <Grid item lg={9} md={3} sm={12} xs={12}>
          <h5>Players</h5>
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
                placeholder={`Search Player`}
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
          <Grid item lg={4} md={6} sm={12} xs={12} key={i}>
                  <div className='auction-player-card-ls'>
                  <Image
                    src="/Assets/Images/player1.png"
                    width={200}
                    height={200}
                    alt='player'
                  />
                  <div className='auction-player-card-ls-right'>
                    <div className='auction-player-card-ls-status' content={item.status}>{item.status}</div>
                  <h6>{item?.name} ({item?.team})</h6>
                  <table>
                    <tbody>
                      <tr>
                        <td>Bat Style</td>
                        <td>{item?.batStyle}</td>
                      </tr>
                      <tr>
                        <td>Bowl Style</td>
                        <td>{item?.bowlStyle}</td>
                      </tr>
                      <tr>
                        <td>Age</td>
                        <td>{item?.age}</td>
                      </tr>
                      <tr>
                        <td>Base Price</td>
                        <td>{item?.basePrize}</td>
                      </tr>
                      {item?.prizePaid && 
                      <tr>
                        <td>Price Paid</td>
                        <td>{item?.prizePaid}</td>
                      </tr>
                      }
                    </tbody>
                  </table>
                  </div>
                  </div>
          </Grid>
        ))}
      </Grid>
    

    {/* </SimpleCard> */}
  </Container>
  );
}
