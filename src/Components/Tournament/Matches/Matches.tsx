import React, { useState, useEffect } from "react";
import { SlLocationPin } from "react-icons/sl";
import { getMatchList, getFixtureTeamList } from "@/customApi/tournament";
import { Grid, Button, Container } from "@mui/material";
import moment from "moment";
import { scoreFunctions } from "@/Components/Tournament/StartMatch/scoring/scoreFunctions";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import { useRouter } from "next/router";

interface IMatchesTabProps {
  state : any;
  setRunningMatchData : any;
  setMatchValue : any;
  setTeamAPlayer : any;
  setTeamBPlayer : any;
  setCurMatchListData : any;
}

export default function Matches({
  state,
  setRunningMatchData,
  setMatchValue,
  setTeamAPlayer,
  setTeamBPlayer,
  setCurMatchListData,
}: IMatchesTabProps) {
  const [matchData, setMatchData] = useState<any>([]);
  const router = useRouter();

  const getData = async () => {
    const params = { tournament_id: router.query.id };
    await getMatchList(params).then((res) => {
      if (res?.status) {
        setMatchData(res.data);
      }
    });
  };

  const getMatchRunning = async (data:any) => {
    await getFixtureTeamList(data._id).then((res) => {
      if (res?.status) {
        setTeamAPlayer(res.data[0].teamA_players[0]);
        setTeamBPlayer(res.data[0].teamB_players[0]);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getApproxOvers = (overs:any) => {
    return (
      (String(overs).split(".")[1] === "6" &&
        Number(String(overs).split(".")[0]) + 1) ||
      overs
    );
  };

  const getMatchPosition = (curmatch:any) => {
    let obj : any = false;
    if (curmatch?.match) {
      let inning1 =
        (curmatch.match.innings[0].first_bat && curmatch.match.innings[0]) ||
        curmatch.match.innings[1];
      let inning2 =
        (curmatch.match.innings[0].first_bat && curmatch.match.innings[1]) ||
        curmatch.match.innings[0];
      obj = {
        inning1: { ...inning1 },
        inning2: { ...inning2 },
        outcome: scoreFunctions.getOutCome(curmatch.match),
      };
    }
    return obj;
  };

  const getCurrentMatch = (item:any) => {
    if (item?.match) {
      setRunningMatchData(item.match);
      setMatchValue("matches_score");
      getMatchRunning(item);
      setCurMatchListData(item);
    }
  };

  return (
    <Container>
    <Grid container spacing={3}>
      {(matchData &&
        matchData.length > 0 &&
        matchData.map((item:any, index:number) => {
          let curmatch = getMatchPosition(item);
          return (
            <Grid item lg={4} md={6} sm={12} xs={12} key={index}>
              <div
                className="rounded p-3 pb-2"
                style={{ boxShadow: "0px 0px 9px rgba(0, 0, 0, 0.25)" }}
                onClick={() => {
                  getCurrentMatch(item);
                }}
              >
                <div className="d-flex justify-content-between align-center">
                  <div style={{ fontSize: 13 }}>
                    <h6>{state?.tournament_name}</h6>
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
                      {item?.match?.match_settings?.no_of_overs ||
                        state?.match_overs}{" "}
                      Overs
                    </span>
                  </div>
                  <div className="text-secondary">
                    <span>
                      <SlLocationPin className="fs-6" />
                    </span>
                    {state?.city}
                  </div>
                </div>

                <hr style={{ marginTop: 8, marginBottom: 8 }} />
                <div
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
                </div>
                <div
                  className="d-flex justify-content-between align-items-center mt-2"
                  style={{ fontSize: 14 }}
                >
                  {(curmatch && curmatch.inning2.batting_team) ||
                    item?.teamB_name}
                  <div>
                    <span className="text-primary fs-6">
                      {(curmatch &&
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
                        ""}
                    </span>
                  </div>
                </div>
                <hr style={{ marginTop: 8, marginBottom: 8 }} />
                <div>
                  <div className="text-center">
                    <h6 style={{ fontSize: 12 }}>
                      {(curmatch && curmatch?.outcome) || "Not Started"}
                    </h6>
                  </div>
                </div>
              </div>
            </Grid>
          );
        })) || (
        <Grid item lg={12} md={6} sm={12} xs={12}>
          <SimpleCard>
            <div className="w-100 d-flex justify-content-center align-items-center">
              No Matches Found
            </div>
          </SimpleCard>
        </Grid>
      )}
    </Grid>
    </Container>
  );
}
