import React, { useState, useEffect, useRef } from "react";
import {
  styled,
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
  Checkbox,
  OutlinedInput,
  ListItemText,
} from "@mui/material";
import * as Yup from "yup";
import SimpleCard from "@/Components/StyledComponents/SimpleCard"
import { toast } from "react-toastify";
import { useFormik } from "formik";
import ImageInput from "@/Components/StyledComponents/ImageInput";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { validationHelper } from "@/Helper/validationHelper"
import Image from "next/image";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const auctionTypeEnum = [
  { label: "Online", value: "online" },
  { label: "Offline", value: "offline" },
];
const biddingTimeEnum = [
  { label: "Second", value: "second" },
  { label: "Minute", value: "minute" },
];

const inputData = [
  { lg:6, md:6,  type: "image", name: "auction_logo", label: "Auction logo" },
  { lg:6, md:6,  type: "image", name: "auction_banner", label: "Auction banner" },
  { lg:6, md:6,  type: "date", name: "auction_start_date", label: "Auction start date" },
  { lg:6, md:6,  type: "date", name: "auction_end_date", label: "Auction end date" },
  { lg:6, md:6,  type: "date", name: "auction_date", label: "Bidding date" },
  { lg:3, md:3,  type: "number", name: "bid_increse_price", label: "Bid increase prize" },
  { lg:3, md:3,  type: "number", name: "player_age", label: "Player age" },
  { lg:6, md:6,  type: "number", name: "min_player", label: "Min player" },
  { lg:6, md:6,  type: "number", name: "max_player", label: "Max player" },
  { lg:4, md:4,  type: "number", name: "biding_time_interval", label: "Biding time interval" },
  { lg:2, md:2,  type: "select", name: "biding_time", label: "Enter time", list: biddingTimeEnum },
  { lg:6, md:6,  type: "select", name: "auction_type", label: "Auction type", list: auctionTypeEnum },
  { lg:4, md:4,  type: "text", name: "auction_address", label: "Auction address" },
  { lg:12, md:12,  type: "text", name: "about_auction", label: "About auction" ,multiline:true},
  { lg:12, md:12,  type: "text", name: "description", label: "Description" ,multiline:true},
];

const initialValues = inputData.reduce((acc,cur)=> {acc[cur.name] = ""; return acc},{})

