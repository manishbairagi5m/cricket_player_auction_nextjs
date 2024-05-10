import React, { useState, useEffect } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { MdModeEdit,MdDelete  } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import {
  ClickAwayListener,
  DialogContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Fab,
  Icon,
  IconButton,
  Slide,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  FaArrowDown,
  FaEye,
  FaInfoCircle,
  FaPencilAlt,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
import Image from "next/image";


const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize",wordBreak:'break-word' } },
  },
}));

export default function TounamentList() {
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState("");
  const [date, setDate] = useState("");
  const [toolTip, setToolTip] = useState<any>("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecord: 0,
  });

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
      pagination.page,
      date,
      ground,
      sortIcon[params].a === true ? sortIcon[params].b : sortIcon[params].c
    );
    setSortIcon({
      ...sortIcon,
      [params]: { ...sortIcon[params], a: !sortIcon[params].a },
    });
  };

  const getData = async (search?:any, per_page?:any, date_filter?:any, ground?:any, sort?:any) => {
    // setLoader(true);
    let params : any = { page: per_page, limit: pagination.limit };
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

    // await getTournamentList(params).then((res) => {
    //   setLoader(false);
    //   if(res?.status){
    //     setState(res?.data.data);
    //     setPagination({
    //       page: res?.data.pagination.page,
    //       limit: res?.data.pagination.limit,
    //       totalRecord: res?.data.pagination.totalRecord,
    //     });
    //   }
    // });
  };

  const handleToolTip = async (id:any) => {
    // await getToolTip(id).then((res) => {
    //   setToolTip(res?.data);
    // });
  };

  const handleChangePage = (selectedObject:any) => {
    setPagination({ ...pagination, page: selectedObject.selected + 1 });
    getData(search, selectedObject.selected + 1, date, ground, sorting);
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
    getData("", page);
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
                  getData(e.target.value, page, date, ground, sorting);
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
                  getData(search, page, e.target.value, ground, sorting)
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
                    getData(search, page, date, e.target.value, sorting)
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
            <Grid item lg={4} md={3} sm={12} xs={12}>
          <div className="tournament-card" 
          onClick={()=> router.push(`/user/tournament/detail/sdjff12fsdf4sf5?tab=about`)}>
            <div className="tournament-card-firsthalf">
                <Image
                    src="/Assets/Images/tournament-banner.jpg"
                    width={400}
                    height={250}
                    alt="img"
                    className="tournament-card-bgimage"
                />
                <Image
                    src="/Assets/Images/pexels-photo-674010.jpeg"
                    width={100}
                    height={100}
                    alt="img"
                    className="tournament-card-logo"
                />
                <div className="tournament-card-status">Live</div>
            </div>
            <div className="tournament-card-secondhalf">
                <p className="text-end">10 over
                <Image
                    src="/Assets/Images/tennis.png"
                    width={50}
                    height={50}
                    alt="img"
                    className="tournament-card-ball"
                />
                Turf
                </p>
                <h5>Indore Premier League</h5>
                <p className="mb-3 mt-1"> <FaLocationDot className="fs-5" /> Mahesh Turf,Vijay Nagar,Indore</p>
                <div className="tournament-card-data"> <FaCalendarAlt className="fs-5" /> From - 10 May 2023</div>
                <div className="tournament-card-data"> <FaCalendarAlt className="fs-5" /> To   - 30 May 2023</div>
                <div className="tournament-card-data"> <FaPeopleGroup className="fs-5" /> Team Registered - 5 
                <RiErrorWarningFill className="ms-1 text-warning fs-6" /></div>
                <div className="tournament-card-buttons">
                    <div> <MdModeEdit /> </div>
                    <div className="mb-2"> <MdDelete   className="text-danger" /> </div>
                </div>
            </div>
          </div>
          </Grid>
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