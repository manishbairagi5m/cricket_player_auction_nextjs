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
  Dialog,
  DialogActions,
  DialogTitle,
  styled,
} from "@mui/material";
import {  FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import TournamentCard from "@/Components/Tournament/TournamentCard";
import { getTournamentList, deleteTournament } from "@/customApi/tournament"
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";


const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

let menus = [
  {label:"All",value:"all"},
  {label:"My Tournament",value:"my_tournament"},
  {label:"Leather",value:"leather"},
  {label:"Tennis",value:"tennis"},
  {label:"T-20",value:"t_20"},
  {label:"ODI",value:"odi"},
  {label:"Limited overs",value:"limited_overs"},
]

export default function TounamentList() {
  const [loader, setLoader] = useState(false);
  const [selMenu, setSelMenu] = useState('all');
  const [state, setState] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState("");
  const [date, setDate] = useState("");
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
    setLoader(true);
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

  const handleClose = () => {
    setOpen(false);
    // getData();
  };

  const handleDelete = async () => {
    await deleteTournament(deleteId).then((res:any) => {
      toast.success(res.message);
      setOpen(false);
      getData("", date, ground, sorting);
    });
  };

  const handleClickOpen = (id:any) => {
    setDeleteId(id);
    setOpen(true);
  };

  useEffect(() => {
    getData();
    // getToolTipData()
  }, []);


  return (
    <Container>
          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item lg={5.8} md={3} sm={12} xs={12}>
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


            <Grid item lg={12} md={12} sm={12} xs={12} className="d-flex align-items-center flex-wrap">
              {menus.map((item)=> (
                <div onClick={()=> setSelMenu(item.value)}
                className={`py-2 px-3 me-2 border ${item.value===selMenu && "text-white"}`} 
                style={{borderRadius:"20px", backgroundColor:`${item.value===selMenu ? "#191966" : "white"}`}} 
                key={item.value}>{item.label}</div>
              ))}
            </Grid>

          </Grid>


<Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
          {state && Array.isArray(state) && state.length>0 && 
          state.map((item:any,i:number)=> (
            <Grid item lg={4} md={3} sm={12} xs={12} key={i}>
              <TournamentCard data={item} handleClickOpen={handleClickOpen} />
          </Grid>
          )) ||
          <div className="w-100 d-flex justify-content-center align-items-center" style={{height:"500px"}}>
            {loader 
            ? <Spinner animation="border" />
            : "Tournament Not Available"
          }
          </div>
          }
          </Grid>


        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle className="border border-bottom text-center">
            Delete Tournament
          </DialogTitle>
          <DialogContent className="text-center py-5 px-4">
            Are you sure you want to delete tournament ?
          </DialogContent>
          <DialogActions className="m-0 p-0">
            <div className="w-100 d-flex">
              <button
                onClick={handleClose}
                className="main-button-blue rounded-0 w-50 border-end"
              >
                No
              </button>
              <button
                className="main-button-blue rounded-0 w-50"
                onClick={() => handleDelete()}
              >
                Yes
              </button>
            </div>
          </DialogActions>
        </Dialog>
    </Container>
  );
}


TounamentList.auth = { userType: "USER" };