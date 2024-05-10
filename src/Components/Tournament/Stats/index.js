import React ,{ useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Bat from "@/Components/Tournament/Stats/Bat";
import { Ball } from "@/Components/Tournament/Stats/Ball";
import Field from "@/Components/Tournament/Stats/Field";
import Mvp from "@/Components/Tournament/Stats/Mvp";
import Overall from "@/Components/Tournament/Stats/Overall";
import { Container } from "@mui/material";


const Leaderboard = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div className="subtitle-text">
    <div className="my-card">
      <TabContext className="subtitle-text" value={value}>
        <Container>
        <Box>
          <TabList  onChange={handleChange} 
            TabIndicatorProps={{
              sx: {
                border:'1px solid black',
              },
            }}
           sx={{
            "& .MuiTab-root": {
            fontFamily:"Inter-SemiBold"
          },
          ".Mui-selected": {
            color: `#171717 !important`,
            },
        }}
          >
            <Tab label="Overall" value="1" />
            <Tab label="Bat" value="2" />
            <Tab label="Ball" value="3" />
            <Tab label="Field" value="4" />
            <Tab label="Mvp" value="5" />
          </TabList>
        </Box>

          <TabPanel value="1"><Overall /></TabPanel>
          <TabPanel value="2"><Bat /></TabPanel>
          <TabPanel value="3"><Ball /></TabPanel>
          <TabPanel value="4"><Field/></TabPanel>
          <TabPanel value="5"><Mvp/></TabPanel>
        </Container>
      </TabContext>
      </div>
      </div>  
  
  );
};

export default Leaderboard;

