import React, { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Schedule from "@/Components/Tournament/Fixtures/Schedule";
import AddSchedule from "@/Components/Tournament/Fixtures/AddSchedule";

const Fixtures = ({data}) => {
  const [state, setState] = useState(true);

  const setSchedule = () => {
    setState(true);
  };

  const setaddSchedule = () => {
    setState(false);
  };
  return (
    <>
     
        <TableContainer component={Paper} className="p-4">
          <div className="d-flex justify-content-between pb-5 ">
            <div>
              <div style={{ color: "black" }}>
                <h2 className="mt-1 h2-chart">{data?.tournament_name} Schedule</h2>
              </div>
            </div>
            <div style={{ backgroundColor: "#ECECEC", borderRadius: 50 }}>
              <button
                onClick={setSchedule}
                style={{
                  backgroundColor: state ? "#222B42" : "",
                  color: state ? "#FFFFFF" : "#222B42",
                  borderRadius: 50,
                  border: "none",
                }}
                className="p-2 ps-4 pe-4"
              >
                Schedule
              </button>
              <button
                onClick={setaddSchedule}
                style={{
                  backgroundColor: !state ? "#222B42" : "",
                  color: state ? "#222B42" : "#FFFFFF",
                  borderRadius: 50,
                  border: "none",
                }}
                className="p-2 ps-4 pe-4"
              >
                Add Schedule
              </button>
            </div>
          </div> 

          {
            state === true ? <Schedule  /> : <AddSchedule tournament={data}/>
          }
        </TableContainer>
     
        
      
    </>
  );
};

export default Fixtures;
