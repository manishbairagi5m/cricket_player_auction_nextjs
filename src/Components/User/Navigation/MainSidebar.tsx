"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { GiLaurelsTrophy } from "react-icons/gi";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbCricket } from "react-icons/tb";
import { FaLayerGroup } from "react-icons/fa";
import { GiLion } from "react-icons/gi";
import { FaBuildingShield } from "react-icons/fa6";
import { FaRegHandshake } from "react-icons/fa6";
import { usePathname,useRouter } from "next/navigation";



export interface IAppProps {
  minimizeSidebar: Boolean;
  sideBarRef: any;
  setMinimizeSidebar: any;
}

export default function MainSidebar({ minimizeSidebar,setMinimizeSidebar,sideBarRef }: IAppProps) {
  const router = useRouter()
  const [currentPlate,setCurrentPlate] = useState(0)
  const pathname = usePathname()

  let menu = [
    {navigate:"/user",label:"Dashboard", icon:RxDashboard},
    {navigate:"/user/my-matches",label:"My Matches", icon:TbCricket},
    {navigate:"/user/my-team",label:"My Team", icon:GiLion},
    {navigate:"/user",label:"Players", icon:FaPeopleGroup},
    {navigate:"/user/tournament",label:"My Tournament", icon:GiLaurelsTrophy},
    {navigate:"/user/auction",label:"Auction", icon:RiAuctionLine},
    {navigate:"/user",label:"Sponsors", icon:FaRegHandshake},
    {navigate:"/user",label:"Franchise", icon:FaBuildingShield},
    {navigate:"/user",label:"Rules", icon:FaLayerGroup},
  ]

  const handleNavigate = (url:string,i:number) => {
    router.push(url)
    setCurrentPlate(i)
    if(typeof window!==undefined && window.innerWidth<600){
      setMinimizeSidebar(true)
    }
  }

  
  useEffect(() => {
    if(pathname){
      let tab = pathname.split("/")[2]
      let getIndex = menu.findIndex((item)=> item.navigate.split("/")[2]===tab)
      setCurrentPlate(getIndex)
    }
  }, [pathname])

  

  return (
    <div className={`sidebar-box ${minimizeSidebar && "minimize-sidebar"}`} ref={sideBarRef}>
      <div className={`sidebar-icon`}>
          <Image
            src="/Assets/Images/main_logo.png"
            width={150}
            height={70}
            alt="img"
          />
      </div>
        <ul>
          {menu.map((item:any,i:number)=> (
          <li key={i} onClick={()=> handleNavigate(item.navigate,i)}
          >
            <item.icon style={{fontSize:"20px",color:`${currentPlate>=0 && currentPlate===i ? "#191966" : 'black'}`}} />
            {minimizeSidebar ? "" : 
            <span
            style={{color:`${currentPlate===i ? "#191966" : 'black'}`}}
             className="ms-3 lh-1">{item.label}</span>
             } 
          </li>
          ))}
          {currentPlate>=0 &&
            <div className="current-plate" style={{top:`${currentPlate*46}px`}}><div></div></div>
          }
        </ul>
      
    </div>
  );
}
