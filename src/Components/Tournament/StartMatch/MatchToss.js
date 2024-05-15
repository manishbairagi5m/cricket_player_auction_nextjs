import { Button } from "@mui/material";
import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { addMatchSetting } from "@/customApi/tournament";
import { useSelector,useDispatch } from "react-redux";
import {  toss } from '@/lib/slice/matchSlice';
import Image from "next/image";


const MatchToss = ({
  setMatchValue,
  setStartMatchData,
  startMatchData,
  setBatBallTeam

}) => {
  const [tossData, setTossData] = useState({
    won_by: "",
    choose: "",
  });
  const statedata = useSelector(state => state.match)
  const dispatch = useDispatch()
  const imagePath = process.env.REACT_APP_IMG_URL;
  const colBorder = { border: "3px solid #222b42" };

  const handleSubmit = async () => {
    if (tossData.won_by.length > 0 && tossData.choose.length > 0) {
      // setStartMatchData({...startMatchData, toss: tossData ,fixture_id: matchData._id})
            setMatchValue("match_opening");
            dispatch(toss({ ...statedata.toss, ...tossData }))
            setBatBallTeam(tossData)


            

      // let params = { ...startMatchData, toss: tossData ,fixture_id: matchData._id };
      // await addMatchSetting(params)
      //   .then((res) => {
      //     if (res?.status) {
      //       setStartMatchData({ ...startMatchData, toss: tossData });
      //       toast.success(res.message);
      //     }
      //   })
      //   .catch((err) => {
      //     toast.error(err.message);
      //   });

    }
  };

  return (
    <div>
      <div>
        <SimpleCard>
          <div className="mb-4">Who Team Won The Toss?</div>
          <div className="mt-3 mb-2">
            <div className="d-flex ">
              <div
                style={{ width: 160, padding: 0 }}
                onClick={() =>
                  setTossData({ ...tossData, won_by: statedata.team1.team_id })
                }
              >
                <div
                  className="text-center toss-box"
                  style={
                    (tossData.won_by === statedata.team1.team_id && colBorder) || {}
                  }
                >
                  <div
                    className="d-flex justify-content-center"
                    style={{ paddingTop: 0 }}
                  >
                    <img
                      className="team-logo"
                      src={imagePath + statedata.team1.team_logo}
                      alt=""
                    />
                  </div>
                  <h6
                    className="mt-3 mb-4 text-center"
                    style={{ fontSize: 14 }}
                  >
                    {statedata.team1.team_name}
                  </h6>
                </div>
              </div>
              <div
                className="ms-5"
                style={{ width: 160 }}
                onClick={() =>
                  setTossData({ ...tossData, won_by: statedata.team2.team_id })
                }
              >
                <div
                  className="text-center toss-box"
                  style={
                    (tossData.won_by === statedata.team2.team_id && colBorder) || {}
                  }
                >
                  <div className="d-flex justify-content-center">
                    <img
                      className="team-logo"
                      src={imagePath + statedata.team2.team_logo}
                      alt=""
                    />
                  </div>
                  <h6
                    className="mt-3 mb-4 text-center"
                    style={{ fontSize: 14 }}
                  >
                    {statedata.team2.team_name}
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 mb-4">Winner Of The Toss Elected To?</div>
          <div className="mt-3">
            <div className="d-flex ">
              <div
                style={{ width: 160 }}
                onClick={() => setTossData({ ...tossData, choose: "BAT" })}
              >
                <div
                  className="text-center toss-box"
                  style={(tossData.choose === "BAT" && colBorder) || {}}
                >
                  <div className="d-flex justify-content-center">
                    <Image
                      src="/Assets/Images/batsman.png"
                      width={200}
                      height={200}
                      alt="img"
                    />
                  </div>
                  <h6 className="text-center" style={{ fontSize: 14 }}>
                    BAT FIRST
                  </h6>
                </div>
              </div>
              <div
                className="ms-5"
                style={{ width: 160 }}
                onClick={() => setTossData({ ...tossData, choose: "BALL" })}
              >
                <div
                  className="text-center toss-box"
                  style={(tossData.choose === "BALL" && colBorder) || {}}
                >
                  <div className="d-flex justify-content-center">
                    <Image
                      src="/Assets/Images/bowler.png"
                      width={200}
                      height={200}
                      alt="img"
                    />
                  </div>
                  <h6 className="text-center" style={{ fontSize: 14 }}>
                    BOWL FIRST
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="ps-4">
            <Button
              style={{
                paddingLeft: 131,
                paddingRight: 131,
                borderRadius: 65,
                marginTop: 40,
                backgroundColor: "#222B42",
              }}
              variant="contained"
              className="text-white"
              onClick={() => handleSubmit()}
            >
              Let’s Play
            </Button>
          </div>
        </SimpleCard>
      </div>
    </div>
  );
};

export default MatchToss;
