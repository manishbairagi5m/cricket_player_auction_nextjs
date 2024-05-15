import { _delete, _get, _post, _put, convertObjToQueryStr } from "./ApiMethods";

const INITIAL_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUTCWorldTime = async () => {
  await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    return data
  })
  .catch(error => {
    console.error('Error fetching UTC time:', error);
  });
};

export const getProfile = async () => {
  let url = INITIAL_URL + "/bidder/view_profile";
  const response = await _get(url);
  return response;
};

export const userLogin = async (data) => {
  const url = INITIAL_URL + "/user/register";
  const response = await _post(url, data);
  return response;
};

export const userRegister = async (data) => {
  const url = INITIAL_URL + "/bidder/register";
  const response = await _post(url, data);
  return response;
};

export const verifyOtp = async (data) => {
  const url = INITIAL_URL + "/user/verify-otp";
  const response = await _post(url, data);
  return response;
};

export const resendOtp = async (data) => {
  const url = INITIAL_URL + "/user/resend-otp";
  const response = await _post(url, data);
  return response;
};

export const forgetPassword = async (data) => {
  const url = INITIAL_URL + "/bidder/forgot_passward";
  const response = await _post(url, data);
  return response;
};

export const updatePassword = async (data) => {
  const url = INITIAL_URL + "/bidder/update_password";
  const response = await _post(url, data);
  return response;
};
export const changePassword = async (data) => {
  const url = INITIAL_URL + "/bidder/change_password";
  const response = await _post(url, data);
  return response;
};

export const editProfile = async (id,data) => {
  const url = INITIAL_URL + `/bidder/update_profile/${id}`;
  const response = await _put(url, data);
  return response;
};

export const getPlaceID = async (data) => {
  let url = INITIAL_URL + "/bidder/google_place_id";
  if(data){
    let param = convertObjToQueryStr(data)
    url = url + param
  }
  const response = await _get(url,);
  return response;
};

export const getPlaceAddress = async (data) => {
  let url = INITIAL_URL + "/bidder/google_place";
  if(data){
    let param = convertObjToQueryStr(data)
    url = url + param
  }
  const response = await _get(url);
  return response;
};

export const getMyAlerts = async (data) => {
  let url = INITIAL_URL + "/bidder/alert_list";
  if(data){
    let param = convertObjToQueryStr(data)
    url = url + param
  }
  const response = await _get(url);
  return response;
};
