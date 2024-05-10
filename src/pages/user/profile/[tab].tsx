"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface IAppProps {}

export default function Profile(props: IAppProps) {
  return (  
    <div>Profile</div>
  );
}

Profile.auth = { userType: "USER" };
