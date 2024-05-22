import { Grid } from "@mui/material";
import { Card } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState,useEffect } from "react";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MatchLive from "@/Components/Tournament/Matches/MatchLive";
import MatchOvers from "@/Components/Tournament/StartMatch/scoring/MatchOvers";
import MatchSquads from "@/Components/Tournament/StartMatch/scoring/MatchSquads";
import MatchScorecard from "@/Components/Tournament/StartMatch/scoring/MatchScorecard";
import { getTeamList } from "@/customApi/tournament";
import { scoreFunctions } from "@/Components/Tournament/StartMatch/scoring/scoreFunctions";
import { useRouter } from "next/router";
import Image from "next/image";

const AContainer = styled(Card)(() => ({
  height: "100%",
  padding: "10px 20px",
}));

const MatchScoring = ({runningMatchData,team_A_Players,team_B_Players,curMatchListData,setRunningMatchData}) => {
  const [value, setValue] = useState("LIVE");
  const [team, setTeam] = useState([]);
  const router = useRouter()
  const [teamsDetailData, setTeamsDetailData] = useState({
    team1: { batsman: [], bowler: [] },
    team2: { batsman: [], bowler: [] },
  });
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getBothTeamDetailedData = (matchdata) => {
    let newdata = {  team1: { batsman: [], bowler: [] },team2: { batsman: [], bowler: [] }, };
    let type = ["batsman", "bowler"];
    for (let k = 0; k < type.length; k++) {
      for (let i = 0; i < matchdata[type[k]].length; i++) {
        for (let j = 0; j < matchdata.team1.players.length; j++) {
          if (
            matchdata.team1.players[j].players_id ===
            matchdata[type[k]][i].players_id
          ) {
            newdata.team1[type[k]].push(matchdata[type[k]][i]);
          }
        }
        for (let j = 0; j < matchdata.team2.players.length; j++) {
          if (
            matchdata.team2.players[j].players_id ===
            matchdata[type[k]][i].players_id
          ) {
            newdata.team2[type[k]].push(matchdata[type[k]][i]);
          }
        }
      }
    }
    setTeamsDetailData(newdata);
  };

  
  const getDetail = async () => {
    let params = { tournament_id: router.query.id };
    await getTeamList(params).then((res) => {
      if (res?.status) {
        setTeam(res?.data);
        getBothTeamDetailedData(runningMatchData)
      }
    });
  };

  useEffect(() => {
    getDetail();
  }, []);

  const imageLoader = (img) => {
    return img ? `${IMAGEURL}${img}` : `https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png`;
  };


  return (
    <AContainer>
      <Grid container spacing={2}>
        <Grid item lg={12} md={6} sm={12} xs={12} className="d-flex">
          <Image
          loader={()=> imageLoader(curMatchListData.teamA_logo)}
           src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
           width={50}
           height={50}
           alt="img"
            style={{ 
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div className="h-100 d-flex align-items-center ms-3 me-3">
            {curMatchListData.teamA_name} Vs {curMatchListData.teamB_name}
          </div>
          <Image
          loader={()=> imageLoader(curMatchListData.teamB_logo)}
           src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
           width={50}
           height={50}
           alt="img"
            style={{ 
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Grid>
        <TabContext value={value} className="w-100">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TabList onChange={handleChange} aria-label="lab API tabs example1"
               TabIndicatorProps={{
                sx: {
                  border:'1px solid black',
                },
              }}
             sx={{
              "& .MuiTab-root": {
              fontFamily:"Inter-SemiBold"
            },
            ".Mui-selected": {
              color: `#171717 !important`,
              },
          }}>
              <Tab label="LIVE" value="LIVE" />
              <Tab label="SCORECARD" value="SCORECARD" />
              <Tab label="SQUADS" value="SQUADS" />
              <Tab label="OVERS" value="OVERS" />
            </TabList>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} className="d-flex justify-content-end align-items-end pe-3">
          {value === "LIVE" &&
            <div className="fw-bold text-primary p-2 ps-4 pe-4" style={{borderBottom:"3px solid black"}}>
              {Object.keys(runningMatchData).length > 0 && scoreFunctions.getOutCome(runningMatchData)}</div>
            }
          </Grid>
          <Grid item lg={12} md={6} sm={12} xs={12}>
            <TabPanel value="LIVE">
              <MatchLive 
                runningMatchData={runningMatchData}
                teamsDetailData={teamsDetailData}
                getBothTeamDetailedData={getBothTeamDetailedData}
                setRunningMatchData={setRunningMatchData}
                team={team}
              />
            </TabPanel>
            <TabPanel value="SCORECARD">
              <MatchScorecard
                runningMatchData={runningMatchData}
                teamsDetailData={teamsDetailData}
              />
            </TabPanel>
            <TabPanel value="SQUADS">
              <MatchSquads 
              runningMatchData={runningMatchData} 
              team={team}
              team_A_Players={team_A_Players}
              team_B_Players={team_B_Players} />
            </TabPanel>
            <TabPanel value="OVERS">
              <MatchOvers runningMatchData={runningMatchData}/>
            </TabPanel>
          </Grid>
        </TabContext>
      </Grid>
    </AContainer>
  );
};

export default MatchScoring;
