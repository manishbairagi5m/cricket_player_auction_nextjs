"use client";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "next/image";
import { IoIosMenu } from "react-icons/io";
import { signOut } from "next-auth/react";
import { FaAngleDown, FaUser } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export interface IAppProps {
  minimizeSidebar: Boolean;
  setMinimizeSidebar: any;
  sideBarBottonRef: any;
}

const StypeBtn: any = {
  background: "none",
  border: "0",
  padding: "0",
  display:'flex'
};

export default function MainHeader({
  minimizeSidebar,
  setMinimizeSidebar,
  sideBarBottonRef,
}: IAppProps) {
  const router = useRouter();

  const handleLogOut = () => {
    signOut({ redirect: false, callbackUrl: "/" });
  };

  return (
    <div className="header-box">
      <nav
        className="d-flex align-items-center justify-content-between ps-3 pe-5"
        style={{ height: "70px" }}
      >
        <span ref={sideBarBottonRef}>
          <IoIosMenu
            className="fs-2 cursor-pointer"
            onClick={() => setMinimizeSidebar(!minimizeSidebar)}
          />
        </span>

        <Dropdown className="navbar-dropdown">
          <Dropdown.Toggle color="transparent" style={StypeBtn}>
            <span className="navbar-icons" style={{ padding: "7px 9px" }}>
              <div className="d-flex align-items-end">
                <Image
                  src="/Assets/Images/user1.jpg"
                  width={45}
                  height={45}
                  alt="img"
                  className="rounded-circle"
                />
                <p className="ms-2 text-start">
                  <span className="fs-14 text-secondary lh-1">User</span> <br />{" "}
                  Deepak
                </p>
                <FaAngleDown className="ms-1 mb-1" />
              </div>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ right: 0, left: "unset" }}>
            <Dropdown.Item
              className="border-bottom"
              onClick={() => router.push("/user/profile/profile-dashboard")}
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogOut}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>
    </div>
  );
}
