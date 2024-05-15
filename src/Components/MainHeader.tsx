"use client";
import { useDispatch } from "react-redux";
import { FaRegUser } from "react-icons/fa";
import Image from "next/image";
import { setLoginModal } from "@/lib/slice/modalsSlice";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export interface IAppProps {}

export default function MainHeader(props: IAppProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session, "session");

  return (
    <div className="header-box" style={{ position: "fixed" }}>
      <div className="container">
        <nav className="row">
          <div className="col-3">
            <Image
              src="/Assets/Images/main_logo.png"
              width={150}
              height={70}
              alt="img"
            />
          </div>
          <div className="header-center col-6">
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="header-right col-3">
            {session?.user ? (
              <>
              <button className="main-button" onClick={() => router.push("/user/")}>Dashboard</button>
              {/* <button className="main-button" onClick={() => signOut({ redirect: false, callbackUrl: "/" })}>Logout</button> */}
              </>
            ) : (
              <>
                <button
                  className="button-with-icon-shadow"
                  onClick={() => dispatch(setLoginModal(true))}
                >
                  <FaRegUser />
                  Login
                </button>
                <button className="main-button">Get Started</button>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
