import React, { useState, useEffect } from "react";
import {
  Grid,
  styled,
  TextField,
  Button,
  Container,
} from "@mui/material";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch,useSelector } from "react-redux";
import {  match_settings } from '@/lib/slice/matchSlice';
import { useRouter } from "next/router";
import Image from "next/image";

const initialValues = {
  over_per_bowler: "",
  power_play: "",
  match_overs:""
};

const MatchDetail = ({ setMatchValue,matchData, state,setStartMatchData, startMatchData }) => {
  const router = useRouter()
  const statedata = useSelector(state => state.match)
  const dispatch = useDispatch()
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  // let teamALogo = team.filter((item1) => item1.team_id === matchData.teamA_id)
  // let teamBLogo = team.filter((item1) => item1.team_id === matchData.teamB_id)

  const validationSchema = Yup.object().shape({
    match_overs: Yup.number().positive().max(100,"Too Long").required("Number of over required"),
    over_per_bowler: Yup.number().positive("Must be Positive").max(Yup.ref('match_overs'), "Should be less than half of Match Overs").required("Over per bowler is required"),
    power_play: Yup.number().positive("Must be Positive").max(Yup.ref('match_overs'), "Should be less than half of Match Overs").required("Powerplay is required"),
  });


  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      dispatch(match_settings({ ...state.match_settings, 
        over_per_bowler:values.over_per_bowler,
        power_play:values.power_play,
        no_of_overs:Number(values?.match_overs),
        match_type:state?.match_type,
        date:matchData?.date,
        city:state?.city,
        ball_type:state?.ball_type,
        }))
      setMatchValue("playing_xi")
      setStartMatchData({...startMatchData, match_settings : {...values}})
    },
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    getFieldProps,
  } = formik;



  useEffect(() => {
    setFieldValue('match_overs',statedata.match_settings.no_of_overs>0 ? statedata.match_settings.no_of_overs :  state?.match_overs || "")
    setFieldValue('power_play', statedata?.match_settings.power_play || "")
    setFieldValue('over_per_bowler', statedata?.match_settings.over_per_bowler || "")
  }, [])

  const imageLoader = (img, defaultimg) => {
    return img ? `${IMAGEURL}${img}` : `${defaultimg}`;
  };

  return (
    <Container>
    <SimpleCard>
      <div
        className="d-flex justify-content-around align-items-center text-center mb-3"
        style={{ width: "28%" }}
      >
        <div>
        <Image
            src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
            loader={()=> imageLoader(statedata.team1.team_logo,"https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png")}
            width={100}
            height={100}
            alt="img"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

          <br />
          <p>{matchData.teamA_name}</p>
        </div>
        <div>
          <Image 
            src={"/Assets/Images/vs.png"}
            width={100}
            height={100}
            alt="img"
          />

        </div>
        <div>
        <Image
            src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
            loader={()=> imageLoader(statedata.team2.team_logo,"https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png")}
            width={100}
            height={100}
            alt="img"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          <br />
          <p>{matchData.teamB_name}</p>
        </div>
      </div>

      <div className="ps-5 pe-5">
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} columnSpacing={4}>
          <Grid item lg={6} md={6} sm={12} xs={12} >
            <h6>No. Of Overs</h6>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              name="match_overs"
              value={state?.match_overs}
              {...getFieldProps("match_overs")}
              helperText={touched.match_overs && errors.match_overs}
              error={Boolean(errors.match_overs && touched.match_overs)}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} >
            <h6>Over Per Bowler</h6>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              name="over_per_bowler"
              placeholder="Over Per Bowler"
              value={values.over_per_bowler}
              {...getFieldProps("over_per_bowler")}
              helperText={touched.over_per_bowler && errors.over_per_bowler}
              error={Boolean(errors.over_per_bowler && touched.over_per_bowler)}
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <h6>Ground</h6>
            <TextField
              fullWidth
              type="text"
              variant="outlined"
              name="ground"
              placeholder="Enter Ground Address"
              value={matchData.ground}
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <h6>Power Play</h6>
            <TextField
              fullWidth
              name="power_play"
              type="text"
              variant="outlined"
              placeholder="Power Play"
              value={values.power_play}
              {...getFieldProps("power_play")}
              helperText={touched.power_play && errors.power_play}
              error={Boolean(errors.power_play && touched.power_play)}
            />
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            {/* tournament logo */}
            <h6>Date /Time</h6>
            <TextField
              fullWidth
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={matchData.date}
            />
          </Grid>

          <Grid
            item
            lg={12}
            md={6}
            sm={12}
            xs={12}
            sx={{ mt: 2 }}
            className="d-flex justify-content-center gap-3"
          >
            <Button
              variant="contained"
              className="text-white w-25 fw-bold"
              style={{backgroundColor:'#222b42'}}
              onClick={() => setMatchValue("today_match")}
            >
             Previous
            </Button>

            <Button
              variant="contained"
              type='submit'
              className="text-white w-25 fw-bold"
              style={{backgroundColor:'#222b42'}}
            >
              Next
            </Button>
          
          </Grid>
        </Grid>
        </form>
      </div>
    </SimpleCard>
    </Container>
  );
};

export default MatchDetail;
