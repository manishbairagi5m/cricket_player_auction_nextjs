import { getTeamList,registerTeamTournament } from "@/customApi/user";
import { Avatar, Button, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { BiCheckboxChecked } from "react-icons/bi";
import { toast } from "react-toastify";


interface IMyNetworkTeamApp {
  setNetworkTeamsModal: any;
  getDetail: any;
  team: any;
}

export default function MyNetworkTeam({
  getDetail,setNetworkTeamsModal,team
}: IMyNetworkTeamApp) {
  const [myTeams, setMyTeams] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selTeam, setSelTeam] = useState<string[]>([]);
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const router = useRouter();

  const getData = async () => {
    setLoader(true)
    await getTeamList().then((res: any) => {
      if (res.status) {
        setLoader(false)
        setMyTeams(res.data);
        let registeredTeams = team.map((itm:any)=> itm.team_id)
        let selTeamCopy = JSON.parse(JSON.stringify(selTeam))
        for (let i = 0; i < res.data.length; i++) {
          if(registeredTeams.includes(res.data[i]._id)){
            selTeamCopy.push(res.data[i]._id)
          }          
        }
        setSelTeam(selTeamCopy)
      }else{
        setLoader(false)
      }
    }).catch((err)=> {
      setLoader(false)
    })
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSelectTeam = (item:any) => {
    let selTeamCopy = JSON.parse(JSON.stringify(selTeam))
    let findTeam = selTeamCopy.find((itm:any)=> itm===item._id)
    if(findTeam){
      let findAlreadyRegistered = team.find((itm:any)=> itm.team_id===item._id)
      if(findAlreadyRegistered) toast.error(`${findAlreadyRegistered.team_name} Already Registered`)
        else selTeamCopy = selTeamCopy.filter((itm:any)=> itm!==item._id)
    }else{
      selTeamCopy.push(item._id)
    }
    setSelTeam(selTeamCopy)
  }

  const handleSubmit = async () => {
    setLoader(true)
    for (let i = 0; i < selTeam.length; i++) {
      let findAlreadyRegistered = team.find((itm:any)=> itm.team_id===selTeam[i])
      if(!findAlreadyRegistered){
        let params = { team_id : selTeam[i], tournament_id : router.query.id }
        await registerTeamTournament(params).then((res:any)=> {
          if(res?.status && i===(selTeam.length-1)){
            setNetworkTeamsModal(false)
            getDetail()
            setLoader(false)
          }else{
            let teamName : any = myTeams.find((itm:any)=> itm._id===selTeam[i])
            if(res.message==="Already registered"){
              toast.error(teamName.team_name + " " +res.message)
            }else{
              toast.error(res.message)
            }
            setLoader(false)
          }
        }).catch((err)=> {
          console.log(err,'err')
        })
      }
    }
  }


  return (
    <div className="p-3">
      <Grid container spacing={3} className="mt-2">
        {myTeams &&
          Array.isArray(myTeams) &&
          myTeams.length &&
          myTeams.map((item: any, i: number) => (
            <Grid
              item
              lg={3}
              md={6}
              sm={12}
              xs={12}
              className="text-center"
              key={i}
            >
              <div className="p-3 position-relative rounded" style={{border:`${selTeam.includes(item._id) ? '2px solid #191966' : '2px solid lightgrey'}`}}
              onClick={()=> handleSelectTeam(item)}
              >
                {selTeam.includes(item._id) && 
                  <div className="position-absolute start-0 top-0"> <BiCheckboxChecked className="fs-4 primary-color" /> </div>
                }
                {(item.team_logo && (
                  <Avatar
                    alt="img"
                    src={IMAGEURL + item?.team_logo}
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                  />
                )) || (
                  <Avatar
                    alt="img"
                    src="https://png.pngtree.com/png-clipart/20221128/ourlarge/pngtree-cricket-logo-png-image_6485594.png"
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                  />
                )}
                <div className="mt-3">{item?.team_name}</div>
              </div>
            </Grid>
          ))
          || 
          <div className="d-flex justify-content-center align-items-center w-100" style={{height:"100px"}}>
            {(loader && <Spinner />) || 
            <div>No team found</div>
          }
          </div>
          }

        <Grid item lg={12} md={6} sm={12} xs={12} className="text-center">
          {myTeams && Array.isArray(myTeams) && myTeams.length>0 && 
            <Button
              className="w-25"
              variant="contained"
              type="submit"
              sx={{ mt: 3 }}
              style={{ backgroundColor: "#222B42", color: "white" }}
              onClick={() => !loader && handleSubmit()}
            >
              {(loader && <Spinner size="sm" />) || "Save"}
            </Button>
          }
        </Grid>
      </Grid>
    </div>
  );
}
