export const scoreFunctions = {
  
  getApproxOvers: (overs) => {
    return (
      (String(overs).split(".")[1] === "6" &&
        Number(String(overs).split(".")[0]) + 1) ||
      overs
    );
  },

  getBallFromOver: (ov) => {
    let over = ov.toFixed(1).split(".");
    return over[0] * 6 + Number(over[1]);
  },

  checkInningsNumber : (runningMatchData=null,battingTeam=null) => {
    let isTrue = false
    if(runningMatchData && battingTeam && Object.keys(runningMatchData).length > 0){
      if(runningMatchData.innings[0].first_bat){
        if(runningMatchData.innings[1].batted_team_id === battingTeam.team_id){
            isTrue = true
        }
      }else{
        if(runningMatchData.innings[0].batted_team_id === battingTeam.team_id){
          isTrue = true
      }
      }
    }
    return isTrue
  },

  getOutCome1: (runningMatchData) => {
    let outcome = "";
    if (Object.keys(runningMatchData).length > 0) {
      let first_bat_team =
        (runningMatchData.innings[0].first_bat &&
          runningMatchData.innings[0]) ||
        runningMatchData.innings[1];
      let second_bat_team =
        (runningMatchData.innings[0].first_bat &&
          runningMatchData.innings[1]) ||
        runningMatchData.innings[0];
      let wicket_win =
        (runningMatchData.innings[0].first_bat &&
          runningMatchData.team2.players.length -
            (runningMatchData.innings[1].batsmen.length - 1)) ||
        runningMatchData.team1.players.length -
          (runningMatchData.innings[0].batsmen.length - 1);
      if (
        Number(first_bat_team.runs_scored) > Number(second_bat_team.runs_scored)
      ) {
        outcome = `${first_bat_team.batting_team} won by ${
          Number(first_bat_team.runs_scored) -
          Number(second_bat_team.runs_scored)
        } Runs`;
      } else if (
        Number(first_bat_team.runs_scored) < Number(second_bat_team.runs_scored)
      ) {
        outcome = `${second_bat_team.batting_team} won by ${wicket_win} Wicket`;
      } else if (
        Number(first_bat_team.runs_scored) ===
        Number(second_bat_team.runs_scored)
      ) {
        outcome = "Match Draw";
      }
    }
    return outcome;
  },

  getOutCome: (updatedData) => {
    let outcome = "";
    let first_bat_inning = (updatedData.innings[0].first_bat && updatedData.innings[0]) || updatedData.innings[1];
    let second_bat_inning = (updatedData.innings[0].first_bat && updatedData.innings[1]) || updatedData.innings[0];
    let second_bat_team = (updatedData.innings[0].first_bat && updatedData.team2) || updatedData.team1;
    if (updatedData && Object.keys(updatedData).length > 0) {
      if (updatedData?.outcome) {
        if (!updatedData.outcome.winner || updatedData.outcome?.by?.result === "DRAW"
        ) {
          outcome = "Match Draw";
        } else{
          if(updatedData.innings[0].first_bat){
            if(updatedData.innings[0].batted_team_id === updatedData?.outcome.winner){
              outcome = `${updatedData.innings[0].batting_team} won by ${updatedData?.outcome?.by?.runs} Runs`;
            }else{
              outcome = `${updatedData.innings[1].batting_team} won by ${updatedData?.outcome?.by?.wickets} Wicket`; 
            }
        }else {
          if(updatedData.innings[1].batted_team_id === updatedData?.outcome.winner){
            outcome = `${updatedData.innings[1].batting_team} won by ${updatedData?.outcome?.by?.runs} Runs`;
          }else{
            outcome = `${updatedData.innings[0].batting_team} won by ${updatedData?.outcome?.by?.wickets} Wicket`; 
          }
        }
      }
      } else if (
        (Number(first_bat_inning.runs_scored) <
          Number(second_bat_inning.runs_scored)) ||
        (scoreFunctions.getApproxOvers(second_bat_inning.overs_played) ===
          Number(updatedData.match_settings.no_of_overs)) ||
        (Number(second_bat_inning.wickets_lost) ===
          Number(second_bat_team.players.length - 1))
      ) {
        outcome = scoreFunctions.getOutCome1(updatedData);
      } else if (
        updatedData?.innings &&
        updatedData?.innings[0].first_bat &&
        updatedData?.innings[1].batsmen.length > 0
      ) {
        outcome = `${updatedData?.innings[1].batting_team} need ${
          Number(updatedData.innings[0].runs_scored) -
          Number(updatedData.innings[1].runs_scored) +
          1
        } runs in ${
          scoreFunctions.getBallFromOver(
            updatedData.match_settings.no_of_overs
          ) -
          scoreFunctions.getBallFromOver(updatedData.innings[1].overs_played)
        } ball to Win`;
      } else if (
        updatedData?.innings &&
        updatedData?.innings[1].first_bat &&
        updatedData?.innings[0].batsmen.length > 0
      ) {
        outcome = `${updatedData?.innings[0].batting_team} need ${
          Number(updatedData.innings[1].runs_scored) -
          Number(updatedData.innings[0].runs_scored) +
          1
        } runs in ${
          scoreFunctions.getBallFromOver(
            updatedData.match_settings.no_of_overs
          ) -
          scoreFunctions.getBallFromOver(updatedData.innings[0].overs_played)
        } ball to Win`;
      } else if (updatedData.toss.won_by === updatedData.team1.team_id) {
        outcome = `${updatedData.team1.team_name} won the Toss and elected to ${
          (updatedData?.toss.choose === "BAT" && "Bat") || "Ball"
        } first`;
      } else {
        outcome = `${updatedData.team2.team_name} won the Toss and elected to ${
          (updatedData?.toss.choose === "BAT" && "Bat") || "Ball"
        } first`;
      }
    } else {
      outcome = "Not Yet Started";
    }
    return outcome;
  }


};
