"use client";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import OTP from "./Auth/OTP";
import ForgetPassword from "./Auth/ForgetPassword";
import ChangePassword from "./Auth/ChangePassword";
import MainSidebar from "./User/Navigation/MainSidebar";
import MainHeader from "./User/Navigation/MainHeader";

export interface IAppProps {}

export default function App({ children }: any) {
  const sideBarRef : any = useRef(null)
  const sideBarBottonRef : any = useRef(null)
  const [minimizeSidebar,setMinimizeSidebar] = useState(false)

  useEffect(() => {
    
    const handleClick = (e: MouseEvent) => {
      if(typeof window!==undefined){
        if(sideBarRef.current && sideBarRef.current.contains(e.target as Node) || 
        sideBarBottonRef.current && sideBarBottonRef.current.contains(e.target as Node)) {
        } else if(window.innerWidth<600){
          setMinimizeSidebar(true)
        }
      }
    };
    window.addEventListener("click", handleClick, { passive: true });

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [sideBarRef]);
  

  return (
    <>
      <Head>
        <title>Sports Cloud</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`navigation-container ${minimizeSidebar && 'minimize'}`}>
        <MainSidebar minimizeSidebar={minimizeSidebar} setMinimizeSidebar={setMinimizeSidebar} sideBarRef={sideBarRef} />
        <MainHeader  minimizeSidebar={minimizeSidebar} setMinimizeSidebar={setMinimizeSidebar} sideBarBottonRef={sideBarBottonRef} />
        <div className="auth-layout-in">
        {children}
        </div>
        <div id="wrapper">
          <div className="scrollbar" id="style-8">
            <div className="force-overflow"></div>
          </div>
        </div>
        <Register />
        <Login />
        <OTP />
        <ForgetPassword />
        <ChangePassword />
      </main>
    </>
  );
}

