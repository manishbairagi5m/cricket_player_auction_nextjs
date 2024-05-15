import React, { useState, useEffect } from "react";
import {
  DialogContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  styled,
} from "@mui/material";
import {  FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import TournamentCard from "@/Components/Tournament/TournamentCard";
import { getTournamentList } from "@/customApi/tournament"


const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));


export default function TounamentList() {
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState("");
  const [date, setDate] = useState("");
  const [toolTip, setToolTip] = useState<any>("");

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [ground, setGround] = useState("");
  const [sortIcon, setSortIcon] = useState<any>({
    city: { a: false, b: "ascending", c: "descending" },
  });

  const router = useRouter();

  const handleFilter = (params:any) => {
    getData(
      search,
      date,
      ground,
      sortIcon[params].a === true ? sortIcon[params].b : sortIcon[params].c
    );
    setSortIcon({
      ...sortIcon,
      [params]: { ...sortIcon[params], a: !sortIcon[params].a },
    });
  };

  const getData = async (search?:any, date_filter?:any, ground?:any, sort?:any) => {
    // setLoader(true);
    let params : any = {  };
    setGround(ground || "");
    if (search) {
      params = { ...params, search: search };
      setSearch(search);
    }
    if (sort) {
      params = { ...params, sorting: sort };
      setSorting(sort);
    }

    if (date_filter) {
      params = { ...params, from_date: date_filter };
      setDate(date_filter);
    }

    // if (ground !== "all") {
    //   params = { ...params, ground_type: ground };
    //   setGround(ground);
    // }

    // if (ground) {
    //   params = { ...params, ground_type: ground };
    //   setGround(ground);
    // }
    if (ground === "GROUND" || ground === "TURF") {
      params = { ...params, ground_type: ground };
      setGround(ground);
    }

    await getTournamentList(params).then((res) => {
      setLoader(false);
      if(res?.status){
        setState(res?.data);       
      }
    });
  };

  const handleToolTip = async (id:any) => {
    // await getToolTip(id).then((res) => {
    //   setToolTip(res?.data);
    // });
  };

  const handleClose = () => {
    setOpen(false);
    // getData();
  };

  const handleDelete = async () => {
    // await deleteTournament(deleteId).then((res) => {
    //   toast.success(res.data.message);
    //   setOpen(false);
    //   getData("", page, date, ground, sorting);
    // });
  };

  const handleClickOpen = (id:any) => {
    setDeleteId(id);
    setOpen(true);
  };

  useEffect(() => {
    getData();
    // getToolTipData()
  }, []);

  const GroundType : any = {
    GROUND: "Ground",
    TURF: "Turf",
  };

  const BallType : any = {
    TENNIS: "Tennis",
    LEATHER: "Leather",
  };

  return (
    <Container>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item lg={3.8} md={3} sm={12} xs={12}>
              <h4 className="h2-chart">
                Tournaments
              </h4>
            </Grid>

            <Grid item lg={2} md={3} sm={12} xs={12}>
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
                placeholder={`Search`}
                variant="outlined"
                size="small"
                onChange={(e) => {
                  getData(e.target.value, date, ground, sorting);
                }}
              />
            </Grid>

            <Grid item lg={2} md={3} sm={12} xs={12}>
              <TextField
                fullWidth
                size="small"
                id="date"
                type="date"
                name="from_date"
                onChange={(e) =>
                  getData(search, e.target.value, ground, sorting)
                }
              />
            </Grid>
            <Grid item lg={2} md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Ground Type
                </InputLabel>
                <Select
                  labelId="demo-select-small"
                  id="demo-select-small"
                  label="Ground Type"
                  value={ground}
                  onChange={(e) =>
                    getData(search, date, e.target.value, sorting)
                  }
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="GROUND">Ground</MenuItem>
                  <MenuItem value="TURF">Turf</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item lg={2} md={2} sm={12} xs={12}>
              <div className="add-amenity">
                <button
                  style={{ minWidth: "200px" }}
                  className="main-button-blue"
                  onClick={() => router.push("/user/tournament/create")}
                >
                  Create
                </button>
              </div>
            </Grid>
          </Grid>


<Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          {state && Array.isArray(state) && state.length>0 && 
          state.map((item:any,i:number)=> (
            <Grid item lg={4} md={3} sm={12} xs={12} key={i}>
              <TournamentCard data={item} />
          </Grid>
          ))
          }
          </Grid>


        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle className="border border-bottom text-center">
            Delete Tournament
          </DialogTitle>
          <DialogContent className="text-center p-4">
            Are you sure you want to delete tournament ?
          </DialogContent>
          <DialogActions className="m-0 p-0">
            <div className="w-100 d-flex">
              <Button
                size="large"
                onClick={handleClose}
                className="w-100 rounded-0 text-dark bglightgrey fw-bold"
                sx={{
                  ":hover": {
                    bgcolor: "#DADADA",
                    color: "black",
                  },
                }}
              >
                No
              </Button>
              <Button
                size="large"
                className="w-100 rounded-0 text-white mainbgadmin fw-bold"
                onClick={() => handleDelete()}
                sx={{
                  ":hover": {
                    bgcolor: "#222B42",
                    color: "white",
                  },
                }}
              >
                Yes
              </Button>
            </div>
          </DialogActions>
        </Dialog>
    </Container>
  );
}


TounamentList.auth = { userType: "USER" };