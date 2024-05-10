import {
  Avatar,
  Dialog,
  DialogActions,
  DialogTitle,
  InputAdornment,
  Slide,
  TextField,
} from "@mui/material";
//   import { teamlogo } from "Assets";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
//   import AddTeam from "./AddTeam";
//   import { getTeamList } from "services/admin/Tournamet";
import Typography from "@mui/material/Typography";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";
import { GrLocation } from "react-icons/gr";
//   import EditTeam from "./EditTeam";


export default function Team({ teamId, setAddTeam, state, setTeamId }) {
  // const imagePath = process.env.REACT_APP_IMG_URL;
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [teamid, setTeamid] = useState(null);
  const [fullWidth, setFullWidth] = useState(true);
  const [team, setTeam] = useState([]);
  const [search, setSearch] = useState("");
  // const { id } = useParams();

  const getDetail = async (search) => {
    //   let params = {tournament_id:id}
    //   if(search){
    //     params = {...params, search}
    //     setSearch(search)
    //   }
    //   await getTeamList(params).then((res) => {
    //     setTeam(res?.data?.data);
    //   });
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <div>
      <SimpleCard>
        <div className="me-2 d-flex justify-content-end">
          <TextField
            fullWidth
            className="w-25 mb-4"
            type="search"
            id="outlined-basic"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
            onChange={(e) => getDetail(e.target.value)}
            placeholder="Search Teams"
            variant="outlined"
            size="small"
          />
        </div>

        <div div className="row">
          {team &&
            team.length > 0 &&
            team.map((item, index) => {
              return (
                <div className="col-4" key={index}>
                  <div className="team-card">
                    <div
                      className="d-flex justify-content-end"
                      style={{ textDecoration: "underline" }}
                    >
                      <p
                        onClick={() => {
                          setEdit(true);
                          setTeamId(item.team_id);
                        }}
                        className="mb-0 me-4"
                        style={{
                          color: "#0C1738",
                          cursor: "pointer",
                          fontFamily: "Inter-Medium",
                        }}
                      >
                        Edit Team
                      </p>
                      <p
                        onClick={() => {
                          setAddTeam(`select_palying_XI_`);
                          setTeamId(item.team_id);
                        }}
                        className="mb-0"
                        style={{
                          color: "#0C1738",
                          cursor: "pointer",
                          fontFamily: "Inter-Medium",
                        }}
                      >
                        Players
                      </p>
                    </div>

                    <div className="d-flex">
                      <div>
                        {/* {(item.team_logo && (
                          <Avatar
                            alt=""
                            src={imagePath + item?.team_logo}
                            sx={{ width: 60, height: 60, margin: "0 auto" }}
                          />
                        )) || ( */}
                          <Avatar
                            alt=""
                            src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
                            sx={{ width: 60, height: 60, margin: "0 auto" }}
                          />
                        {/* )} */}
                        {/* <img src={item?.team_logo ? imagePath+item?.team_logo : teamlogo} style={{ width: "60px" }} /> */}
                      </div>
                      <div>
                        <h5 className="ms-4 mb-2" style={{ fontSize: "16px" }}>
                          {item?.team_name || "0"}
                        </h5>
                        <div className="ms-3">
                          <p
                            className="d-flex align-items-center mb-2 ms-1"
                            style={{ gap: "8px", marginTop: "0" }}
                          >
                            <span className="captain-spain">C</span>
                            <span
                              className="text-secondary"
                              style={{ fontSize: "15px" }}
                            >
                              {item?.captain_name || ""}
                            </span>
                          </p>
                          <p
                            className="ms-1 d-flex align-items-center"
                            style={{ gap: "8px" }}
                          >
                            <GrLocation style={{ fontSize: "20px" }} />
                            <span
                              className="text-secondary"
                              style={{ fontSize: "15px" }}
                            >
                              {item?.city || ""}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Add Team */}
          {team && team?.length >= state?.no_of_teams ? (
            ""
          ) : (
            <div className="col-4">
              <div className="add-team" onClick={() => setAdd(true)}>
                <p
                  className="cursor-pointer"
                  style={{ borderBottom: "2px solid #828282" }}
                >
                  {" "}
                  Create Team
                </p>
              </div>
            </div>
          )}
        </div>

      </SimpleCard>
    </div>
  );
}
