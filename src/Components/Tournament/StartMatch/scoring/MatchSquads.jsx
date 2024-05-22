import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Grid
} from "@mui/material";
import { swapBatsman } from "@/customApi/tournament";
import { PiUserSwitchDuotone } from 'react-icons/pi';
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const MatchSquads = ({runningMatchData,setRunningMatchData,getCurrentMatchData,team,team_A_Players,team_B_Players}) => {
  const [teamASel,setTeamASel] = useState({add_id:null,remove_id:null,add_player_name:null,remove_player_name:null})
  const [teamBSel,setTeamBSel] = useState({add_id:null,remove_id:null,add_player_name:null,remove_player_name:null})
  const [swapModal,setSwapModal] = useState({modal:false,data:null})
  const imagePath = process.env.REACT_APP_IMG_URL;
  const matchState = useSelector(state => state.match)

  let team1Data = team.find((item1) => item1.team_id === runningMatchData.team1.team_id)
  let team2Data = team.find((item1) => item1.team_id === runningMatchData.team2.team_id)

  let team1Playing11 = runningMatchData.team1.players.map((item) => item.players_name)
  let team2Playing11 = runningMatchData.team2.players.map((item) => item.players_name)
  let team1Rest = team_A_Players.filter((item) => {return (!team1Playing11.includes(item.name) && item)})
  let team2Rest = team_B_Players.filter((item) => {return (!team2Playing11.includes(item.name) && item)})

  const getPLayerImage = (playerid,selteam) => {
    let team = selteam === 'team1' ? team_A_Players : team_B_Players
    let playerimg = team.find((item) => item._id === playerid && item?.image)
    if(playerimg){
      return imagePath + playerimg.image
    }else{
      return "/Assets/Images/Admin-login-img.png"
    }
  }

  const handleTeam = (teamSel,setTeamSel,e,id,name=null,label=null) => {
    if(checkAlreadyPlaying(id)){
      toast.warning("Cannot change playing batsman/bowler")
    }else{
    if(e.target.checked){
      let obj = {...teamSel,[e.target.name]:id}
      if(name && label){
        obj[label] = name
      }
      setTeamSel(obj)
      if(obj.add_id && obj.remove_id){
        setSwapModal({modal:true,data:obj})
      }
    }else{
      let obj = {...teamSel,[e.target.name]:null}
      if(name){
        obj.add_player_name = null
      }
      setTeamSel(obj)
    }
  }
  }

  const handleClose = () => {
    setTeamASel({add_id:null,remove_id:null,add_player_name:null})
    setTeamBSel({add_id:null,remove_id:null,add_player_name:null})
    setSwapModal({modal:false,data:null})
  }

  const handleChangePlayers = async () => {
    let params = {...swapModal.data,id:runningMatchData._id}
    delete params.remove_player_name
    await swapBatsman(params).then((res)=> {
      if(res.status){
        toast.success(res.message)
        getCurrentMatchData(res.data)
        handleClose()
      }
    }).catch((err)=> {
      toast.error(err.message)
    })
  }

  const checkAlreadyPlaying = (playerid) => {
    return (
         playerid === matchState.striker.players_id 
      || playerid === matchState.non_striker.players_id 
      || playerid === matchState.bowler.players_id)
  }


  return (
    <div>
      {/* team name header */}
      <div
        className="d-flex justify-content-between p-2"
        style={{ backgroundColor: "#222B42", color: "#FFFFFF" }}
      >
        <div className="d-flex justify-content-between ms-2">
          <div>
            {team1Data.team_logo ?
            <img
              style={{ width: 25, height: 25, borderRadius: "50%" }}
              src={imagePath + team1Data.team_logo}
              alt=""
            /> :
            <img
            src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
            style={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              // objectFit: "cover",
            }}
          /> 
            }
          </div>
          <div className="ps-2" style={{ fontSize: 16 }}>
          {team1Data.team_name}
          </div>
        </div>
        <div className="d-flex justify-content-between me-2">
          <div className="pe-2" style={{ fontSize: 16 }}>
          {team2Data.team_name}
          </div>
          <div>
          {team2Data.team_logo ?
            <img
              style={{ width: 25, height: 25, borderRadius: "50%" }}
              src={imagePath + team2Data.team_logo}
              alt=""
            />:
            <img
            src='https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png'
            style={{
              width: 25,
              height: 25,
              borderRadius: "50%",
            }}
          /> 
            }
          </div>
        </div>
      </div>


      <Grid container >
      <Grid item lg={12} md={6} sm={6} xs={6} className="ps-3">
      <div className="d-flex justify-content-center mt-3 mb-2">Playing 11</div>
      <hr className="border border-dark" />
      </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="ps-3">
      {runningMatchData.team1.players?.map((item, index) => {
        return ( <>
          <div key={index} className="d-flex align-items-center">
              <Checkbox name="remove_id" checked={teamASel.remove_id === item.players_id} style={{ color: "black" }}
              onChange={(e)=> handleTeam(teamASel,setTeamASel,e,item.players_id,item.players_name,"remove_player_name")} />
                <div>
                  <img
                    style={{ width: 42, height: 42, borderRadius: "50%" }}
                    src={getPLayerImage(item.players_id,"team1")}
                    alt=""
                  />
                </div>
                <div className="ms-2">
                  <div className="mt-1 fs-6">
                    {item?.players_name}
                  </div>
                  <div className="text-secondary fs-6">
                    Batter
                  </div>
                </div>
          </div>
            <hr className="border border-dark"/> </>
        );
      })}
    </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="pe-3">
      {runningMatchData.team2.players?.map((item, index) => {
        return ( <>
          <div key={index} className="d-flex align-items-center justify-content-end">
                <div className="me-2 text-end">
                  <div className="mt-1 fs-6">
                    {item?.players_name}
                  </div>
                  <div className="text-secondary fs-6">
                    Batter
                  </div>
                </div>
                <div>
                  <img
                    style={{ width: 42, height: 42, borderRadius: "50%" }}
                    src={getPLayerImage(item.players_id,"team1")}
                    alt=""
                  />
                </div>
              <Checkbox name="remove_id" checked={teamBSel.remove_id === item.players_id} style={{ color: "black" }}
               onChange={(e)=> handleTeam(teamBSel,setTeamBSel,e,item.players_id,item.players_name,"remove_player_name")} />
          </div>
            <hr className="border border-dark" /> </>
        );
      })}
    </Grid>
    <Grid item lg={12} md={6} sm={6} xs={6} className="ps-3">
      <div className="d-flex justify-content-center mt-3 mb-2">Bench</div>
      <hr className="border border-dark" />
      </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="ps-3">
      {team1Rest?.map((item, index) => {
        return ( <>
          <div key={index} className="d-flex align-items-center">
          <Checkbox name="add_id" checked={teamASel.add_id === item._id} style={{ color: "black" }}
          onChange={(e)=> handleTeam(teamASel,setTeamASel,e,item._id,item.name,"add_player_name")} />
                <div>
                  <img
                    style={{ width: 42, height: 42, borderRadius: "50%" }}
                    src={item?.image && item.image || loginImg}
                    alt=""
                  />
                </div>
                <div className="ms-2">
                  <div className="mt-1 fs-6">
                    {item?.name}
                  </div>
                  <div className="text-secondary fs-6">
                    Batter
                  </div>
                </div>
          </div>
            <hr className="border border-dark"/> </>
        );
      })}
    </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6} className="pe-3">
      {team2Rest?.map((item, index) => {
        return ( <>
          <div key={index} className="d-flex align-items-center justify-content-end">
                <div className="me-2 text-end">
                  <div className="mt-1 fs-6">
                    {item?.name}
                  </div>
                  <div className="text-secondary fs-6">
                    Batter
                  </div>
                </div>
                <div>
                  <img
                    style={{ width: 42, height: 42, borderRadius: "50%" }}
                    src={item?.image && item.image || loginImg}
                    alt=""
                  />
                </div>
              <Checkbox name="add_id" checked={teamBSel.add_id === item._id} style={{ color: "black" }}
               onChange={(e)=> handleTeam(teamBSel,setTeamBSel,e,item._id,item.name,"add_player_name")} />
          </div>
            <hr className="border border-dark" /> </>
        );
      })}
    </Grid>
    </Grid>
    <Dialog
          open={swapModal.modal}
          onClose={() => handleClose()}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "450px", 
              },
            },
          }}
        >
          <DialogTitle className="border border-bottom text-center">
            Switch Batsman
          </DialogTitle>
          <DialogContent className="text-center" style={{padding:'0'}} >
            <div className="d-flex justify-content-center align-items-center flex-column p-4">
              <h5 className="mt-2">{swapModal?.data?.remove_player_name}</h5>
              <PiUserSwitchDuotone className="display-2"/>
              <h5 className="mb-2">{swapModal?.data?.add_player_name}</h5>
            </div>
          </DialogContent>
          <DialogActions className="m-0 p-0">
          <div className="w-100 d-flex">
              <Button
                size="large"
                onClick={() => handleClose()}
                className="w-100 rounded-0 text-dark bglightgrey "
                sx={{
                  ":hover": {
                    bgcolor: "#DADADA",
                    color: "black",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                size="large"
                className="w-100 rounded-0 text-white mainbgadmin "
                onClick={() => handleChangePlayers()}
                sx={{
                  ":hover": {
                    bgcolor: "#222B42",
                    color: "white",
                  },
                }}
              >
                Confirm Change
              </Button>
            </div>            
          </DialogActions>
        </Dialog>

    </div>
  );
};

export default MatchSquads;
