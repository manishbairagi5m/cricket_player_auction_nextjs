import { helper } from "@/Helper";
import { getToolTip } from "@/customApi/tournament";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { FaLocationDot, FaPeopleGroup } from "react-icons/fa6";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

export interface ITournamentCardProps {
  data: any;
  handleClickOpen: any;
}

export default function TournamentCard({ data,handleClickOpen }: ITournamentCardProps) {
  const [toolTip, setToolTip] = useState<any>({});
  const router = useRouter();
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;

  const handleToolTip = async (id: string) => {
    let params = { tournament_id: id };
    await getToolTip(params).then((res) => {
      setToolTip(res);
    });
  };

  const imageLoader = (img: string, defaultimg: string) => {
    return img ? `${IMAGEURL}${img}` : `/Assets/Images/${defaultimg}`;
  };

  return (
    <div className="tournament-card">
      <div className="tournament-card-firsthalf"
        onClick={() => router.push(`/user/tournament/detail/${data._id}?tab=about`)}>
        <Image
          src="/Assets/Images/tournament-banner.jpg"
          loader={() =>
            imageLoader(data.tournament_banner, "tournament-banner.jpg")
          }
          width={400}
          height={250}
          alt="img"
          className="tournament-card-bgimage"
        />
        <Image
          loader={() =>
            imageLoader(data.tournament_logo, "pexels-photo-674010.jpeg")
          }
          src="/Assets/Images/pexels-photo-674010.jpeg"
          width={100}
          height={100}
          alt="img"
          className="tournament-card-logo"
        />
        <div className="tournament-card-status" content={data?.status}>
          {data?.status}
        </div>
      </div>
      <div className="tournament-card-secondhalf">
        <div onClick={() => router.push(`/user/tournament/detail/${data._id}?tab=about`)}>
        <p className="text-end">
          {data?.match_overs && `${data.match_overs} overs`}
          <Image
            src={`/Assets/Images/${data.ball_type.toLowerCase()}.png`}
            width={50}
            height={50}
            alt="img"
            className="tournament-card-ball"
          />
          {data?.ground_type}
        </p>
        <h5>{data?.tournament_name}</h5>
        <p className="mb-3 mt-1">
          {" "}
          <FaLocationDot className="fs-5" />
          {data?.city && data?.state && data?.country && `${data.city}, ${data.state}, ${data.country}`}
        </p>
        <div className="tournament-card-data">
          {" "}
          <FaCalendarAlt className="fs-5" /> From -{" "}
          {(data?.from_date && helper.toDateFormat(data.from_date)) || ""}
        </div>
        <div className="tournament-card-data">
          {" "}
          <FaCalendarAlt className="fs-5" /> To -{" "}
          {(data?.to_date && helper.toDateFormat(data.to_date)) || ""}
        </div>
        <div className="tournament-card-data">
          {" "}
          <FaPeopleGroup className="fs-5" /> Teams
          {/* {data?.team_registered || "0"} */}
          <Tooltip
            onMouseOver={() => handleToolTip(data?._id)}
            style={{ color: "#222b42" }}
            title={
              <table>
                <tr>
                  <td>Total Teams</td>
                  <td className="ps-1 pe-1">-</td>
                  <td className="text-end"> {toolTip?.no_of_team || 0}</td>
                </tr>
                <tr>
                  <td>Teams Registered</td>
                  <td className="ps-1 pe-1">-</td>
                  <td className="text-end">{toolTip?.team_registered || 0}</td>
                </tr>
                <tr>
                  <td>Remaining</td>
                  <td className="ps-1 pe-1">-</td>
                  <td className="text-end">{toolTip?.remaining || 0}</td>
                </tr>
              </table>
            }
          >
            <IconButton>
                <RiErrorWarningFill className="ms-1 text-warning fs-5" />
            </IconButton>
          </Tooltip>
        </div>
        </div>
        <div className="tournament-card-buttons">
          <div>
            <MdModeEdit onClick={()=> router.push(`/user/tournament/update/${data._id}`)} />
          </div>
          <div className="mb-2" onClick={()=> {handleClickOpen(data._id);}}>
            <MdDelete className="text-danger" />
          </div>
        </div>
      </div>
    </div>
  );
}
