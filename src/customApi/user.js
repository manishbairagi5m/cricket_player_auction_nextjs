import { _delete, _get, _post, _put, convertObjToQueryStr } from "./ApiMethods";

const INITIAL_URL = process.env.NEXT_PUBLIC_API_URL;


export const getTeamList = async () => {
  let url = INITIAL_URL + "/team/manage";
  const response = await _get(url);
  return response;
};
export const getMyMatchesList = async (params) => {
  let url = INITIAL_URL + "/user/my-matches";
  let str = convertObjToQueryStr(params)
  url = url + str
  const response = await _get(url);
  return response;
};

export const registerTeamTournament = async (data) => {
  const url = INITIAL_URL + "/tournament/register";
  const response = await _post(url, data);
  return response;
};

export const createTeam = async (data) =>{
	const url = INITIAL_URL + "/team/manage"
	const response = await _post(url, data)
	return response
}

export const editTeam = async (id,data) => {
  const url = INITIAL_URL + `/team/manage/${id}`;
  const response = await _put(url, data);
  return response;
};
