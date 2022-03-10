import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose"
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
export default function Dialogs({ children, open, setOpen, ModalTitle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const resize=()=>{
    let isResize=false
    if(isMobile){
      window.visualViewport.addEventListener("resize",()=>{
        isResize=true
      })
    }
    return isResize
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen={isMobile}
        open={open}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': {overflowY:"auto",minWidth:resize()?"100vh":'auto', height:isMobile?"90vh":'85vh' } }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {ModalTitle}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            {children}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

