import React,{useState, useEffect } from "react";
import { styled, Grid, Button, TextField,Autocomplete, CircularProgress,
  Radio,
  RadioGroup,
  InputLabel,
  MenuItem,
  Select,
  FormControlLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import { helper } from '@/Helper';
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { updateTournament,getSingleTournamentAbout } from '@/customApi/tournament';
import { Spinner } from "react-bootstrap";
import ImageInput from "@/Components/StyledComponents/ImageInput";
import { getPlaceList } from "@/customApi"
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
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
  organizer_name: "",
  organizer_number: "",
  from_date:"",
  to_date:"",
  no_of_teams: "",
  ball_type:"TENNIS",
  max_players:"",
  min_players:"",
  match_time:"",
  tournament_category:"",
  match_type:"",
  match_overs:"",
  first_prize:"",
  runner_up_prize:"",
  MOM:"",
  MVP:"",
  best_batsman:"",
  best_bowler:"",
  description:"",
  entry_fees:""
};

export default function EditTournament () {
  const [inputLoading, setInputLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [inputCity, setInputCity] = useState('');
  const router = useRouter()
  const [loader, setLoader] = useState(false)
  const [number, setNumber] = useState(false);
  const MAX_FILE_SIZE = 1024000; //1000KB
  
  const validationSchema = Yup.object().shape({
    tournament_name: Yup.string().max(50,"Name To long").required("Tournamet name is required"),
    city: Yup.string().required("City is required"),
    organizer_name: Yup.string().max(50,"Name To long").required("Organiser name is required"),
    organizer_number: Yup.string().min(10,"Number must be 10 digit").max(10,"Number must be 10 digit").required("Organiser number is required"),
    from_date: Yup.string().required("From date is required"),
    to_date: Yup.string().required("To date is required"),
    ball_type: Yup.string().required("Ball type is required"),
    no_of_teams: Yup.number().integer("Must be integer")
    .min(4,"Min. 4 team required").max(200,"To much number").required("Teams is required"),
    max_players: Yup.number().positive("Must be positive number").integer("Must Be Integer").min(1,"Minimum 1 Players"),
    // .max(20,"Limit Exceeded").required("Max. players is required"),
    min_players: Yup.number().positive("Must be positive number").integer("Must Be Integer").min(1,"Minimum 1 players"),
    // .max(11,"Maximum 11 players").required("Min. players is required"),
    match_time: Yup.string().required("Match time is required"),
    tournament_category: Yup.string().required(
      "Tournament category is required"
    ),
    match_type: Yup.string().required("Match type is required"),
    match_overs: Yup.number().positive("Must be positive number").min(1,"Minimum 1 over required").max(50,"Maximum 50 Over required").required("Overs is required"),
    description: Yup.string().min(150,"Minimum 150 letter description").required("Description is required"),
    entry_fees: Yup.number().positive("Must be positive number").max(500000,"To large number").required("Entry fees is required"),
    first_prize: Yup.number().positive("Must be positive number").max(500000,"To large number").required("First prize is required"),
    runner_up_prize: Yup.number().positive("Must be positive number").max(500000,"To large number").required("Runner up is required"),
    MOM: Yup.number().positive("Must be positive number").max(500000,"To large number").required("Man of the match is required"),
    MVP: Yup.number().positive("Must be positive number").max(500000,"To large number").required("Most valuable player is required"),
    best_batsman: Yup.number().positive("Must be positive number").max(500000,"To large number").required("Best batsman is required"),
    best_bowler: Yup.number().positive("Must be positive number").max(500000,"To large number").required("Best bowler is required"),
    tournament_logo: Yup.lazy(value => {
      switch (typeof value) {
        case 'object':
          return Yup.mixed().test("is-valid-size", "Max allowed size is 1MB",
          value => value && value.size <= MAX_FILE_SIZE).required("Image required");
        default:
          return Yup.string().required("Image required");
      }
    }),
    tournament_banner: Yup.lazy(value => {
      switch (typeof value) {
        case 'object':
          return Yup.mixed().test("is-valid-size", "Max allowed size is 1MB",
          value => value && value.size <= MAX_FILE_SIZE).required("Image required");
        default:
          return Yup.string().required("Image required");
      }
    }),

  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let formdata = new FormData()
      formdata.append('tournament_logo',  values.tournament_logo)
      formdata.append('tournament_banner',  values.tournament_banner)
      formdata.append('tournament_name',  values.tournament_name)
      formdata.append("city", values.city);
      formdata.append("state", values.state);
      formdata.append("country", values.country);
      formdata.append('organizer_name',   values.organizer_name)
      formdata.append('organizer_number', values.organizer_number)
      formdata.append('from_date',        values.from_date)
      formdata.append('to_date',          values.to_date)
      formdata.append('no_of_teams',       Number(values.no_of_teams))
      formdata.append('ball_type',        values.ball_type)
      formdata.append('max_players',      Number(values.max_players))
      formdata.append('min_players',      Number(values.min_players))
      formdata.append('match_time',       values.match_time)
      formdata.append('tournament_category', values.tournament_category)
      formdata.append('match_type',           values.match_type)
      formdata.append('match_overs', Number(values.match_overs))
      formdata.append('first_prize',          Number(values.first_prize))
      formdata.append('runner_up_prize',            Number(values.runner_up_prize))
      formdata.append('MOM',     Number(values.MOM))
      formdata.append('MVP', Number(values.MVP))
      formdata.append('best_batsman',         Number(values.best_batsman))
      formdata.append('best_bowler',          Number(values.best_bowler))
      formdata.append('entry_fees',          Number(values.entry_fees))
      formdata.append('description',          values.description)

      await updateTournament(formdata,router.query.id).then((res) => {
        setLoader(true)
        if (res?.status){
          setLoader(false)
          toast.success(res?.message);
          router.push('/user/tournament')
        } else {
          setLoader(false)
          toast.error(res?.message);
        }
      });
    },
  });


  const { values, errors, touched,setFieldValue, handleSubmit, getFieldProps } = formik;

  const getData = async () => {
    setLoader(true)
    await getSingleTournamentAbout(router.query.id).then((res) => {
      if(res?.status){
        // setImages({tournament_logo: res.data?.tournament_logo, tournament_banner:res.data?.tournament_banner})
        setFieldValue(  'tournament_logo' , res.data?.tournament_logo || "")
        setFieldValue(  'tournament_banner' , res.data?.tournament_banner || "")
        setFieldValue(  'tournament_name' , res.data?.tournament_name || "")
        setFieldValue(  'city' , res.data?.city || "")
        setFieldValue(  'state' , res.data?.state || "")
        setFieldValue(  'country' , res.data?.country || "")
        setFieldValue(  'organizer_name' , res.data?.organizer_name || "")
        setFieldValue(  'organizer_number' , res.data?.organizer_number || "")
        setFieldValue(  'from_date' , res.data?.from_date || "")
        setFieldValue(  'to_date' , res.data?.to_date || "")
        setFieldValue(  'no_of_teams' , res.data?.no_of_teams || "")
        setFieldValue(  'ball_type' , res.data?.ball_type  || "TENNIS")
        setFieldValue(  'max_players' , res.data?.max_players || "")
        setFieldValue(  'min_players' , res.data?.min_players || "")
        setFieldValue(  'match_time' , res.data?.match_time || "")
        setFieldValue(  'tournament_category' , res.data?.tournament_category  || "")
        setFieldValue(  'match_type' , res.data?.match_type  || "")
        setFieldValue(  'match_overs' , res.data?.match_overs || (res.data?.match_type && getOverFromMatchType(res.data.match_type)))
        setFieldValue(  'first_prize' , res.data?.first_prize || "")
        setFieldValue(  'runner_up_prize' , res.data?.runner_up_prize || "")
        setFieldValue(  'MOM' , res.data?.MOM || "")
        setFieldValue(  'MVP' , res.data?.MVP || "")
        setFieldValue(  'best_batsman' , res.data?.best_batsman || "")
        setFieldValue(  'best_bowler' , res.data?.best_bowler || "")
        setFieldValue(  'description' , res.data?.description || "")
        setFieldValue(  'entry_fees' , res.data?.entry_fees || "")

        setInputCity(res.data?.city || "")
        setCitiesall(res.data?.city || "")
        setLoader(false)
      }else{
        setLoader(false)
      }
    })
  }


  const getOverFromMatchType = (val) => {
    if(val === 'ONE_DAY'){
      return '50'
    }else if(val === 'T_20'){
      return '20'
    }else{
      return ''
    }
  }

  const setCitiesall = async (acity) => {
    let arr = await getPlaceList(
      acity
    );
    setCities(arr);
  }

  const handleChange =(e) => {
    setNumber(false);
    if (e.target.value[0] === "0" ) {
      setNumber(true);
    } else {
      setFieldValue(e.target.name, e.target.value);
    }
  }

  useEffect(() => {
    getData()
  },[])
  

  return (
      <Container>
        <SimpleCard>

          <h2 className="h2-chart">Edit Tournament</h2>

          {loader && 
          <div className="w-100 d-flex justify-content-center">
            <Spinner animation="border" />
          </div> ||
            <form onSubmit={handleSubmit} className='ms-3 me-3'>
              <Grid container spacing={3}>
                 <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>   {/* tournament logo */}
                
                    <ImageInput
                    width="100%"
                    height="200px"
                    name ="tournament_logo"
                    label="Tournament logo"
                    value={values?.tournament_logo}
                    onChange={(e) => {setFieldValue("tournament_logo", e.target.files[0])}}
                    onRemove={() => setFieldValue("tournament_logo", "")}
                    error={Boolean(errors.tournament_logo && touched.tournament_logo)}
                    helperText={touched.tournament_logo && errors.tournament_logo}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}> {/* tournament banner */}
                
                     <ImageInput
                    width="100%"
                    height="200px"
                    name ="tournament_banner"
                    label="Tournament banner"
                    value={values?.tournament_banner}
                    onChange={(e) => {setFieldValue("tournament_banner", e.target.files[0])}}
                    onRemove={() => setFieldValue("tournament_banner", "")}
                    error={Boolean(errors.tournament_banner && touched.tournament_banner)}
                    helperText={touched.tournament_banner && errors.tournament_banner}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} > {/* tournament name */}
                  <TextField
                    fullWidth
                    name="tournament_name"
                    type="text"
                    label="Tournament name"
                    variant="outlined"
                    value={values.tournament_name}
                    {...getFieldProps("tournament_name")}
                    helperText={
                      touched.tournament_name && errors.tournament_name
                    }
                    error={Boolean(
                      errors.tournament_name && touched.tournament_name
                    )}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* city */}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={cities}
                  getOptionLabel={(cities) => cities?.description}
                  onChange={(e, value) => {
                    let placeDetail = helper.getPlaceDetail(value)
                    setFieldValue("city", placeDetail?.city || "");
                    setFieldValue("state", placeDetail?.state || "");
                    setFieldValue("country", placeDetail?.country || "");
                    setInputCity(value?.description || '')
                    setCities([])
                  }}
                  noOptionsText={cities?.length > 0 && 'No option' || 'Type your city name '}
                  fullWidth
                  inputValue={inputCity}
                  renderInput={(params) => {
                    return (
                      <>
                        <TextField
                          {...params}
                          onChange={async (event, newInputValue) => {
                            setInputLoading(true)
                            setInputCity(event.target.value);
                            let arr = await getPlaceList(
                              event.target.value
                            );
                            setCities(arr);
                            setInputLoading(false)
                          }}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {inputLoading ? <CircularProgress color="inherit" size={20} /> : null}
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

                <Grid item lg={6} md={6} sm={12} xs={12} >  {/* organizer name */}
                  <TextField
                    fullWidth
                    name="organizer_name"
                    type="text"
                    label="Organiser name"
                    variant="outlined"
                    value={values.organizer_name}
                    {...getFieldProps("organizer_name")}
                    helperText={touched.organizer_name && errors.organizer_name}
                    error={Boolean(
                      errors.organizer_name && touched.organizer_name
                    )}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* organizer number */}
                  <TextField
                    fullWidth
                    name="organizer_number"
                    type="text"
                    label="Contact number"
                    variant="outlined"
                    value={values.organizer_number}
                    {...getFieldProps("organizer_number")}
                    helperText={touched.organizer_number && errors.organizer_number}
                    error={Boolean(errors.organizer_number && touched.organizer_number)}
                  />
                </Grid>
               
                <Grid item lg={3} md={6} sm={12} xs={12} >  {/* from date */}
                  <h6 className="text-secondary mb-3">Tournament Date</h6>
                  <TextField
                    fullWidth
                    type="date"
                    label='From'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: values?.to_date
                    }}
                    variant="outlined"
                    value={values.from_date}
                    name="from_date"
                    {...getFieldProps("from_date")}
                    helperText={touched.from_date && errors.from_date}
                    error={Boolean(
                      errors.from_date && touched.from_date
                    )}
                  />
                </Grid>

                <Grid item lg={3} md={6} sm={12} xs={12} sx={{mt:4.3}}>  {/* to date */}
                  <TextField
                    fullWidth
                    type="date"
                    label='To'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: values?.from_date || (JSON.stringify(new Date()).split('T')[0].slice(1))
                    }}
                    variant="outlined"
                    value={values.to_date}
                    name="to_date"
                    {...getFieldProps("to_date")}
                    helperText={touched.to_date && errors.to_date}
                    error={Boolean(
                      errors.to_date && touched.to_date
                    )}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{mt:1}}>  {/* ball type */}
                  <h6 className="text-secondary mb-2">Ball Type</h6>
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

               <Grid item lg={2} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* no of team */}
                  <TextField
                    fullWidth
                    type="number"
                    name="no_of_teams"
                    label="No. of teams"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.no_of_teams}
                    // onChange={(e) => {if(e.target.value < 65 && e.target.value >=  0){ setFieldValue(e.target.name, e.target.value)}}}
                    helperText={touched.no_of_teams && errors.no_of_teams}
                    error={Boolean(errors.no_of_teams && touched.no_of_teams)}
                  />
                </Grid>

               <Grid item lg={2} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* no of max players */}
                  <TextField
                    fullWidth
                    type="number"
                    name="max_players"
                    label="Max. Players"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.max_players}
                    // onChange={(e) => {if(e.target.value < 18 && e.target.value >=  0){ setFieldValue(e.target.name, e.target.value)}}}
                    helperText={touched.max_players && errors.max_players}
                    error={Boolean(errors.max_players && touched.max_players)}  
                  />
                </Grid>

               <Grid item lg={2} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* no of min players */}
                  <TextField
                    fullWidth
                    type="number"
                    name="min_players"
                    label="Min. Players"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.min_players}
                    // onChange={(e) => setFieldValue(e.target.name, e.target.value)}
                    helperText={touched.min_players && errors.min_players}
                    error={Boolean(errors.min_players && touched.min_players)}
                  />
                </Grid>

                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* match time */}
                <FormControl fullWidth error={Boolean(errors.match_time && touched.match_time)}>
                  <InputLabel id="demo-simple-select-label">Match Time</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values.match_time}
                    {...getFieldProps("match_time")}
                    label="Match time"
                  >
                    <MenuItem value="DAY">Day</MenuItem>
                    <MenuItem value="NIGHT">Night</MenuItem>
                    <MenuItem value="DAY_NIGHT">Day & Night</MenuItem>
                  </Select>
                <FormHelperText>{touched.shift_type && errors.shift_type}</FormHelperText>
                  </FormControl>
                </Grid>
                    
                <Grid item lg={3} md={6} sm={12} xs={12}>  {/* tournament category */}
                <FormControl fullWidth error={Boolean(errors.tournament_category && touched.tournament_category)}>
                  <InputLabel id="demo-simple-select-label">Tournament Category</InputLabel>
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
                <FormHelperText>{touched.tournament_category && errors.tournament_category}</FormHelperText>
                  </FormControl>
                  </Grid>

                  <Grid item lg={3} md={6} sm={12} xs={12} >   {/* description */}
                  <TextField
                    fullWidth
                    type="number"
                    label='Entry fees'
                    variant="outlined"
                    value={values.entry_fees}
                    name="entry_fees"
                    onChange={handleChange}
                    // {...getFieldProps("entry_fees")}
                    helperText={touched.entry_fees && errors.entry_fees}
                    error={Boolean(
                      errors.entry_fees && touched.entry_fees
                    )}
                  />
                </Grid>

                <Grid item lg={values.match_type === 'LIMITED_OVER' && 3 || 6} md={6} sm={12} xs={12}>    {/* match type */}
                <FormControl fullWidth error={Boolean(errors.match_type && touched.match_type)}>
                  <InputLabel id="demo-simple-select-label">Match Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name='match_type'
                    value={values.match_type}

                onChange={(e) => { setFieldValue('match_overs',getOverFromMatchType(e.target.value))
                setFieldValue(e.target.name,e.target.value)
            }}
                    label="Match type"
                  >
                    <MenuItem value="LIMITED_OVER">Limited Over</MenuItem>
                    <MenuItem value="ONE_DAY">One Day</MenuItem>
                    <MenuItem value="T_20">T-20</MenuItem>
                  </Select>
                <FormHelperText>{touched.match_type && errors.match_type}</FormHelperText>
                  </FormControl>
                </Grid>
                
                <Grid item lg={3} md={6} sm={12} xs={12} className={`${values.match_type === "LIMITED_OVER" && " " || "d-none"}`}>   {/* match overs */}
                <TextField
                    fullWidth
                    type="number"
                    name="match_overs"
                    label="Match overs"
                    variant="outlined"
                    value={values?.match_overs}
                    onChange={(e) => {if(e.target.value < 19 && e.target.value >=  0){ setFieldValue(e.target.name, e.target.value)}}}
                    helperText={touched.match_overs && errors.match_overs}
                    error={Boolean(errors.match_overs && touched.match_overs)}
                  />
                </Grid>

                <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* 1st prize */}
                  <TextField
                    fullWidth
                    type="number"
                    name="first_prize"
                    label="1st prize"
                    variant="outlined"
                    onChange={handleChange}
                    value={values.first_prize}
                    // {...getFieldProps("first_prize")}
                    helperText={touched.first_prize && errors.first_prize}
                    error={Boolean(errors.first_prize && touched.first_prize)}
                  />
                </Grid>      

                <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* Runner prize */}
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
                    error={Boolean(errors.runner_up_prize && touched.runner_up_prize)}
                  />
                </Grid>                

                <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* MOM prize */}
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

                <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* MVP prize */}
                  <TextField
                    fullWidth
                    type="number"
                    name="MVP"
                    label="Most valuable player"
                    variant="outlined"
                    value={values.MVP}
                    onChange={handleChange}
                    // {...getFieldProps("MVP")}
                    helperText={touched.MVP && errors.MVP}
                    error={Boolean(errors.MVP && touched.MVP)}
                  />
                </Grid>                

                <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* Best Batsman */}
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

                <Grid item lg={4} md={6} sm={12} xs={12} sx={{ mt: 0 }}>  {/* Best Bowler */}
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

                  <Grid item lg={12} md={6} sm={12} xs={12} >   {/* description */}

                  <div className={`${errors.description && touched.description && "border border-danger"}`}>
            <CKEditor            
                name="description"
                data={values.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFieldValue("description",data);
                }}
            />
              </div>
                  {touched.description && errors.description ? (
                    <div className="error-message">{errors.description}</div>
                  ) : null}




                  {/* <TextField
                    fullWidth
                    type="text"
                    multiline
                    rows={3}
                    label='Description'
                    variant="outlined"
                    value={values.description}
                    name="description"
                    {...getFieldProps("description")}
                    helperText={touched.description && errors.description}
                    error={Boolean(
                      errors.description && touched.description
                    )}
                  /> */}
                </Grid>

               {/* <AddSponsors ref={sponsorRef}/> */}

                <Grid item lg={12} md={6} sm={12} xs={12} className="text-center">  {/* submit button */}
                <Button color="primary" variant="contained" type="submit"
                  className="w-25 p-2"
                  sx={{ mt: 3 }}
                  style={{backgroundColor:'#222B42'}}>
                <span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</span>
              </Button>
              </Grid>

              </Grid>

            </form>}
        </SimpleCard>
      </Container>
  );
};


EditTournament.auth = { userType: "USER" };

