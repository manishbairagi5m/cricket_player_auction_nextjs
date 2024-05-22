export const batsManObj = () => {
    return {
        team_id:'',
        players_id: '',
        players_name: '',
        batting_order: 0,
        runs_scored: 0,
        balls_faced: 0,
        fours: 0,
        sixes: 0,
        strike_rate: 0,
        batting_time: { start_time: Date, ent_time: Date },
        wickets: {
            bowler: {},
            fielder: {},
            kind: ''
        }
    }
}
export const bowlerObj = () => {
    return {
        team_id: '',
        players_id: '',
        players_name: '',
        overs_bowled: 0,
        runs_conceded: 0,
        wickets_taken: 0,
        maiden: 0,
        economy_rate: 0
    }
}
export const inningObj = {
    batted_team_id: '',
    batting_team: '',
    runs_scored: 0,
    runs_rate: 0,
    wickets_lost: 0,
    overs_played: 0.0,
    first_bat: false,
    batsmen: [],
    bowlers: [],
    striker_id : null,
    non_striker_id : null,
    current_bowler_id : null,
}