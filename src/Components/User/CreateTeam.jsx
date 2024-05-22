import {
    Autocomplete,
    CircularProgress,
    Grid,
    InputLabel,
    TextField,
  } from "@mui/material";
  import SimpleCard from "@/Components/StyledComponents/SimpleCard";
  import {Spinner} from "react-bootstrap";
  import React from "react";
  import { useState } from "react";
  import { BsCheckCircleFill } from "react-icons/bs";
  import { useFormik } from "formik";
  import * as Yup from "yup";
  import { Button } from "react-bootstrap";
  import { createTeam } from "@/customApi/user";
  import { getPlaceList } from "@/customApi";
  import { toast } from "react-toastify";
import teamJson from "@/Components/Tournament/Teams/team.json"  
import { addPlayer } from "@/customApi/tournament";

  const initialValues = {
    team_name: "",
    team_logo: "",
    city: "",
    captain_name: "",
    country_code:'91',
    players: [],
  };
// const initialValues = teamJson[3];

export default function AddTeam ({ setAdd, getDetail }){
    const [inputLoading, setInputLoading] = useState(false);
    const [newData, setNewData] = useState([]);
    const [cities, setCities] = useState([]);
    const [inputCity, setInputCity] = useState("");
    const [allPLayers, setAllPLayers] = useState([]);
    const [loader, setLoader] = useState(false)
     const [data,setData] = useState('')
  
    const handleRemoveDynamicField = (index) => {
      let arr = [...values.players]
      const data = arr.filter((j, i) => i !== index);
      setFieldValue('players', data)
      setNewData(data);
    };
  
    const validationSchema = Yup.object().shape({
      team_name: Yup.string().required("Team name is required"),
      team_logo: Yup.string().required("Team logo is required"),
      city: Yup.string().required("City is required"),
      captain_name: Yup.string().required("Captain name is required").test("global-ok","Captain not ddded", function (value){
            let isTrue = false
            for(let i=0;i<allPLayers.length;i++){
              if(value === allPLayers[i].name){
                isTrue = true
              }
            }
            return isTrue
      }),
      players: Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Player name required"),
            phone_number: Yup.string().min(10, 'Phone number must be 10 digit').max(10,'Phone number must be 10 digit')
            .matches('^[0-9]', 'Invalid phone number')
            .test('global-ok','Phone number cannot be same',function (value){
              let data = allPLayers.length > 0 && allPLayers.filter((item)=> item.phone_number === value)
              let isTrue = true
              if(data.length > 1){
                isTrue =  false
              }
              return isTrue
            })
          .required("Phone number is required"),
          })
        )
        .required("Required"),
    });

  
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        setLoader(true)
        let data = new FormData();
        data.append("team_name", values.team_name);
        data.append("team_logo", values.team_logo);
        data.append("city", values.city);
        data.append("captain_name", values.captain_name);
        data.append("country_code", '91');
            console.log(newData,'newData')
          await createTeam(data)
            .then((res) => {
              setLoader(false)
              if (typeof res.message === "object") {
                toast.error(res.message.message);
              } else if(res.status) {
                toast.success(res.message);
                updatePlayer(newData,res.data._id)
              }
            })
            .catch((err) => {
              setLoader(false)
              toast.error(err.message);
            });
      },
    });

    const updatePlayer = async (players,teamId) => {
      let data = players.filter((item)=> !item._id)
      if(data.length > 0){
        await addPlayer({team_id:teamId,players:data}).then((res)=> {
          if(res.status){
            getDetail();
            setLoader(false)
            setAdd(false);
          }
        }).catch((err)=> {
          toast.error(err.message)
        })
      }
    }
  
    const {
      values,
      errors,
      touched,
      setFieldValue,
      handleSubmit,
      getFieldProps,
    } = formik;
  
  
    const handleChange = (e, index) => {
      const { name, value } = e.target;
      if(value === '' || Number(value) && value.length < 11){
        setData(name,value)
      }
      let arr = [...values.players];
      arr[index][name] = value;
      setFieldValue("players", arr);
      setAllPLayers(arr)
      setNewData(arr);
    };
  
    const addPLayer = () => {
      let arr = [...values.players];
      arr.push({ name: "", phone_number: "" });
      setFieldValue("players", arr);
      setAllPLayers(arr)
    };

   
    return (
      <SimpleCard>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item lg={6} md={4} sm={12} xs={12}>
              {" "}
              {/* Team Logo */}
  
               <InputLabel
                  htmlFor="my-input"
                  className="vendor-input-label mb-1 ms-1"
                >
                 Team Logo
                </InputLabel>
              <TextField
                fullWidth
                name="team_logo"
                type="file"
                placeholder="Team Logo"
                variant="outlined"
                onChange={(e) => setFieldValue("team_logo", e.target.files[0])}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={touched.team_logo && errors.team_logo}
                error={Boolean(errors.team_logo && touched.team_logo)}
              />
            </Grid>
  
            <Grid item lg={6} md={4} sm={12} xs={12}>
              {" "}
              {/* Team Name */}
              <InputLabel
                  htmlFor="my-input"
                  className="vendor-input-label mb-1 ms-1"
                >
                Team Name
                </InputLabel>
              <TextField
                fullWidth
                name="team_name"
                type="text"
                placeholder="Team Name"
                variant="outlined"
                value={values.team_name}
                {...getFieldProps("team_name")}
                helperText={touched.team_name && errors.team_name}
                error={Boolean(errors.team_name && touched.team_name)}
              />
            </Grid>
  
            <Grid item lg={6} md={4} sm={12} xs={12}>
              {" "}
              {/* City */}
  
              <InputLabel
                  htmlFor="my-input"
                  className="vendor-input-label mb-1 ms-1"
                >
                City/Town
                </InputLabel>
  
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={cities}
                getOptionLabel={(cities) => cities?.description}
                onChange={(e, value) => {
                  setFieldValue("city", value?.description || "");
                  setInputCity(value?.description || "");
                  setCities([]);
                }}
                noOptionsText={
                  (cities?.length > 0 && "No Option") || "Type Your City Name "
                }
                fullWidth
                inputValue={inputCity}
                renderInput={(params) => {
                  return (
                    <>
                      <TextField
                        {...params}
                        onChange={async (event, newInputValue) => {
                          setInputLoading(true);
                          setInputCity(event.target.value);
                          let arr = await getPlaceList(event.target.value);
                          setCities(arr);
                          setInputLoading(false);
                        }}
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
                        placeholder="City"
                      />
                    </>
                  );
                }}
              />
            </Grid>
  
            <Grid item lg={6} md={4} sm={12} xs={12}>
              {" "}
              {/* Captain Name */}
              {/* <h6>Captain Name</h6> */}
  
              <InputLabel
                  htmlFor="my-input"
                  className="vendor-input-label mb-1 ms-1"
                >
               Captain Name
                </InputLabel>
  
              <TextField
                fullWidth
                name="captain_name"
                type="text"
                placeholder="Captain Name"
                variant="outlined"
                value={values.captain_name}
                {...getFieldProps("captain_name")}
                helperText={touched.captain_name && errors.captain_name}
                error={Boolean(errors.captain_name && touched.captain_name)}
              />
            </Grid>
  
            {/* <Grid item lg={12} md={4} sm={12} xs={12} className="pt-0" >
              <FormGroup className="d-inline-block">
                <FormControlLabel
                  control={
                    <Checkbox name="add_me" 
                    checked={checkAddMeInclude()} 
                    onClick={(e) => handleAddMe(e)} /> }
                  label={
                    <p
                      className="mb-0 text-secondary"
                      style={{  fontSize: "16px" }}
                    >
                      Add my self in team{" "}
                    </p>
                  }
                />
              </FormGroup>
            </Grid> */}
  
            {/* Daynamic Field */}
  
            {values.players?.map((item, index) => {
              return (
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }} key={index}>
                  <div
                    style={{ border: "1px solid #E8E9EA", padding: "3px 11px" }}
                  >
                    <div style={{ textAlign: "right" }}>
                      <BsCheckCircleFill style={{ color: "#208A44" }} />
                    </div>
                    <TextField
                      sx={{ mb: 2 }}
                      fullWidth
                      size="small"
                      type="text"
                      label="Player Name"
                      variant="outlined"
                      name="name"
                      onChange={(e) => handleChange(e, index)}
                      value={item?.name}
                      helperText={
                        touched?.players &&
                        touched?.players[index]?.name &&
                        errors?.players &&
                        errors?.players[index]?.name
                      }
                      error={Boolean(
                        errors?.players &&
                          errors?.players[index]?.name &&
                          touched?.players &&
                          touched?.players[index]?.name
                      )}
                    />
                    <TextField
                      fullWidth
                      type="text"
                      size="small"
                      label="Phone Number"
                      variant="outlined"
                      name="phone_number"
                      onChange={(e) => {if(String(e.target.value).length < 11){ handleChange(e, index)}}}
                      value={item?.phone_number}
                      helperText={
                        touched.players &&
                        touched.players[index]?.phone_number &&
                        errors.players &&
                        errors.players[index]?.phone_number
                      }
                      error={Boolean(
                        errors.players &&
                          errors.players[index]?.phone_number &&
                          touched.players &&
                          touched.players[index]?.phone_number
                      )}
                    />
  
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "14px",
                        color: "#A00D00",
                      }}
                    >
                      <p
                        className="mb-0 d-inline-block text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveDynamicField(index)}
                      >
                        Remove
                      </p>
                    </div>
                  </div>
                </Grid>
              );
            })}
            <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
              <div
                style={{
                  border: "1px dashed",
                  padding: "20px 0",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                onClick={() => addPLayer()}
              >
                Add Player
              </div>
            </Grid>
  
            <Grid item lg={12} md={6} sm={12} xs={12} className="text-center">
              <Button
                className="w-25"
                variant="contained"
                type="submit"
                sx={{ mt: 3 }}
                style={{ backgroundColor: "#222B42", color: "white" }}
              >
                 {loader && <Spinner size='sm' /> || "Save"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SimpleCard>
    );
  };
  
  