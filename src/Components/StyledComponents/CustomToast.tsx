'use client'
import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { FaRegCheckCircle  } from "react-icons/fa";
import { RiErrorWarningFill   } from "react-icons/ri";
import { PiWarningFill  } from "react-icons/pi";

export interface IAppProps {
}

export default function CustomToast(props: IAppProps) {
    const colorSucess = {color:"#8900AE"}
    const colorError = {color:"red"}
    const colorWarning = {color:"#f1c40f"}
  return (
    <ToastContainer 
    closeOnClick 
    autoClose={5000}
    progressStyle={{backgroundColor:"#8900AE"}}
    icon= {(({type}) => {
      if(type==='success') return <FaRegCheckCircle  style={colorSucess} className="fs-5" />
      if(type==='error') return <RiErrorWarningFill    style={colorError} className="fs-4" />
      if(type==='warning') return <PiWarningFill     style={colorWarning} className="fs-3" />
    })}
    />
  );
}
