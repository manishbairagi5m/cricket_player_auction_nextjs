import React, { useState, useEffect } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Container,
  Button,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getTournamentList, deleteTournament } from "@/customApi/tournament";
import { getMyMatchesList } from "@/customApi/user";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import MatchCard from "@/Components/Tournament/MatchCard";
import { SlLocationPin } from "react-icons/sl";
import moment from "moment";

let menus = [
  { label: "All", value: "all" },
  { label: "My Matches", value: "my_matches" },
  { label: "Leather", value: "leather" },
  { label: "Tennis", value: "tennis" },
  { label: "T-20", value: "t_20" },
  { label: "ODI", value: "odi" },
  { label: "Limited overs", value: "limited_overs" },
];

export default function MatchesList() {
  const [loader, setLoader] = useState(false);
  const [selMenu, setSelMenu] = useState("all");
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

  const handleFilter = (params: any) => {
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

  const getData = async (
    search?: any,
    date_filter?: any,
    ground?: any,
    sort?: any
  ) => {
    setLoader(true);
    let params: any = {};
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

    await getMyMatchesList(params).then((res) => {
      setLoader(false);
      if (res?.status) {
        setState(res?.data);
      }
    });
  };

  const handleClose = () => {
    setOpen(false);
    // getData();
  };


  const handleClickOpen = (id: any) => {
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
          <h4 className="h2-chart">Matches</h4>
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
            onChange={(e) => getData(search, e.target.value, ground, sorting)}
          />
        </Grid>

        <Grid item lg={2} md={2} sm={12} xs={12}>
          <div className="add-amenity">
            <button
              style={{ minWidth: "200px" }}
              className="main-button-blue"
              onClick={() => router.push("/user/tournament/create")}
            >
              Start/Schedule Match
            </button>
          </div>
        </Grid>

        <Grid
          item
          lg={12}
          md={12}
          sm={12}
          xs={12}
          className="d-flex align-items-center flex-wrap"
        >
          {menus.map((item) => (
            <div
              onClick={() => setSelMenu(item.value)}
              className={`py-2 px-3 me-2 border ${
                item.value === selMenu && "text-white"
              }`}
              style={{
                borderRadius: "20px",
                backgroundColor: `${
                  item.value === selMenu ? "#191966" : "white"
                }`,
              }}
              key={item.value}
            >
              {item.label}
            </div>
          ))}
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
        {(state &&
          Array.isArray(state) &&
          state.length > 0 &&
          state.map((item: any, i: number) => (


            <Grid item lg={4} md={6} sm={12} xs={12} key={i}>
            <div
              className="rounded p-3 pb-2"
              style={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.25)" }}
              onClick={() => {
                // getCurrentMatch(item);
              }}
            >
              <div className="d-flex justify-content-between align-center">
                <div style={{ fontSize: 13 }}>
                  <h6>Individual Match</h6>
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="small"
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      padding: "0px 10px",
                      borderRadius: 14,
                      backgroundColor: item?.match?.outcome
                        ? "#262626"
                        : item?.match
                        ? "#A00D00"
                        : "#FFAA05",
                    }}
                  >
                    {item?.match?.outcome
                      ? "Completed"
                      : item?.match
                      ? "Live"
                      : "Upcoming"}
                  </Button>
                </div>
              </div>
              <div style={{ fontSize: 14 }} className="mt-1">
                <div className="text-secondary d-flex justify-content-between">
                  <span>
                    {(item?.match?.match_settings?.date &&
                      moment(item.match.match_settings.date).format(
                        "DD-MMM-YYYY"
                      )) ||
                      moment(item.date).format("DD-MMM-YYYY")}
                  </span>
                  <span>
                    {/* {item?.match?.match_settings?.no_of_overs || */}
                      {/* // state?.match_overs} */}
                    {/* Overs */}
                  </span>
                </div>
                <div className="text-secondary">
                  <span>
                    <SlLocationPin className="fs-6" />
                  </span>
                  {/* {state?.city} */}
                </div>
              </div>

              <hr style={{ marginTop: 8, marginBottom: 8 }} />
              {/* <div
                className="d-flex justify-content-between align-items-center"
                style={{ fontSize: 14 }}
              >
                {(curmatch && curmatch.inning1.batting_team) ||
                  item?.teamA_name}
                <div>
                  <span className="text-primary fs-6">
                    {(curmatch &&
                      curmatch?.inning1?.runs_scored &&
                      curmatch.inning1.runs_scored +
                        "/" +
                        curmatch?.inning1?.wickets_lost) ||
                      "Not Started"}
                  </span>
                  <span className="text-secondary">
                    {(curmatch &&
                      curmatch?.inning1?.overs_played &&
                      `(${getApproxOvers(
                        curmatch.inning1.overs_played
                      )} ov)`) ||
                      ""}
                  </span>
                </div>
              </div> */}
              <div
                className="d-flex justify-content-between align-items-center mt-2"
                style={{ fontSize: 14 }}
              >
                {/* {(curmatch && curmatch.inning2.batting_team) ||
                  item?.teamB_name} */}
                <div>
                  <span className="text-primary fs-6">
                    {/* {(curmatch &&
                      curmatch?.inning2?.runs_scored &&
                      curmatch.inning2.runs_scored +
                        "/" +
                        curmatch.inning2.wickets_lost) ||
                      "Not Started"}
                  </span>
                  <span className="text-secondary">
                    {(curmatch &&
                      curmatch?.inning2?.overs_played &&
                      `(${getApproxOvers(
                        curmatch.inning2.overs_played
                      )} ov)`) ||
                      ""} */}
                  </span>
                </div>
              </div>
              <hr style={{ marginTop: 8, marginBottom: 8 }} />
              <div>
                <div className="text-center">
                  <h6 style={{ fontSize: 12 }}>
                    {/* {(curmatch && curmatch?.outcome) || "Not Started"} */}
                  </h6>
                </div>
              </div>
            </div>
          </Grid>


          ))) || (
          <div
            className="w-100 d-flex justify-content-center align-items-center"
            style={{ height: "500px" }}
          >
            {loader ? (
              <Spinner animation="border" />
            ) : (
              "Matches Not Available"
            )}
          </div>
        )}
      </Grid>
    </Container>
  );
}

MatchesList.auth = { userType: "USER" };
