import { Dialog, DialogContent, DialogTitle, IconButton, Typography, styled } from "@mui/material";
import { ImCross } from "react-icons/im";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  
  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <ImCross />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }



export default function CustomModal({children,header,onClose,open,maxWidth}) {
    return (
        <BootstrapDialog
        className="booking_modal_close"
        fullWidth={true}
        maxWidth={maxWidth || "md"}
        open={open}
        aria-labelledby="customized-dialog-title"
      >
        <BootstrapDialogTitle
          style={{ padding: "16px 10px", fontSize: "18px" }}
          id="customized-dialog-title"
          onClose={() => onClose()}
        >
        {header}
        </BootstrapDialogTitle>
        <DialogContent dividers className="p-0">
          <Typography gutterBottom>
            {children}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    )
}