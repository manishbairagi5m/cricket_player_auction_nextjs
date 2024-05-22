import axios from "axios"
// import axiosInstance from "../axios"
import { getSession } from "next-auth/react"
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export const _getToken = async () => {
    // if (typeof window !== "undefined") {
    //     return window.localStorage.getItem('accessToken')
    // }
    try {
        const session = await getSession();
        if (session) {
          return session.user.token;
        } else {
          return "";
        }
      } catch (error) {
        return "";
      }
  }

  
  export const _get = async(url) =>{
    const token = await _getToken()
    return await axios.get(url,{headers:{'Authorization' :`${token}`,"ngrok-skip-browser-warning": "69420"}}).then((res)=>{
        return res?.data
    }).catch((err)=>{
        return err.response?.data
    })
}

export const _post = async(url,data={}) =>{
    const token = await _getToken()
    return await axios.post(url,data , {headers:{"Authorization": `${token}`}}).then((res)=>{
        return res?.data
    }).catch((err)=>{
        return err.response?.data
    })
}
export const _put = async(url,data={}) =>{
    const token = await _getToken()
    return await axios.put(url,data , {headers:{"Authorization": `${token}`}}).then((res)=>{
        return res?.data
    }).catch((err)=>{
    
        return err.response?.data
    })
}
export const _delete = async(url) =>{
    const token = await _getToken()
    return await axios.delete(url,{headers:{"Authorization": `${token}`}}).then((res)=>{
        return res.data
    }).catch((err)=>{
        return err.response?.data
    })
}

export const convertObjToQueryStr = (params) => {
    const objStr = "?" + Object.keys(params).map(key => {
      return `${key}=${encodeURIComponent(params[key])}`
    }).join('&')
    return objStr
  }
  
  