export default function AddTournament() {
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    auction_logo: validationHelper.commonImage,
    auction_banner: validationHelper.commonImage,
    auction_date: validationHelper.commonText,
    auction_start_date: validationHelper.commonText,
    auction_end_date: validationHelper.commonText,
    max_player: validationHelper.commonNumber,
    min_player: validationHelper.commonNumber,
    bid_increse_price: validationHelper.commonNumber,
    biding_time_interval: validationHelper.commonNumber,
    biding_time: validationHelper.commonText,
    player_age: validationHelper.commonNumber,
    about_auction: validationHelper.commonText,
    description: validationHelper.commonText,
    auction_type: validationHelper.commonText,
    auction_address: Yup.string().when('auction_type', {
      is: (val)=> val==='offline',
      then: (s)=> s.required('Required'),
      otherwise: (s)=> s,
  })
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoader(true);
      let formdata = new FormData();
      formdata.append("tournament_logo", values.tournament_logo);
      //   await addTournament(formdata).then((res) => {
      //     setLoader(false);
      //     if (res?.status === true) {
      //       // navigate(`/tournament/sponsors/${res.data._id}`)
      //       // sponsorRef.current.addSponsorsApi(res.data._id)
      //       toast.success(res?.message);
      //       router("/tournament");
      //     } else {
      //       setLoader(false);
      //       toast.error(res?.message);
      //     }
      //   });
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

  console.log(values,'values')
  
  const handleChange = (e) => {
    setFieldValue(e.target.name, e.target.value);
  };
  
  const handleOfflineAuction = (item) => {
    let obj = { isTrue: true, lg:item.lg }
    if(item.name==="auction_address" && !values.auction_type || item.name==="auction_address" && values.auction_type==="online"){
      obj = { isTrue: false, lg:6 }
    }else if(item.name==="auction_address" && values.auction_type==="offline"){
      obj = { isTrue: true, lg:4 }
    }
    return obj
  }
  const handleOfflineAuctionSelect = (item) => {
    let obj = { lg:item.lg }
    if(item.name==="auction_type" && values.auction_type==="offline"){
      obj = { lg:2 }
    }
    return obj
  }

  return (
    <Container>
      <SimpleCard>
      <h3 className="mt-2 ms-3">Add Auction</h3>
      <form onSubmit={handleSubmit} className="ms-3 me-3">
        <Grid container spacing={3} sx={{ pt: 4 }}>
            {inputData.map((item, i) => {
              if (item.type === "image") {
                return (
                  // image input
                  <Grid item lg={item.lg} md={item.md} sm={12} xs={12} key={i}>
                  <ImageInput
                    width="100%"
                    height="200px"
                    name={item.name}
                    label={item.label}
                    onChange={(e) => {
                      setFieldValue(item.name, e.target.files[0]);
                    }}
                    onRemove={() => setFieldValue(item.name, "")}
                    error={Boolean(
                      errors[item.name] && touched[item.name]
                    )}
                    helperText={
                      touched[item.name] && errors[item.name]
                    }
                  />
                  </Grid>
                );
              } else if (item.type === "select") {
                return (
                  // select input
                  <Grid item lg={handleOfflineAuctionSelect(item).lg} md={item.md} sm={12} xs={12} key={i}>
                  <FormControl fullWidth  error={Boolean(errors[item.name] && touched[item.name])}>
                    <InputLabel id="demo-simple-select-label">
                      {item.label}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name={item.name}
                      value={values[item.name]}
                      label={item.label}
                      onChange={(e)=> handleChange(e,i)}
                    >
                      {item?.list &&
                        Array.isArray(item.list) &&
                        item.list.length > 0 &&
                        item.list.map((itm, index) => (
                          <MenuItem value={itm.value} key={index}>
                            {itm.label}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{touched[item.name] && errors[item.name]}</FormHelperText>
                  </FormControl>
                  </Grid>
                )
              } else if(item.type==="date") {
                return (
                  // date input
                <Grid item lg={item.lg} md={item.md} sm={12} xs={12} key={i}>
                  {/* <InputLabel htmlFor="my-input"
                    className="vendor-input-label mb-3"
                  >{item.label}
                </InputLabel> */}
                <TextField
                  id="my-input"
                  key={i}
                  fullWidth
                  type="date"
                  name={item.name}
                  label={item.label}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: JSON.stringify(new Date()).split("T")[0].slice(1),
                    max: values?.to_date,
                  }}
                  variant="outlined"
                  // onChange={(e)=> handleChange(e,i)}
                  // value={values[item.name]}
                  {...getFieldProps(item.name)}
                  helperText={touched[item.name] && errors[item.name]}
                  error={Boolean(errors[item.name] && touched[item.name])}
                />
                </Grid>
                )
              }else {
                return (
                  // text number input
                  handleOfflineAuction(item)?.isTrue && 
                <Grid item lg={handleOfflineAuction(item).lg} md={item.md} sm={12} xs={12} key={i}>
                    <TextField
                      key={i}
                      fullWidth
                      type={item.type}
                      name={item.name}
                      label={item.label}
                      multiline={item?.multiline && true || false}
                      rows={item?.multiline && 4 || 1}
                      variant="outlined"
                      // onChange={(e)=> handleChange(e,i)}
                      // value={values[item.name]}
                      {...getFieldProps(item.name)}
                      helperText={touched[item.name] && errors[item.name]}
                      error={Boolean(errors[item.name] && touched[item.name])}
                      />
                      </Grid>
                    
                )
              }
            })}

          <Grid item lg={12} md={6} sm={12} xs={12} className="text-center">
            {" "}
            {/* submit button */}
            <Button
              color="primary"
              variant="contained"
              type="submit"
              className="w-25 p-2"
              sx={{ mt: 3 }}
              style={{ backgroundColor: "#222B42" }}
            >
              <span>{(loader && <Spinner />) || "Submit"} </span>
            </Button>
          </Grid>
        </Grid>
      </form>
      </SimpleCard>
    </Container>
  );
}

AddTournament.auth = { userType: "USER" };
