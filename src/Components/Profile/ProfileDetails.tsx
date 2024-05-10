'use client'
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

interface IAppProps {
  profileData: any;
  getProfileData: () => void;
}

const ProfileDetails: React.FC<IAppProps> = ({ profileData,getProfileData }: IAppProps) => {
  const [editProfileModal, setEditProfileModal] = useState<boolean>(false)
  const [changePasswordModal,setChangePasswordModal] = useState<boolean>(false)
  return (
    <div className="col-md-9" data-aos="zoom-in-right">
      <div className="profile-box personal-details">
        <h6 className="text-start w-100 mb-2 ">Personal details</h6>
        <div className="profile-box w-100 justify-content-between align-items-start flex-row">
          <table className="w-75">
            <tbody>
            <tr>
              <td className="pb-1">Name</td>
              <td>:</td>
              <td>{profileData?.name}</td>
            </tr>
            <tr>
              <td className="pb-1">Username</td>
              <td>:</td>
              <td>{profileData?.username}</td>
            </tr>
            <tr>
              <td className="pb-1">Phone</td>
              <td>:</td>
              <td>{profileData?.mobile || "-"}</td>
            </tr>
            <tr>
              <td className="pb-1">Address</td>
              <td>:</td>
              <td>{profileData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-1">City</td>
              <td>:</td>
              <td>{profileData?.city || "-"}</td>
            </tr>
            <tr>
              <td className="pb-1">State</td>
              <td>:</td>
              <td>{profileData?.state || "-"}</td>
            </tr>
            <tr>
              <td className="pb-1">Country</td>
              <td>:</td>
              <td>{profileData?.country || "-"}</td>
            </tr>
              </tbody>
          </table>
          <div>
            <FaEdit className="cursor-pointer" onClick={()=> setEditProfileModal(true)} />
          </div>
        </div>
        <h6 className="text-start w-100 mb-2 mt-4">Email address</h6>
        <div className="profile-box w-100 justify-content-between align-items-start flex-row">
          <table className="w-75">
          <tbody>
            <tr>
              <td>Email</td>
              <td>:</td>
              <td>{profileData?.email}</td>
            </tr>
            </tbody>
          </table>
          {/* <div>
            <FaEdit />
          </div> */}
        </div>
        <h6 className="text-start w-100 mb-2 mt-4">Security</h6>
        <div className="profile-box w-100 justify-content-between align-items-start flex-row">
          <table className="w-75">
            <tbody>
            <tr>
              <td>Password</td>
              <td>:</td>
              <td>xxxxxxxxxxx</td>
            </tr>
            </tbody>
          </table>
          <div>
            <FaEdit className="cursor-pointer" onClick={()=> setChangePasswordModal(true)} />
          </div>
        </div>
      </div>
      {editProfileModal && 
        <EditProfile 
          editProfileModal={editProfileModal} 
          setEditProfileModal={setEditProfileModal} 
          profileData={profileData}
          getProfileData={getProfileData}
          />
      }
      {changePasswordModal && 
        <ChangePassword 
          changePasswordModal={changePasswordModal} 
          setChangePasswordModal={setChangePasswordModal} 
          profileData={profileData}
          />
      }
    </div>
  );
};

export default ProfileDetails;
