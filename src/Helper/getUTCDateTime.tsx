'use client'
import Loader from "@/Components/Loader";
import { useEffect, useRef, useState } from "react";

export interface IAppProps {}

export let uTCCurrentDateTime = 0
export default function GetUTCDateTime() {
    const interval : any = useRef(null);
    const [loader, setLoader] = useState(false)

    const getTime = async () => {
        // setLoader(true)
        // addSuspence(false)
        await fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
        .then(response => response.json())
        .then(data => {
                // setLoader(false)
                // addSuspence(true)
                const date = new Date(data.utc_datetime).getTime()
                uTCCurrentDateTime = date
                return data
            })
            .catch(error => {
                // addSuspence(true)
                // setLoader(false)
                console.error('Error fetching UTC time:', error);
            });
    };


    useEffect(() => {
        interval.current = setInterval(() => {
            uTCCurrentDateTime += 1000
        },1000)
    }, []);
    
    useEffect(() => {
        getTime()
    }, []);
    
    const onFocus = (e:any) => {
        if(e?.target?.visibilityState && e.target.visibilityState==='visible'){
            getTime()
        }
    }

    useEffect(() => {
        window.document.addEventListener("visibilitychange", onFocus);
        return () => {
            window.document.removeEventListener("visibilitychange", onFocus);
        };
    },[])

    // const addSuspence = (show:boolean) => {
    //     if(typeof window!==undefined){
    //         let loadingMain : any = window.document.getElementById("loading-main")
    //         if(show){
    //             loadingMain.style.display = 'flex'
    //         }else{
    //             loadingMain.style.display = 'none'
    //         }
    //     }
    // }

    // if(loader){
    //     return <Loader />
    // }else{
        return <></>
    // }
}

export const getUTCDate = () => {
    return uTCCurrentDateTime
}