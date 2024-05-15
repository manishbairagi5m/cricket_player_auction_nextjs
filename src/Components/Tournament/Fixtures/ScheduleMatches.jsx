import React,{useState,useEffect} from 'react'
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import League from          "@/Components/Tournament/Fixtures/addshceduletab/League";
import PreQF from           "@/Components/Tournament/Fixtures/addshceduletab/PreQF";
import QF from              "@/Components/Tournament/Fixtures/addshceduletab/QF";
import SemiFinal from       "@/Components/Tournament/Fixtures/addshceduletab/SemiFinal";
import PreLeague from       "@/Components/Tournament/Fixtures/addshceduletab/PreLeague";
import Final from           "@/Components/Tournament/Fixtures/addshceduletab/Final";
import SuperLeague from     "@/Components/Tournament/Fixtures/addshceduletab/SuperLeague";


import { Container } from "react-bootstrap";
import { getTournamentGround } from '@/customApi/tournament';
import { useRouter } from 'next/router';

const ScheduleMatches = ({tournamentData,tab,team}) => {
    const [value, setValue] = useState("League");
    const [grounds, setGrounds] = useState([])
    const [newTab, setNewTab] = useState([])
    const router = useRouter()
    const handlevalueChange = (event, newValue) => {
        setValue(newValue);
      };

      const getTournamentGrounds = async () => {
        const params = { tournament_id :router.query.id}
        await getTournamentGround(params).then((res)=> {
          if(res?.status){
            setGrounds(res.data)
          }
        })
      }
      
      useEffect(() => {
        getTournamentGrounds()
      }, [])

      useEffect(() => {
        let arr = Object.values(tab).filter((item) => item.length > 0)
        setNewTab(arr)
      }, [tab])

    
  
  return (
    <div className="subtitle-text row">
    {/* {tab.length > 0 && ( */}
    <TabContext value={value} className="subtitle-text ">
      <div className="d-flex justify-content-left">
        <Box>
          <TabList
            onChange={handlevalueChange}
            aria-label="lab API tabs example"
            sx={{
              "& .MuiTab-root": {
              fontFamily:"Inter-SemiBold"
            },
            ".Mui-selected": {
              color: `#171717 !important`,
              },
          }}
          >
            <Tab label="League" value="League" />

            {newTab && newTab.length > 0 && newTab.map((item, index) => {
              return <Tab key={index} label={item} value={item} />;
            })}
          </TabList>
        </Box>
      </div>
      <Container sx={{ mt: 3 }}>
        <TabPanel value="League"> 
          <League tournamentData={tournamentData} team={team} grounds={grounds}/>
        </TabPanel>

        <TabPanel value="Pre League">
          <PreLeague tournamentData={tournamentData} team={team} grounds={grounds} />
        </TabPanel>

        <TabPanel value="Super League">
          <SuperLeague tournamentData={tournamentData} team={team} grounds={grounds} />
        </TabPanel>

        <TabPanel value="Pre QF">
          <PreQF tournamentData={tournamentData} team={team} grounds={grounds} />
        </TabPanel>

        <TabPanel value="QF">
          <QF tournamentData={tournamentData} team={team} grounds={grounds}/>
        </TabPanel>

        <TabPanel value="Semi Final">
          <SemiFinal tournamentData={tournamentData} team={team} grounds={grounds}/>
        </TabPanel>

        <TabPanel value="Final">
          <Final tournamentData={tournamentData} team={team} grounds={grounds}/>
        </TabPanel>
      </Container>
      {/* )} */}
    </TabContext>
    {/* )} */}
  </div>
  )
}

export default ScheduleMatches