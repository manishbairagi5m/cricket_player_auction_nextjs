import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MatchState {
	runs: {
		totalRun: number,
		batsmanRun: number
	},
	overs: any,
	innings: {
		batted_team_id: string,
		batting_team: string,
		runs_scored: number,
		wickets_lost: number,
		overs_played: number,
        run_rate:number,
		batsmen: any,
		bowlers: any
	}
}

const initialState: MatchState = {
	runs: {
		totalRun: 0,
		batsmanRun: 0
	},
	overs: [],
	innings: {
		batted_team_id: '',
		batting_team: '',
		runs_scored: 0,
		wickets_lost: 0,
		overs_played: 0.0,
        run_rate:0,
		batsmen: [],
		bowlers: []
	}
};

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
	runs: (state, action) => {
		return {
			...state,
			runs: action.payload
		}
	},
	overs: (state, action) => {
		return {
			...state,
			overs: action.payload
		}
	},
	innings: (state, action) => {
		return {
			...state,
			innings: action.payload
		}
	},
	resetScore: () => {
		return initialState
	}


}
});

export const {
	runs, overs, innings, resetScore
} = scoreSlice.actions;

export default scoreSlice.reducer;
