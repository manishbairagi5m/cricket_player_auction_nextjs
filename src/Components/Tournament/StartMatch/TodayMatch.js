import { Container, Grid } from "@mui/material";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import React, { useState, useEffect } from "react";
import { getMatchList, getFixtureTeamList, getMatchData } from "@/customApi/tournament";
import { helper } from "@/Helper";
import {
  team1,
  team2,
  resetMatch,
} from "@/lib/slice/matchSlice";
import { resetScore } from "@/lib/slice/scoreSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Spinner } from "react-bootstrap";

const TodayMatch = ({
  setMatchValue,
  setMatchData,
  team,
  setTeamAPlayer,
  setTeamBPlayer,
  setBothteam,
  getCurrentMatchData,
}) => {
  const [loader, setLoader] = useState(false);
  const [matchlist, setMatchlist] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;

  let obj = {
    PRE_LEAGUE: "Pre League",
    LEAGUE: "League",
    SUPER_LEAGUE: "Super League",
    PRE_QF: "Pre QF",
    QF: "QF",
    SEMI_FINAL: "Semi Final",
    FINAL: "Final",
  };

  const getMatchRunning = async (data) => {
    setMatchData(data);

    // teamPLayers(data.teamA_id, 'teamA')
    // teamPLayers(data.teamB_id, 'teamB')

    await getFixtureTeamList(data._id).then((res) => {
      if (res?.status) {
        if (res.data[0]?.match_id) {
          getRunningMatchData(res.data[0]?.match_id);
        } else {
          dispatch(resetMatch());
          dispatch(resetScore());
          setMatchValue("match_detail");
        }
        dispatch(
          team1({
            team_id: res.data[0].teamA_id,
            team_name: res.data[0].teamA_name,
            team_logo: res.data[0].teamA_logo,
            players: [...res.data[0].teamA_players[0]],
          })
        );
        dispatch(
          team2({
            team_id: res.data[0].teamB_id,
            team_name: res.data[0].teamB_name,
            team_logo: res.data[0].teamB_logo,
            players: [...res.data[0].teamB_players[0]],
          })
        );
        setTeamAPlayer(res.data[0].teamA_players[0]);
        setTeamBPlayer(res.data[0].teamB_players[0]);
      }
    });
  };

  const getRunningMatchData = async (matchid) => {
    let params = { id: matchid };
    await getMatchData(params).then((res) => {
      if (res?.status) {
        getCurrentMatchData(res.data);
      }
    });
  };

  const getData = async () => {
    setLoader(true);
    const params = { tournament_id: router.query.id };
    await getMatchList(params)
      .then((res) => {
        let arr = [];
        for (let i = 0; i < res.data.length; i++) {
          if (
            new Date(res.data[i].date).getDate() ===
              new Date().getDate() &&
            new Date(res.data[i].date).getMonth() === new Date().getMonth()
          ) {
            arr.push(res.data[i]);
          }
        }
        setMatchlist(arr);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
        setLoader(false);
      });
  };

  const calcRemainingTime = (date) => {
    let newDate = new Date(date.split(".")[0]) - new Date();
    if (newDate > 0) {
      let condate = new Date(newDate);
      let parseDate = "";
      let hours =
        condate.getUTCHours() < 10
          ? `0${condate.getUTCHours()}`
          : condate.getUTCHours();
      let minutes =
        condate.getUTCMinutes() < 10
          ? `0${condate.getUTCMinutes()}`
          : condate.getUTCMinutes();
      let seconds =
        condate.getUTCSeconds() < 10
          ? `0${condate.getUTCSeconds()}`
          : condate.getUTCSeconds();
      if (condate.getUTCDate() - 1 > 0) {
        parseDate = `${
          condate.getUTCDate() - 1
        }d:${hours}:${minutes}:${seconds}`;
      } else if (hours > 0) {
        parseDate = `${hours}:${minutes}:${seconds}`;
      } else {
        parseDate = `${minutes}:${seconds}`;
      }
      return parseDate;
    } else {
      return "LIVE";
    }
  };

  const checkToStart = (matchdata) => {
    let remTime = new Date(
      new Date(matchdata?.date.split(".")[0]) - new Date()
    );
    if (matchdata?.match?.outcome) {
      return "Result";
    } else if (matchdata?.match) {
      return "Resume";
    } else if (remTime.getUTCHours() < 1 && remTime.getUTCMinutes() <= 30) {
      return "Start";
    } else {
      return `Today ${helper.dateConverter(matchdata?.date)}`;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setUpdateData([...matchlist]), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const imageLoader = (img, defaultimg) => {
    return img ? `${IMAGEURL}${img}` : `/Assets/Images/${defaultimg}`;
  };

  return (
    <Container>
      {(loader && (
        <div className="w-100 d-flex justify-content-center">
          <Spinner />
        </div>
      )) || (
        <Grid container spacing={2} className="mt-1">
          {(matchlist &&
            matchlist.length > 0 &&
            team.length > 0 &&
            matchlist.map((item, index) => {
              let teamALogo = team.find(
                (item1) => item1.team_id === item.teamA_id
              );
              let teamBLogo = team.find(
                (item1) => item1.team_id === item.teamB_id
              );
              return (
                <Grid item lg={4} md={6} sm={12} xs={12} key={index}>
                  <div
                    className="team-cards"
                    onClick={() => {
                      getMatchRunning(item);
                    }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <p
                          className="mb-0 fw-bold text-dark"
                          style={{ fontFamily: "Poppins-Bold" }}
                        >
                          {obj[item.tournament_stages]} Match
                        </p>
                      </div>
                      <div style={{ color: "#A00D00" }}>
                        {item?.match?.outcome
                          ? "COMPLETED"
                          : item?.date
                          ? calcRemainingTime(item.date, item?.match?.outcome)
                          : ""}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div>
                        <Image
                          src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
                        loader={()=> imageLoader(teamALogo?.team_logo,"https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png")}
                          width={70}
                          height={70}
                          alt="img"
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        /> 
                        <br />
                        <p className="mt-2 mb-0 text-dark">{item.teamA_name}</p>
                      </div>
                      <div>
                        <Image
                        src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
                        loader={()=> imageLoader(teamBLogo?.team_logo,"https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png")}
                        width={70}
                        height={70}
                        alt="img"
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      
                        <br />
                        <p className="mt-2 mb-0 text-dark">{item.teamB_name}</p>
                      </div>
                    </div>
                    <p className="mb-0 text-primary fw-bold text-uppercase">
                      {checkToStart(item)}
                      {/* {`Today ${Helper.dateConverter(item?.date)}`} */}
                      {/* item?.date.split('T')[1].split('.')[0].slice(0,-3) */}
                    </p>
                  </div>
                </Grid>
              );
            })) || <div className="w-100 text-center">No Match Today</div>}
        </Grid>
      )}
    </Container>
  );
};

export default TodayMatch;
