'use client'
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import { Container, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

export interface IMyMatchesProps {}

export default function MyMatches(props: IMyMatchesProps) {
  const router = useRouter()

  let arr = [
    { 
      name : "Chennai Super Kings",
      captain : "MS Dhoni",
      totalPlayer : "14",
      matchWon : "4",
    },
    { 
      name : "Chennai Super Kings",
      captain : "MS Dhoni",
      totalPlayer : "14",
      matchWon : "4",
    },    
  ]

  return (
      <Container className="pt-4">
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item lg={10} md={3} sm={12} xs={12}>
            <h4>My Matches</h4>
          </Grid>
          <Grid item lg={2} md={3} sm={12} xs={12}>
          <button
              className="main-button-blue w-100"
              onClick={() => router.push("/user/my-team/create")}
            >
              Start/Schedule
            </button>
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
                <p>Captain</p>
                <div>{item?.captain}</div>
                <div className='auction-team-bottom'>
                  <div>
                    <p>Total Players</p>
                    <div>{item?.totalPlayer}</div>
                  </div>
                  <div>
                    <p>Match Won</p>
                    <div>{item?.matchWon}</div>
                  </div>
                </div>
              </div>
          </Grid>
        ))}
      </Grid>
      </Container>
  );
}

MyMatches.auth = { userType: "USER" };
