import { _delete, _get, _post, _put, convertObjToQueryStr } from "./ApiMethods";

const INITIAL_URL = process.env.NEXT_PUBLIC_API_URL;

export const getTournamentList = async (data: any) => {
  let url = INITIAL_URL + "/admin/tournament-list";
  if (data) {
    let param = convertObjToQueryStr(data);
    url = url + param;
  }
  const response = await _get(url);
  return response;
};

export const createTournament = async (data: any) => {
  const url = INITIAL_URL + "/admin/create-tournament";
  const response = await _post(url, data);
  return response;
};

export const editTournament = async (id: any, data: any) => {
  const url = INITIAL_URL + `/admin/tournament-update/${id}`;
  const response = await _put(url, data);
  return response;
};

export const getToolTip = async (data: any) => {
  let url = INITIAL_URL + "/admin/tool-tip-tournament";
  if (data) {
    let param = convertObjToQueryStr(data);
    url = url + param;
  }
  const response = await _get(url);
  return response;
};

export const getSingleTournamentAbout = async (id: any) => {
  let url = INITIAL_URL + "/admin/about/" + id;
  const response = await _get(url);
  return response;
};

export const getMatchList = async (params: any) => {
  let url = INITIAL_URL + "/fixture/match-list";
  let str = "";
  if (params) {
    str = convertObjToQueryStr(params);
  }
  url = url + str;
  const response = await _get(url);
  return response;
};

export const getFixtureTeamList = async (id: any) => {
  let url = INITIAL_URL + "/fixture/fixture-team-list/" + id;
  const response = await _get(url);
  return response;
};

export const getTeamList = async (data: any) => {
  let url = INITIAL_URL + "/team/team_tournament";
  let str = convertObjToQueryStr(data);
  url = url + str;
  const response = await _get(url);
  return response;
};

export const getMatchData = async (params: any) => {
  let url = INITIAL_URL + "match/getMatchDetails/";
  let str = convertObjToQueryStr(params);
  url = url + str;
  const response = await _get(url);
  return response;
};

export const swapBatsman = async (params: any) => {
  let url = INITIAL_URL + "/match/change_batsman";
  let str = convertObjToQueryStr(params);
  url = url + str;
  return await _put(url);
};

export const getTournamentGround = async (params: any) => {
  let url = INITIAL_URL + "/admin/turf-list-tournament";
  let str = convertObjToQueryStr(params);
  url = url + str;
  const response = await _get(url);
  return response;
};

export const createMatch = async (data: any) => {
  let url = INITIAL_URL + "match/save";
  const response = await _post(url, data);
  return response;
};
export const updateMatch = async (data: any) => {
  let url = INITIAL_URL + "match/update";
  return await _put(url, data);
};
export const wicket = async (data: any) => {
  let url = INITIAL_URL + "/match/wicket";
  return await _put(url, data);
};
export const updateRun = async (data: any) => {
  let url = INITIAL_URL + "/match/updateRun";
  return await _put(url, data);
};
export const addNextBatsman = async (data: any) => {
  let url = INITIAL_URL + "/match/nextBatsman";
  return await _put(url, data);
};
export const addNextBowler = async (data: any) => {
  let url = INITIAL_URL + "/match/nextBowler";
  return await _put(url, data);
};
export const changeInnings = async (data: any) => {
  let url = INITIAL_URL + "/match/changeInnings";
  return await _put(url, data);
};

export const endOfMatch = async (params: any) => {
  let url = INITIAL_URL + "/match/endOfMatch";
  let str = convertObjToQueryStr(params);
  url = url + str;
  return await _get(url);
};
export const undoData = async (params: any) => {
  let url = INITIAL_URL + "/match/undo";
  let str = convertObjToQueryStr(params);
  url = url + str;
  return await _put(url);
};

export const getScorerList = async (params: any) => {
  let url = INITIAL_URL + "/scorer/list";
  let str = params && convertObjToQueryStr(params);
  if (params) {
    url = url + str;
  }
  const response = await _get(url);
  return response;
};

export const getGroupWiseTeam = async (params: any) => {
  let url = INITIAL_URL + "/teamgroup/manage-group";
  let str = convertObjToQueryStr(params);
  url = url + str;
  const response = await _get(url);
  return response;
};

export const getTurfData = async (params: any) => {
  let url = INITIAL_URL +  "/spots/spot-details";
  let str = convertObjToQueryStr(params);
  url = url + str;
  const response = await _get(url);
  return response;
};


export const getTopBatsman = async(params:any) =>{
	let url = INITIAL_URL + "/admin/batting_leaderboard"
	let str = convertObjToQueryStr(params)
    url = url + str
	const response = await _get(url);
	return response
}

export const getTopBowler = async(params:any) =>{
	let url = INITIAL_URL + "/admin/bowler_leaderboard"
	let str = convertObjToQueryStr(params)
    url = url + str
	const response = await _get(url);
	return response
}

export const getTopMvp = async(params:any) =>{
	let url = INITIAL_URL + "/admin/mvp_leaderboard"
	let str = convertObjToQueryStr(params)
    url = url + str
	const response = await _get(url);
	return response
}

export const getTopFielder = async(params:any) =>{
	let url = INITIAL_URL + "/admin/field_leaderboard"
	let str = convertObjToQueryStr(params)
    url = url + str
	const response = await _get(url);
	return response
}

export const getOverAllStats = async(params:any) =>{
	let url = INITIAL_URL + "/admin/overall_stats"
	let str = convertObjToQueryStr(params)
    url = url + str
	const response = await _get(url);
	return response
}

export const AddTeamAdmin = async (data:any) =>{
	const url = INITIAL_URL + "/tournament/register"
	const response = await _post(url, data)
	return response
}

export const getPlayingXIList = async (params:any) => {
	let url =  INITIAL_URL +"/team/manage/"
	let str = convertObjToQueryStr(params)
	url = url + str
	const response = await _get(url)
	return response
  }
  
export const removePlayer = async (params:any) => {
	let url =  INITIAL_URL + "/team/player"
	let str = convertObjToQueryStr(params)
	url = url + str
	const response = await _delete(url)
	return response
}
export const addPlayer = async (params:any) => {
	let url = INITIAL_URL + "/team/player"
	const response = await _put(url,params)
	return response
}
export const updateTeam = async (id:any,params:any) => {
	let url = INITIAL_URL + "/team/manage/"+id
	const response = await _put(url,params)
	return response
}

export const fixTeamMatch = async (data:any) =>{
	const url = INITIAL_URL + "/fixture/fix-match"
	const response = await _post(url, data)
	return response
}

export const deleteTournament = async(id:any) =>{
	let url = INITIAL_URL + "/admin/tournament-delete" +"/"+ id
	const response = await _delete(url)
	return response
}
export const updateTournament = async (data:any , id:number) => {
	let url = INITIAL_URL + "/admin/tournament-update"+"/"+id
	const response = await _put(url,data)
	return response;
  };