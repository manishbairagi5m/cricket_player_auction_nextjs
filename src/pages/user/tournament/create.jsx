"use client"
import React, { useState, useRef } from "react";
import {
  styled,Checkbox ,
  Grid,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import ImageInput from "@/Components/StyledComponents/ImageInput";
import { createTournament } from "@/customApi/tournament"
import { getPlaceList } from "@/customApi"
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { helper } from "@/Helper"
import CKEditor from "@/Components/StyledComponents/CKEditor"

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const initialValues = {
  tournament_logo: "",
  tournament_banner: "",
  tournament_name: "",
  city: "",
  state: "",
  country: "",
  from_date: "",
  to_date: "",
  no_of_teams: "",
  ball_type: "TENNIS",
  max_players: "",
  min_players: "",
  match_time: "",
  tournament_category: "",
  match_type: "",
  match_overs: "",
  first_prize: "",
  runner_up_prize: "",
  MOM: "",
  MVP: "",
  best_batsman: "",
  best_bowler: "",
  description: "",
  entry_fees: "",
};

export default function AddTournament () {
  const [inputLoading, setInputLoading] = useState(false);
  const [ckData, setCkData] = useState("");
  const [cities, setCities] = useState([]);
  const [inputCity, setInputCity] = useState("");
  const [loader, setLoader] = useState(false);
  const [number, setNumber] = useState(false);
  const [desimal, setDesimal] = useState(false);
  const sponsorRef = useRef(null);

  const router = useRouter();
  const MAX_FILE_SIZE = 1024000; //1000KB

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
 

  const validationSchema = Yup.object().shape({
    tournament_name: Yup.string()
      .max(50, "Name to long")
      .required("Tournamet name is required"),
    city: Yup.string().required("City is required"),
    from_date: Yup.string().required("From date is required"),
    to_date: Yup.string().required("To date is required"),
    ball_type: Yup.string().required("Ball type is required"),
    no_of_teams: Yup.number()
      .positive("Must be positive number")
      .integer("Must be integer")
      .min(4, "Minimum 4 Team required")
      .max(200, "Too much number")
      .required("Teams is required"),
    max_players: Yup.number()
      .positive("Must be positive number")
      .integer("Must be integer")
      .min(1, "Minimum 1 players"),
    // .max(20,"Limit exceeded").required("Max. players is required"),
    min_players: Yup.number()
      .positive("Must be positive number")
      .integer("Must be integer")
      .min(1, "Minimum 1 players"),
    // .max(11,"Maximum 11 players").required("Min. players is required"),
    match_time: Yup.string().required("Match time is required"),
    tournament_category: Yup.string().required(
      "Tournament category is required"
    ),
    match_type: Yup.string().required("Match type is required"),
    match_overs: Yup.number()
      .positive("Must be positive number")
      .min(1, "Minimum 1 over")
      .max(50, "Maximum 50 over")
      .required("Overs is required"),
    description: Yup.string()
      .min(150, "Minimum 150 letter description")
      .required("Description is required"),
    entry_fees: Yup.number()
      .positive("Must be positive number")
      .max(500000, "To large number")
      .required("Entry fees is required"),
    first_prize: Yup.number()
      .positive("Must be positive number")
      .max(500000, "Too large number")
      .required("First prize is required"),
    runner_up_prize: Yup.number()
      .positive("Must be positive number")
      .max(500000, "To large number")
      .required("Runner up is required"),
    MOM: Yup.number()
      .positive("Must be positive number")
      .max(500000, "To large number")
      .required("Man of the match is required"),
    MVP: Yup.number()
      .positive("Must be positive number")
      .max(500000, "To large number")
      .required("Most valuable player is required"),
    best_batsman: Yup.number()
      .positive("Must be positive number")
      .max(500000, "To large number")
      .required("Best batsman is required"),
    best_bowler: Yup.number()
      .positive("Must be positive number")
      .max(500000, "To targe number")
      .required("Best bowler is required"),
    tournament_logo: Yup.mixed()
      .required("Tournament logo is required")
      .test(
        "is-valid-size",
        "Max allowed size is 1MB",
        (value) => value && value.size <= MAX_FILE_SIZE
      ),
    tournament_banner: Yup.mixed()
      .required("Tournament banner is required")
      .test(
        "is-valid-size",
        "Max allowed size is 1MB",
        (value) => value && value.size <= MAX_FILE_SIZE
      ),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoader(true);
      let formdata = new FormData();
      formdata.append("tournament_logo", values.tournament_logo);
      formdata.append("tournament_banner", values.tournament_banner);
      formdata.append("tournament_name", values.tournament_name);
      formdata.append("city", values.city);
      formdata.append("state", values.state);
      formdata.append("country", values.country);
      formdata.append("description", values.description);
      formdata.append("from_date", values.from_date);
      formdata.append("to_date", values.to_date);
      formdata.append("no_of_teams", Number(values.no_of_teams));
      formdata.append("ball_type", values.ball_type);
      formdata.append("max_players", Number(values.max_players));
      formdata.append("min_players", Number(values.min_players));
      formdata.append("match_time", values.match_time);
      formdata.append("tournament_category", values.tournament_category);
      formdata.append("match_type", values.match_type);
      formdata.append("match_overs", Number(values.match_overs));
      formdata.append("first_prize", Number(values.first_prize));
      formdata.append("runner_up_prize", Number(values.runner_up_prize));
      formdata.append("MOM", Number(values.MOM));
      formdata.append("MVP", Number(values.MVP));
      formdata.append("best_batsman", Number(values.best_batsman));
      formdata.append("best_bowler", Number(values.best_bowler));
      formdata.append("entry_fees", Number(values.entry_fees));

      await createTournament(formdata).then((res) => {
        setLoader(false);
        if (res?.status) {
          // navigate(`/tournament/sponsors/${res.data._id}`)
          // sponsorRef.current.addSponsorsApi(res.data._id)
          toast.success(res?.message);
          router.push("/user/tournament");
        } else {
          setLoader(false);
          toast.error(res?.message);
        }
      });
    },
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleSubmit,
    setTouched,
    getFieldProps,
  } = formik;

  const handleChange = (e) => {
    setNumber(false);
    if (e.target.value[0] === "0") {
      setNumber(true);
    } else {
      setFieldValue(e.target.name, e.target.value);
    }
  };


  console.log(values,'values')

  return (
    <Container>
        <h2 className="h2-chart mt-2">Add Tournament</h2>
        <form onSubmit={handleSubmit} className="ms-3 me-3">
          <Grid container spacing={3}>
              {/* tournament logo */}
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <ImageInput
                width="100%"
                height="200px"
                name="tournament_logo"
                label="Tournament logo"
                onChange={(e) => {
                  setFieldValue("tournament_logo", e.target.files[0]);
                }}
                onRemove={() => setFieldValue("tournament_logo", "")}
                error={Boolean(
                  errors.tournament_logo && touched.tournament_logo
                )}
                helperText={touched.tournament_logo && errors.tournament_logo}
              />
            </Grid>

              {/* tournament banner */}
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              <ImageInput
                width="100%"
                height="200px"
                name="tournament_banner"
                label="Tournament banner"
                onChange={(e) => {
                  setFieldValue("tournament_banner", e.target.files[0]);
                }}
                onRemove={() => setFieldValue("tournament_banner", "")}
                error={Boolean(
                  errors.tournament_banner && touched.tournament_banner
                )}
                helperText={
                  touched.tournament_banner && errors.tournament_banner
                }
              />
            </Grid>

              {/* tournament name */}
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                name="tournament_name"
                type="text"
                label="Tournament name"
                variant="outlined"
                value={values.tournament_name}
                {...getFieldProps("tournament_name")}
                helperText={touched.tournament_name && errors.tournament_name}
                error={Boolean(
                  errors.tournament_name && touched.tournament_name
                )}
              />
            </Grid>

              {/* city */}
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={cities}
                getOptionLabel={(cities) => cities?.description}
                onChange={(e, value) => {
                  let placeDetail = helper.getPlaceDetail(value);
                  console.log(placeDetail,'placeDetail')
                  setFieldValue("city", placeDetail?.city || "");
                  setFieldValue("state", placeDetail?.state || "");
                  setFieldValue("country", placeDetail?.country || "");
                  setInputCity(value?.description || "");
                  setCities([]);
                }}
                noOptionsText={
                  (cities?.length > 0 && "No option") || "Type your city name "
                }
                fullWidth
                inputValue={inputCity}
                onInputChange={async (event, newInputValue) => {
                  setInputLoading(true);
                  setInputCity(event?.target?.value);
                  let arr = await getPlaceList(
                    event?.target?.value
                  );
                  setCities(arr || []);
                  setInputLoading(false);
                }}
                renderInput={(params) => {
                  return (
                    <>
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {inputLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        helperText={touched.city && errors.city}
                        error={Boolean(errors.city && touched.city)}
                        label="City"
                      />
                    </>
                  );
                }}
              />
            </Grid>

              {/* from date */}
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <InputLabel
                htmlFor="my-input"
                className="vendor-input-label mb-3"
              >
                Tournament Date
              </InputLabel>
              {/* <h6 className="text-secondary mb-3">Tournament Date</h6> */}
              <TextField
                fullWidth
                type="date"
                label="From"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: JSON.stringify(new Date()).split("T")[0].slice(1),
                  max: values?.to_date,
                }}
                variant="outlined"
                {...getFieldProps("from_date")}
                helperText={touched.from_date && errors.from_date}
                error={Boolean(errors.from_date && touched.from_date)}
              />
            </Grid>

              {/* to date */}
            <Grid item lg={3} md={6} sm={12} xs={12} sx={{ mt: 4.3 }}>
              <TextField
                fullWidth
                type="date"
                label="To"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min:
                    values?.from_date ||
                    JSON.stringify(new Date()).split("T")[0].slice(1),
                }}
                variant="outlined"
                {...getFieldProps("to_date")}
                helperText={touched.to_date && errors.to_date}
                error={Boolean(errors.to_date && touched.to_date)}
              />
            </Grid>

              {/* ball type */}
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 1 }}>
              <InputLabel
                htmlFor="my-input"
                className="vendor-input-label mb-1"
              >
                Ball Type
              </InputLabel>
              {/* <h6 className="text-secondary mb-2"></h6> */}
              <FormControl
                error={Boolean(errors.ball_type && touched.ball_type)}
              >
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  {...getFieldProps("ball_type")}
                >
                  <FormControlLabel
                    value="LEATHER"
                    control={<Radio />}
                    label={
                      <span>
                        Leather{" "}
                        <Image
                          src="/Assets/Images/leather.png"
                          width={20}
                          height={20}
                          className="me-2"
                          alt="ball"
                        />
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="TENNIS"
                    control={<Radio />}
                    label={
                      <span>
                        Tennis{" "}
                        <Image
                          src="/Assets/Images/tennis.png"
                          width={20}
                          height={20}
                          className="me-2"
                          alt="ball"
                        />
                      </span>
                    }
                  />
                </RadioGroup>
                <FormHelperText>
                  {touched.ball_type && errors.ball_type}
                </FormHelperText>
              </FormControl>
            </Grid>

              {/* no of team */}
            <Grid item lg={2} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              <TextField
                fullWidth
                type="number"
                name="no_of_teams"
                label="No. of teams"
                variant="outlined"
                onChange={handleChange}
                value={values.no_of_teams}
                // onChange={(e) => {
                //   // if (e.target.value < 65 && e.target.value >= 0) {
                //   setFieldValue(e.target.name, e.target.value);
                //   // }
                // }}
                helperText={touched.no_of_teams && errors.no_of_teams}
                error={Boolean(errors.no_of_teams && touched.no_of_teams)}
              />
            </Grid>

              {/* no of max players */}
            <Grid item lg={2} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              <TextField
                fullWidth
                type="number"
                name="max_players"
                label="Max. players"
                variant="outlined"
                onChange={handleChange}
                value={values.max_players}
                // onChange={(e) => {
                //   // if (e.target.value < 18 && e.target.value >= 0) {
                //   setFieldValue(e.target.name, e.target.value);
                //   // }
                // }}
                helperText={touched.max_players && errors.max_players}
                error={Boolean(errors.max_players && touched.max_players)}
              />
            </Grid>

              {/* no of min players */}
            <Grid item lg={2} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              <TextField
                fullWidth
                type="number"
                name="min_players"
                label="Min. players"
                variant="outlined"
                onChange={handleChange}
                value={values.min_players}
                // onChange={(e) => {
                //   setFieldValue(e.target.name, e.target.value);
                // }}
                helperText={touched.min_players && errors.min_players}
                error={Boolean(errors.min_players && touched.min_players)}
              />
            </Grid>

              {/* match time */}
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              <FormControl
                fullWidth
                error={Boolean(errors.match_time && touched.match_time)}
              >
                <InputLabel id="demo-simple-select-label">
                  Match Time
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  {...getFieldProps("match_time")}
                  label="Match time"
                >
                  <MenuItem value="DAY">Day</MenuItem>
                  <MenuItem value="NIGHT">Night</MenuItem>
                  <MenuItem value="DAY_NIGHT">Day & Night</MenuItem>
                </Select>
                <FormHelperText>
                  {touched.match_time && errors.match_time}
                </FormHelperText>
              </FormControl>
            </Grid>

              {/* tournament category */}
            <Grid item lg={3} md={6} sm={12} xs={12}>
              <FormControl
                fullWidth
                error={Boolean(
                  errors.tournament_category && touched.tournament_category
                )}
              >
                <InputLabel id="demo-simple-select-label">
                  Tournament Category
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.tournament_category}
                  {...getFieldProps("tournament_category")}
                  label="Tournament category"
                >
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="CORPORATE">Corporate</MenuItem>
                  <MenuItem value="COMMUNITY">Community</MenuItem>
                  <MenuItem value="SCHOOL">School</MenuItem>
                  <MenuItem value="SERIES">Series</MenuItem>
                  <MenuItem value="COLLAGE">Collage</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
                <FormHelperText>
                  {touched.tournament_category && errors.tournament_category}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item lg={3} md={6} sm={12} xs={12}>
              {" "}
              {/* description */}
              <TextField
                fullWidth
                type="number"
                label="Entry fees"
                variant="outlined"
                // onChange={(e) => {
                //   setNumber(false);
                //   if (e.target.value[0] === "0" ) {
                //     setNumber(true);
                //   } else {
                //     setFieldValue(e.target.name, e.target.value);
                //   }
                // }}
                onChange={handleChange}
                value={values.entry_fees}
                name="entry_fees"
                // {...getFieldProps("entry_fees")}
                helperText={touched.entry_fees && errors.entry_fees}
                error={Boolean(errors.entry_fees && touched.entry_fees)}
              />
            </Grid>

            <Grid
              item
              lg={(values.match_type === "LIMITED_OVER" && 3) || 6}
              md={6}
              sm={12}
              xs={12}
            >
              {" "}
              {/* match type */}
              <FormControl
                fullWidth
                error={Boolean(errors.match_type && touched.match_type)}
              >
                <InputLabel id="demo-simple-select-label">
                  Match Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="match_type"
                  value={values.match_type}
                  onChange={(e) => {
                    if (e.target.value === "ONE_DAY") {
                      setFieldValue("match_overs", "50");
                    } else if (e.target.value === "T_20") {
                      setFieldValue("match_overs", "20");
                    } else if (e.target.value === "LIMITED_OVER") {
                      setFieldValue("match_overs", "");
                    }
                    setFieldValue(e.target.name, e.target.value);
                  }}
                  label="Match type"
                >
                  <MenuItem value="LIMITED_OVER">Limited Over</MenuItem>
                  <MenuItem value="ONE_DAY">One Day</MenuItem>
                  <MenuItem value="T_20">T-20</MenuItem>
                </Select>
                <FormHelperText>
                  {touched.match_type && errors.match_type}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              lg={3}
              md={6}
              sm={12}
              xs={12}
              className={`${
                (values.match_type === "LIMITED_OVER" && " ") || "d-none"
              }`}
            >
              {" "}
              {/* match overs */}
              <TextField
                fullWidth
                type="number"
                name="match_overs"
                label="Match overs"
                variant="outlined"
                value={values.match_overs}
                onChange={(e) => {
                  // if (e.target.value < 19 && e.target.value >= 0) {
                  setFieldValue(e.target.name, e.target.value);
                  // }
                }}
                helperText={touched.match_overs && errors.match_overs}
                error={Boolean(errors.match_overs && touched.match_overs)}
              />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              {" "}
              {/* 1st prize */}
              <TextField
                fullWidth
                type="number"
                name="first_prize"
                label="1st prize"
                variant="outlined"
                value={values.first_prize}
                onChange={handleChange}
                // {...getFieldProps("first_prize")}
                helperText={touched.first_prize && errors.first_prize}
                error={Boolean(errors.first_prize && touched.first_prize)}
              />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              {" "}
              {/* Runner prize */}
              <TextField
                fullWidth
                type="number"
                name="runner_up_prize"
                label="Runner up"
                variant="outlined"
                onChange={handleChange}
                value={values.runner_up_prize}
                // {...getFieldProps("runner_up_prize")}
                helperText={touched.runner_up_prize && errors.runner_up_prize}
                error={Boolean(
                  errors.runner_up_prize && touched.runner_up_prize
                )}
              />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              {" "}
              {/* MOM prize */}
              <TextField
                fullWidth
                type="number"
                name="MOM"
                label="Man of the match"
                variant="outlined"
                onChange={handleChange}
                value={values.MOM}
                // {...getFieldProps("MOM")}
                helperText={touched.MOM && errors.MOM}
                error={Boolean(errors.MOM && touched.MOM)}
              />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              {" "}
              {/* MVP prize */}
              <TextField
                fullWidth
                type="number"
                name="MVP"
                label="Most valuable player"
                variant="outlined"
                onChange={handleChange}
                value={values.MVP}
                // {...getFieldProps("MVP")}
                helperText={touched.MVP && errors.MVP}
                error={Boolean(errors.MVP && touched.MVP)}
              />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              {" "}
              {/* Best Batsman */}
              <TextField
                fullWidth
                type="number"
                name="best_batsman"
                label="Best batsman"
                variant="outlined"
                onChange={handleChange}
                value={values.best_batsman}
                // {...getFieldProps("best_batsman")}
                helperText={touched.best_batsman && errors.best_batsman}
                error={Boolean(errors.best_batsman && touched.best_batsman)}
              />
            </Grid>

            <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
              {" "}
              {/* Best Bowler */}
              <TextField
                fullWidth
                type="number"
                name="best_bowler"
                label="Best bowler"
                variant="outlined"
                onChange={handleChange}
                value={values.best_bowler}
                // {...getFieldProps("best_bowler")}
                helperText={touched.best_bowler && errors.best_bowler}
                error={Boolean(errors.best_bowler && touched.best_bowler)}
              />
            </Grid>

            <Grid item lg={12} md={6} sm={12} xs={12}>
              <div className={`${errors.description && touched.description && "border border-danger"}`}>
            <CKEditor            
                name="description"
                data="<p>Decription</p>"
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFieldValue("description",data);
                }}
            />
              </div>
            <span className="text-danger fs-14 ms-3">{touched.description && errors.description}</span>
            
                <div className="d-flex align-items-center">
                  <Checkbox id="auction_perm" />
                  <label htmlFor="auction_perm">Are you want to add auction for this tournament</label>
                </div>
            </Grid>

            {/* <AddSponsors ref={sponsorRef}/> */}

            <Grid item lg={12} md={6} sm={12} xs={12} className="text-center">


              {/* submit button */}
              <Button
                color="primary"
                variant="contained"
                type="submit"
                className="w-25 p-2"
                sx={{ mt: 3 }}
                style={{ backgroundColor: "#222B42" }}
              >
                <span>
                  {(loader && <Spinner size="sm" />) || "Submit"}{" "}
                </span>
              </Button>
            </Grid>
          </Grid>
        </form>
    </Container>
  );
};

AddTournament.auth = { userType: "USER" };