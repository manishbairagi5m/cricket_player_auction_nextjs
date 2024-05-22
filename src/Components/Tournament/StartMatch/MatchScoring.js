import { Grid } from "@mui/material";
import { Card } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState } from "react";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MatchLive from "./scoring/MatchLive";
import MatchScorecard from "./scoring/MatchScorecard";
import MatchOvers from "./scoring/MatchOvers";
import MatchSquads from "./scoring/MatchSquads";
import { useSelector } from "react-redux";
import { scoreFunctions } from "./scoring/scoreFunctions";

const AContainer = styled(Card)(() => ({
  height: "100%",
  padding: "10px 20px",
}));

const MatchScoring = ({
  battingTeam,
  bowlingTeam,
  changeMatchInnings,
  setMatchValue,
  teamsDetailData,
  getBothTeamDetailedData,
  getCurrentMatchData,
  runningMatchData,
  setRunningMatchData,
  battingTeamLogo,
  team,
  team_A_Players,
  team_B_Players,
}) => {
  const [value, setValue] = useState("LIVE");
  
  const imagePath = process.env.REACT_APP_IMG_URL;
  const statedata = useSelector((state) => state.match);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <AContainer>
      <Grid container spacing={2}>
        <Grid item lg={12} md={6} sm={12} xs={12} className="d-flex">
        {statedata.team1.team_logo ?
          <img
            src={imagePath + statedata.team1.team_logo}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          /> :
          <img
            src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          /> 
        }
          <div className="h-100 d-flex align-items-center ms-3 me-3">
            {statedata.team1.team_name} Vs {statedata.team2.team_name}
          </div>
          {statedata.team2.team_logo ? 
          <img
            src={imagePath + statedata.team2.team_logo}
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          : 
          <img
            src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />}
        </Grid>
        <TabContext value={value} className="w-100">
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <TabList onChange={handleChange} aria-label="lab API tabs example1"
             variant="scrollable"
             scrollButtons="auto"
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
                batting={battingTeam}
                bowling={bowlingTeam}
                changeMatchInnings={changeMatchInnings}
                setMatchValue={setMatchValue}
                setRunningMatchData={setRunningMatchData}
                runningMatchData={runningMatchData}
                getCurrentMatchData={getCurrentMatchData}
                teamsDetailData={teamsDetailData}
                getBothTeamDetailedData={getBothTeamDetailedData}
                battingTeamLogo={battingTeamLogo}
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
              setRunningMatchData={setRunningMatchData}
              getCurrentMatchData={getCurrentMatchData}
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
