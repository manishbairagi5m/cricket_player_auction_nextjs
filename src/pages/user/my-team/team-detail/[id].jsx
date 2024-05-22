import { Avatar, Button, Container, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getPlayingXIList } from "@/customApi/tournament";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

export default function TeamDetail() {
  const [data, setData] = useState([]);
  const [arr, setArr] = useState([]);
  const [search, setSearch] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const imagePath = process.env.NEXT_PUBLIC_IMAGE_URL;

  const getDetail = async (search) => {
    let params = { id: router.query.id };
    if (search) {
      params = { ...params, search: search };
      setSearch(params);
      console.log(params, "search");
    }

    await getPlayingXIList(params).then((res) => {
      setData(res?.data[0]);
      let newarr = [];
      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i].is_selected) {
          newarr.push(res.data[i].player_id);
        }
      }
      setArr(newarr);
    });
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <Container>
      <Grid container spacing={2} sx={{ mb: 2,mt: 2 }}>
        <Grid item lg={9} md={3} sm={12} xs={12} className="d-flex align-items-center">
          <button className="main-button-blue" onClick={() => router.push("/user/my-team")}>
            Back
          </button>
          <h3 className="m-2">Team Players</h3>
        </Grid>
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <button
            className="main-button-blue w-100"
            onClick={() => setAddModal(true)}
          >
            Invite Player via QR Code
          </button>
        </Grid>
      </Grid>

      <div className="row">
        {(data?.players &&
          data.players.length > 0 &&
          data.players.map((item, index) => {
            return (
              <div className="col-4" key={index}>
                <div
                  style={{
                    background: "white",
                    boxShadow: " rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  }}
                  className="p-3 rounded  mb-4"
                >
                  <div className="d-flex align-items-center">
                    <div>
                      {(item.image && (
                        <Avatar
                          alt=""
                          src={imagePath + item?.image}
                          sx={{ width: 60, height: 60, margin: "0 auto" }}
                        />
                      )) || (
                        <Avatar
                          alt=""
                          src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
                          sx={{ width: 50, height: 50 }}
                        />
                      )}

                      {/* <img src={dummyprofile} style={{ width: "60px" }} /> */}
                    </div>
                    <div className="ms-3 mb-0 h-100 d-flex flex-column justify-content-center ">
                      <h6 className="m-0" style={{ fontSize: "14px" }}>
                        {item?.name} {`(${item?.phone_number}) `}
                        {/* <span className="fs-6 text-secondary">{` (${item?.phone_number})`}</span> */}
                      </h6>
                      <h6 className="m-0" style={{ fontSize: "14px" }}>
                        {data?.team_name || ""}
                      </h6>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            );
          })) || (
          <div
            className="d-flex justify-content-center align-items-center w-100"
            style={{ height: "200px" }}
          >
            {loader ? <Spinner /> : "Data Not Available"}
          </div>
        )}
      </div>

    </Container>
  );
}

TeamDetail.auth = { userType: "USER" };
