import React, { useState } from "react";
import MatchScoring from "@/Components/Tournament/Matches/MatchScoring"
import Matches from "@/Components/Tournament/Matches/Matches"

interface IMatchesTabProps {
  state: any;
}

export default function MatchesTab ({ state } : IMatchesTabProps) {
  const [matchValue, setMatchValue] = useState("matches_list");
  const [runningMatchData, setRunningMatchData] = useState({});
  const [team_A_Players, setTeamAPlayer] = useState([]);
  const [team_B_Players, setTeamBPlayer] = useState([]);
  const [curMatchListData, setCurMatchListData] = useState();
  
  return (
    <>
      {matchValue === "matches_score" ? (
        <MatchScoring
        runningMatchData={runningMatchData}
        team_A_Players={team_A_Players}
        team_B_Players={team_B_Players}
        curMatchListData={curMatchListData}
        setRunningMatchData={setRunningMatchData}
        />
      ) : matchValue === "matches_list" ? (
        <Matches
        state={state}
        setRunningMatchData={setRunningMatchData}
        setMatchValue={setMatchValue}
        setTeamAPlayer={setTeamAPlayer}
        setTeamBPlayer={setTeamBPlayer}
        setCurMatchListData={setCurMatchListData}
        />
      ) : (
        ""
      )}
    </>
  );
};

