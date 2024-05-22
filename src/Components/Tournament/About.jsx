import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
// import { loginBanner, userIcon } from "Assets";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import React, { useState } from "react";
// import { getSingleTournamentAbout } from "services/admin/Tournamet";
// import MatchSquads from "./StartMatch/scoring/MatchSquads";
import { FaPencilAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } },
  },
}));

export default function About({ state }) {
  const router = useRouter();

  let ball_type_obj = {
    TENNIS: "Tennis",
    LEATHER: "Leather",
  };

  let ground_type_obj = {
    GROUND: "Ground",
    TURF: "Turf",
  };

  let match_type_obj = {
    LIMITED_OVER: "Limited over",
    ONE_DAY: "One day",
    T_20:"T-20"
  };

  return (
      <Container>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item lg={4} md={3} sm={12} xs={12}>
            <SimpleCard>
              <Box>
                {/* {(state?.tournament_logo && (
                  <Avatar
                    alt=""
                    src={APIimage + state?.tournament_logo}
                    sx={{ width: 84, height: 84, margin: "0 auto" }}
                  />
                )) || ( */}
                  <Avatar
                    alt="logo"
                    src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
                    sx={{ width: 84, height: 84, margin: "0 auto" }}
                  />
                {/* // )} */}

                <h4 className="text-center mt-2">Organizer Name</h4>
                <p className="text-center" style={{ fontSize: "14px" }}>
                  {state?.organizer_name || ""}
                </p>

                <hr style={{ marginBottom: "0", marginTop: "15px" }} />
              </Box>

              <StyledTable width="100%">
                <TableBody>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>{state?.city || ""}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Tournament Organized</TableCell>
                    <TableCell>{state?.tournamentCount || "0"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>{state?.organizer_number || ""}</TableCell>
                  </TableRow>
                </TableBody>
              </StyledTable>
            </SimpleCard>
          </Grid>

          {/* Tournament Details */}
          <Grid item lg={4} md={3} sm={12} xs={12}>
            <SimpleCard>
              <h4>Tournament Details</h4>

              <hr style={{ marginTop: "15px", marginBottom: "0" }} />

              <StyledTable width="100%">
                <TableBody>
                  <TableRow>
                    <TableCell>Tournament Name</TableCell>
                    <TableCell>{state?.tournament_name || ""}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>
                      {state?.from_date || "" + "TO" + state?.to_date || ""}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Ball Type</TableCell>
                    <TableCell>
                      {ball_type_obj[state?.ball_type || ""]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Match Type</TableCell>
                    <TableCell>
                      {match_type_obj[state?.match_type || ""]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell>
                      {state?.city || ""}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>{state?.state || ""}</TableCell>
                  </TableRow>
                </TableBody>
              </StyledTable>
            </SimpleCard>
          </Grid>

          {/* Tournament Winner Prize */}
          <Grid item lg={4} md={3} sm={12} xs={12}>
            <SimpleCard>
              <h4>Tournament Winner</h4>
              <hr style={{ marginTop: "15px", marginBottom: "0" }} />
              <StyledTable width="100%">
                <TableBody>
                  <TableRow>
                    <TableCell width="42%">Winner</TableCell>
                    {state?.result &&
                    <TableCell width="38%" className="text-success fw-bold" >{state?.result?.winner || ""}</TableCell>
                    }
                    <TableCell width={state?.result ? "20%" : "40"} className="text-center">{state?.first_prize || ""}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Runner-up</TableCell>
                    {state?.result &&
                    <TableCell className="text-success fw-bold">{state?.result?.runner_up || ""}</TableCell>
                    }
                    <TableCell className="text-center">{state?.runner_up_prize || ""}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Man Of The Match</TableCell>
                    {state?.result &&
                    <TableCell className="text-success fw-bold">{state?.result?.MOM || ""}</TableCell>
                    }
                    <TableCell className="text-center">{state?.MOM || ""}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Most Valuable Player</TableCell>
                    {state?.result &&
                    <TableCell className="text-success fw-bold">{state?.result?.MVP || ""}</TableCell>
                    }
                    <TableCell className="text-center">{state?.MVP || ""}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Best Batsman</TableCell>
                    {state?.result &&
                    <TableCell className="text-success fw-bold">{state?.result?.best_batsman || ""}</TableCell>
                    }
                    <TableCell className="text-center">{state?.best_batsman}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Best Bowler</TableCell>
                    {state?.result &&
                    <TableCell className="text-success fw-bold">{state?. result?.best_bowler || ""}</TableCell>
                    }
                    <TableCell className="text-center">{state?.best_bowler || ""}</TableCell>
                  </TableRow>
                </TableBody>
              </StyledTable>
            </SimpleCard>
          </Grid>
        </Grid>

        {/* Description */}
        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mb: 3, mt: 3 }}>
          <SimpleCard style={{ paddingTop: "0px" }}>
            <h4 className="mb-3">Description</h4>
            <hr />
            <div
              className="tournament-about-paragraph"
              dangerouslySetInnerHTML={{ __html: state?.description }}
              style={{
                fontFamily: "Inter-Regular",
                color: "#34314c",
                fontSize: "14px",
              }}
            ></div>
          </SimpleCard>
        </Grid>

        {/* Sponsors */}
        <SimpleCard>
          <div className="d-flex justify-content-between ">
            <div>
              <h4 className="mb-2"> Sponsors</h4>
            </div>
            <div>
              <FaPencilAlt
                style={{ fontSize: "20px", cursor: "pointer" }}
                onClick={() => router.push(`/tournament/sponsors/${state?._id}`)}
              />
            </div>
          </div>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {/* {state?.Sponsers &&
              state?.Sponsers.length > 0 &&
              state?.Sponsers.map((item, index) => {
                return (
                  <Grid item lg={3} md={3} sm={12} xs={12} key={index}>
                    {item?.sponsors_logo &&
                      ((
                        <img
                          src={APIimage + item?.sponsors_logo}
                          style={{
                            width: "100%",
                            height: "170px",
                            objectFit: "contain",
                          }}
                        />
                      ) || (
                        <img
                          src={loginBanner}
                          style={{
                            width: "100%",
                            height: "170px",
                            objectFit: "contain",
                          }}
                        />
                      ))}
                    <h4
                      style={{ fontSize: "20px", textAlign: "center" }}
                      className="mt-4 mb-4"
                    >
                      {item?.sponsors_type || "-"}
                    </h4>
                  </Grid>
                );
              })} */}
          </Grid>
        </SimpleCard>
      </Container>
  );
};

