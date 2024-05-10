'use client'
import { helper } from '@/Helper';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface ProfileProps {
  profileDashboard:any;
}

const ProfileDashboard:React.FC<ProfileProps> = ({profileDashboard}:ProfileProps) => {
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL
  const router = useRouter()

  const imageLoader = (img:string) => {
      return (img
      ? `${IMAGEURL}${img}`
      : '/Assets/Images/live-ring.png')
  }

    let myActivity = [
        { img: "doller-balloon", amt: profileDashboard?.card?.activeBids || "0", label: "Active Auction" },
        { img: "number1", amt: profileDashboard?.card?.wonItems || "0", label: "Items Won" },
        { img: "star", amt: profileDashboard?.card?.favAuction || "0", label: "Favorites" },
      ];

    const handleSelect = (item:any) => {
      router.push(`/auction-details/${item?.auction_id || item._id}`)
    }

  return (
    <div className="col-sm-12 col-md-9" data-aos="zoom-in-right">
          <div className="profile-box">
            <h5 className="text-start w-100">My Activity</h5>
            <hr className="w-100" />
            <div className="row w-100 mt-2">
              {myActivity.map((item, i) => (
                <div className="col-md-4 mb-2 ps-0 " key={i}>
                  <div className="profile-box w-100 flex-row justify-content-start">
                    <Image
                      src={`/Assets/Images/${item.img}.png`}
                      width={90}
                      height={80}
                      alt="img"
                    />
                    <div className="ms-2">
                      <h4 className="text-primary">{item.amt}</h4>
                      <p className="fs-14">{item.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="profile-box py-3 mt-4 overflow-auto align-items-start">
            <table className="profile-table">
              <thead>
                <tr>
                  <td style={{width:"40%"}} colSpan={2}>Item Name</td>
                  <td>Bid price</td>
                  <td>Highest bid</td>
                  <td>Lowest bid</td>
                  <td>Expiry</td>
                </tr>
              </thead>
              <tbody>
                {profileDashboard?.data && Array.isArray(profileDashboard.data) && 
               profileDashboard.data.length>0 && profileDashboard.data.map((item:any,index:number)=> (
                <tr key={index}>
                  <td className='cursor-pointer' onClick={()=> handleSelect(item)}>
                    <Image 
                      loader={()=> imageLoader(item.images)}
                      src="/Assets/Images/earing.png" 
                      className='me-2 rounded' width={50} height={40} alt="img" /> 
                    </td>
                  <td className='text-start cursor-pointer' onClick={()=> handleSelect(item)} >{item.item_name}</td>
                  <td>{item.intial_bid}</td>
                  <td>{item.highest_bid}</td>
                  <td>{item.lowest_bid}</td>
                  <td style={{whiteSpace:"nowrap"}}>{helper.toDateFormat(item.end_date)}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  );
}

export default ProfileDashboard