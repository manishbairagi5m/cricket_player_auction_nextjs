'use client'
import { Box, Container, Grid } from "@mui/material";
import * as React from "react";

export interface IAppProps {}

export default function Dashboard(props: IAppProps) {

  return (
      <Container>
        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          <Grid item lg={3} md={3} sm={12} xs={12}>
          <div style={{height:"200px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
          <div style={{height:"200px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
          <div style={{height:"200px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}>
          <div style={{height:"200px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
          </Grid>
          <Grid item lg={6} md={3} sm={12} xs={12}>
          <div style={{height:"400px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
          </Grid>
          <Grid item lg={6} md={3} sm={12} xs={12}>
          <div style={{height:"400px", boxShadow:"rgba(0, 0, 0, 0.24) 0px 3px 8px"}}></div>
          </Grid>
        </Grid>
      </Container>
  );
}

Dashboard.auth = { userType: "USER" };
