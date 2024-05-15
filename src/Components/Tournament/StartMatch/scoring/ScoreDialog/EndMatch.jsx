import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { endOfMatch } from "@/customApi/tournament";
import { scoreFunctions } from "@/Components/Tournament/StartMatch/scoring/scoreFunctions";
import Image from "next/image";

function EndMatch(props) {
  const {
    onClose,
    open,
    matchid,
    setMatchValue,
    runningMatchData,
    batting,
    checkIsInningCompleted,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const endMatch = () => {
    let finalReq = { id: matchid };
    try {
      if (runningMatchData?.outcome) {
        onClose();
        setMatchValue("today_match");
      } else {
        endOfMatch(finalReq).then((res) => {
          if (res?.status) {
            onClose();
            setMatchValue("today_match");
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle className="border border-bottom text-center fw-bold">
        End Match
      </DialogTitle>
      <DialogContent>
        <div className="p-4 d-flex justify-content-center align-items-center position-relative">
          {checkIsInningCompleted(runningMatchData) ? (
            <div className="w-100">
              <div className="p-2 text-center">End of the Match</div>
              <div className="p-2 text-success text-center">
                {scoreFunctions.getOutCome(runningMatchData)}
              </div>
              <div className="p-2 text-center">
              <Image
                src="/Assets/Images/winner_image.svg"
                alt='img' 
                width={60}
                height={60}
                className="w-100 h-100"
                style={{ objectFit: "contain" }}
            />
              </div>
            </div>
          ) : (
            <div className="w-100">
            <div className="p-2 text-center">Are You Sure You Want to End Match ?</div>
            <div className="p-2 text-success text-center">
              {scoreFunctions.getOutCome1(runningMatchData)}
            </div>
            <div className="p-2 text-center">
            <Image
                src="/Assets/Images/winner_image.svg"
                alt='img' 
                width={60}
                height={60}
                className="w-100 h-100"
                style={{ objectFit: "contain" }}
            />
            </div>
          </div>
          )}
        </div>
      </DialogContent>
      <DialogActions className="m-0 p-0">
        <div className="w-100 d-flex">
          <Button
            onClick={() => handleClose()}
            size="large"
            className="w-100 rounded-0 text-dark bglightgrey fw-bold"
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
            className="w-100 rounded-0 text-white mainbgadmin fw-bold"
            sx={{
              ":hover": {
                bgcolor: "#222B42",
                color: "white",
              },
            }}
            onClick={() => endMatch()}
          >
            Confirm
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default EndMatch;
