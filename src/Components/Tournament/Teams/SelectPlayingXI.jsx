import styled from "@emotion/styled";
import {Avatar,Button,Container} from "@mui/material";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { PatchPlayingXI, getPlayingXIList } from "@/customApi/tournament";

const SelectPlayingXI = ({ setAddTeam, teamId, state }) => {
  const [data, setData] = useState([]);
  const [arr, setArr] = useState([]);
  const [search, setSearch] = useState("");

  const imagePath = process.env.NEXT_PUBLIC_IMAGE_URL;

  const handleCheck = (id, e) => {
    let newarr = [...arr];
    if (e.target.checked) {
      if (newarr.length < state.min_players) {
        newarr.push(id);
        setArr(newarr);
      }
    } else {
      let newarr = arr.filter((item) => item !== id);
      setArr(newarr);
    }
  };

  const handleChecked = (pid) => {
    // console.log(arr,'arrrrrrrrr')
    let ischecked = false;

    if (arr.includes(pid)) {
      ischecked = true;
    }
    return ischecked;
  };

  const getDetail = async (search) => {
    let params = { id: teamId };
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

  const handleSubmit = async () => {
    const obj = {
      player_id: arr,
      team_id: teamId,
    };

    if (arr.length < state?.min_players) {
      toast.error(`Please Select Minimum ${state?.min_players}`);
    } else {
      await PatchPlayingXI(obj).then((res) => {
        getDetail();
        setAddTeam("Team");
        toast.success(res.data.message);
      });
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
      <Container>
          <div className="add-players-button d-flex justify-content-between align-items-end mb-3">
            {/* <div> */}
              <h3 className="m-2 h2-chart">
                Team Players
                {/* Select Playing {state?.min_players} ({state?.max_players},{" "}
                {arr.length}) */}
              </h3>
            {/* </div> */}
            {/* <div>
              <TextField
                fullWidth
                id="outlined-basic"
                type="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch />
                    </InputAdornment>
                  ),
                }}
                placeholder={`Search Players`}
                variant="outlined"
                onChange={(e) => getDetail(e.target.value)}
                size="small"
              />
            </div> */}
          </div>

          <div className="row">
            {data?.players &&
              data.players.length > 0 &&
              data.players.map((item, index) => {
                return (
                  <div className="col-4" key={index}>
                    <div style={{background: 'white', boxShadow:' rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'}}
                      className="p-3 rounded  mb-4"
                    >
                      <div className="d-flex align-items-center">
                        <div>

                        {
                          item.image && 
                  <Avatar
              alt=""
              src={imagePath+item?.image}
              sx={{ width: 60, height: 60, margin: "0 auto" }}
            />
            ||
            <Avatar
        alt=""
        src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
        sx={{ width: 50, height: 50, }}
      />
                        }

                          {/* <img src={dummyprofile} style={{ width: "60px" }} /> */}
                        </div>
                        <div className="ms-3 mb-0 h-100 d-flex flex-column justify-content-center ">
                          <h6 className="m-0" style={{fontSize:'14px'}} >
                            {item?.name}  {`(${item?.phone_number}) `} 
                            {/* <span className="fs-6 text-secondary">{` (${item?.phone_number})`}</span> */}
                          </h6>
                          <h6 className="m-0" style={{fontSize:'14px'}}>
                            {data?.team_name || ""}
                          </h6>
                        </div>
                      </div>
                      <div>
                        {/* <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={(e) => handleCheck(item.player_id, e)}
                                style={{ color: "#000000" }}
                                checked={handleChecked(item.player_id)}
                              />
                            }
                            size="small"
                          />
                        </FormGroup> */}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="d-flex justify-content-center align-items-center gap-3">
            <Button
              style={{
                display: "block",
                backgroundColor: "#222B42",
                color: " white",
              }}
              className="bg-dark text-white d-block w-25  ps-5 pe-5"
              onClick={() => setAddTeam("Team")}
            >
              Back
            </Button>

            {/* <Button
              style={{
                display: "block",
                backgroundColor: "#222B42",
                color: " white",
              }}
              type="button"
              className="bg-dark text-white w-25 d-block ps-5 pe-5"
              onClick={handleSubmit}
            >
              Save
            </Button> */}
          </div>
      </Container>
  );
};

export default SelectPlayingXI;
