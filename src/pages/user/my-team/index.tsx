'use client'
import CustomModal from "@/Components/Modals/CustomModal";
import { getTeamList } from "@/customApi/user";
import { Container, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import EditTeam from "@/Components/User/EditTeam"
import CreateTeam from "@/Components/User/CreateTeam"
import { FaEdit } from "react-icons/fa";
import { Spinner } from "react-bootstrap";


export interface IMyTeamProps {}

export default function MyTeam(props: IMyTeamProps) {
  const router = useRouter()
  const [edit, setEdit] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [loader, setLoader] = useState(false);
  const IMAGEURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [teams,setTeams] = useState<any>([])

  const getData = async () => {
    setLoader(true)
    await getTeamList().then((res:any)=> {
      if(res?.status){
        setLoader(false)
        setTeams(res.data)
      }else{
        setLoader(false)
      }
    }).catch((err)=> {
      setLoader(false)
    })
  }

  useEffect(() => {
    getData()
  }, [])

  const imageLoader = (img: string) => {
    return img ? `${IMAGEURL}${img}` : `/Assets/Images/teams.png`;
  };  

  return (
      <Container className="pt-4">
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item lg={10} md={3} sm={12} xs={12}>
            <h4>My Team</h4>
          </Grid>
          <Grid item lg={2} md={3} sm={12} xs={12}>
          <button
              className="main-button-blue w-100"
              onClick={() => setAddModal(true)}
            >
              Create
            </button>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2,mt: 0 }}>
        {teams && Array.isArray(teams) && teams.length>0 && teams.map((item:any,i:number)=> (
          <Grid item lg={3} md={3} sm={12} xs={12} key={i}>
              <div className='auction-team'>
                <div className="position-absolute top-0 end-0 fs-4"> 
                  <FaEdit className="m-3" onClick={()=> {setEdit(true);setTeamId(item._id)}} /> 
                </div>
                <Image
                onClick={()=> router.push(`/user/my-team/team-detail/${item._id}`)}
                  src="/Assets/Images/teams.png"
                  loader={()=> imageLoader(item.team_logo)}
                  width={130}
                  height={130}
                  alt='team'
                />
                <h6 onClick={()=> router.push(`/user/my-team/team-detail/${item._id}`)}>{item.team_name}</h6>
                <p>Captain</p>
                <div>{item?.captain_name}</div>
                <div className='auction-team-bottom'>
                  <div>
                    <p>Total Players</p>
                    <div>{item?.players && item.players.length}</div>
                  </div>
                  <div>
                    <p>Matches Won</p>
                    <div>{item?.matchWon || 0}</div>
                  </div>
                </div>


              </div>
          </Grid>
        )) ||
        <div className="w-100 d-flex justify-content-center align-items-center" style={{height:"200px"}}>
          {loader 
            ? <Spinner />
            : "Data not available"
          }
        </div>
        }
      </Grid>

      <CustomModal header="Edit Team" onClose={()=> setEdit(false)} open={edit} maxWidth="md" >
          <EditTeam teamId={teamId} setAdd={setEdit} getDetail={getData} />
        </CustomModal>
      <CustomModal header="Create Team" onClose={()=> setAddModal(false)} open={addModal} maxWidth="md" >
          <CreateTeam setAdd={setAddModal} getDetail={getData} />
        </CustomModal>
      </Container>
  );
}

MyTeam.auth = { userType: "USER" };
