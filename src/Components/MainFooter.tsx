"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaCommentAlt,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram ,
  FaYoutube,
} from "react-icons/fa";

export interface IAppProps {}

export default function MainFooter(props: IAppProps) {
  const router = useRouter()

  const handleNavigate = (path:string) => {
    router.push(path)
  }

  return (
    <footer className="main-footer">
      <div className="container">
        <div className="row w-100">
          <div className="mb-3 col-md-3 col-sm-12" data-aos="fade-up" >
            <h5 onClick={()=> handleNavigate("/")}>
            <Image
              src="/Assets/Images/main-logo1.png"
              width={180}
              height={50}
              alt="img"
              priority
            />
            </h5>
            <span style={{ color: "#B0BCDE" }} className="fs-14">
              Lorem ipsum dolor sit amet, 
              consectetur adipiscing elit,
              sed do eiusmod tempor 
              incididunt ut labore et dolore{" "}
              magna aliqua.
            </span>
          </div>
          <div className="footer-box mb-3 col-md-3 col-sm-12" data-aos="fade-right" >
            <h5>Quick Links</h5>
            <p className="underline-style">My Account</p>
            <p className="underline-style">Privacy Policy</p>
            <p className="underline-style">Terms & Condition</p>
          </div>
          <div className="footer-box mb-3 col-md-3 col-sm-12" data-aos="fade-down" >
            <h5>Contact Us</h5>
            <p className="underline-style">
              <FaPhone className="me-1" /> +1 559 154 2587
            </p>
            <p className="underline-style">
              <FaCommentAlt className="me-1" /> info@gold-factory.com
            </p>
          </div>
          <div className="mb-5 col-md-3 col-sm-12" data-aos="fade-up">
            <h5>Follow Us</h5>
            <div className="footer-icons">
              <span className="footer-fb">
                <FaFacebookF />
              </span>
              <p className="underline-style">Facebook</p>
            </div>
            <div className="footer-icons">
              <span className="footer-twit">
                <FaTwitter />{" "}
              </span>{" "}
              <p className="underline-style">Twitter</p>
            </div>
            <div className="footer-icons">
              <span className="footer-insta">
                <FaInstagram  />
              </span>{" "}
              <p className="underline-style">Instagram</p>
            </div>
            <div className="footer-icons">
              <span className="footer-yt">
                <FaYoutube />{" "}
              </span>
              <p className="underline-style">Youtube</p>
            </div>
          </div>
          <div className="col-12 text-center pb-4" style={{marginTop:"50px"}}>
            Copyright © 2024 | Designed by Zeeweesoft
          </div>
        </div>
      </div>
    </footer>
  );
}
