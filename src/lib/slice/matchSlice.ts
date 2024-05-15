import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchState {
  "venue": string,
	"team1": {
		"team_id": string,
		"team_name": string,
		"team_logo": string,
		"players": any
	},
	"team2": {
		"team_id": string,
		"team_name": string,
		"team_logo": string,
		"players": any
	},

	"match_settings": {
		"match_type": string,
		"ball_type": string,
		"no_of_overs": number,
		"power_play": number,
		"over_per_bowler": number,
		"city": string,
		"ground": string,
		"date": string
	},
	"toss": {
		"won_by": string,
		"choose": string
	},
	"striker": {
		"players_id": string,
		"players_name": string
	},
	"non_striker": {
		"players_id": string,
		"players_name": string
	},
	"bowler": {
		"players_id": string,
		"players_name": string
	}
}

const initialState: MatchState = {
  "venue": "Indore",
	"team1": {
		"team_id": "",
		"team_name": "",
		"team_logo": "",
		"players": []
	},
	"team2": {
		"team_id": "",
		"team_name": "",
		"team_logo": "",
		"players": []
	},

	"match_settings": {
		"match_type": "",
		"ball_type": "",
		"no_of_overs": 0,
		"power_play": 0,
		"over_per_bowler": 0,
		"city": "Indore",
		"ground": "Indore",
		"date": ""
	},
	"toss": {
		"won_by": "",
		"choose": ""
	},
	"striker": {
		"players_id": "",
		"players_name": ""
	},
	"non_striker": {
		"players_id": "",
		"players_name": ""
	},
	"bowler": {
		"players_id": "",
		"players_name": ""
	}
};

export const matchSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    venue: (state, action) => {
        return {
    ...state,
    venue: action.payload
  }
    },
match_id: (state, action) => {
        return {
    ...state,
    match_id: action.payload
  }
    },
    team1: (state, action) => {
        return {
    ...state,
    team1: action.payload
  }
    },
    team2: (state, action) => {
        return {
    ...state,
    team2: action.payload
  }
    },
    match_settings: (state, action) => {
        return {
    ...state,
    match_settings: action.payload
  }
    },
    toss: (state, action) => {
        return {
    ...state,
    toss: action.payload
  }
    },
    striker: (state, action) => {
        return {
    ...state,
    striker: action.payload
  }
    },
    non_striker: (state, action) => {
        return {
    ...state,
    non_striker: action.payload
  }
    },
    bowler: (state, action) => {
        return {
    ...state,
    bowler: action.payload
  }
    },
batting: (state, action) => {
  return {
    ...state,
    batting: action.payload
  }
},
bowling: (state, action) => {
  return {
    ...state,
    bowling: action.payload
  }
},
resetMatch: () => {
        return initialState
    }

}
});

export const {
  venue, match_id, team1, team2, match_settings, toss, striker, non_striker, bowler, batting, bowling,resetMatch 
} = matchSlice.actions;

export default matchSlice.reducer;
