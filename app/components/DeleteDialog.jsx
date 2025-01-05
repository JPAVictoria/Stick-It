import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function DeleteDialog({ open, handleClose, handleDelete }) {
  const handleDeleteAndClose = () => {
    handleDelete();
    handleClose(); // Close the dialog after delete
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            width: "400px",
            height: "250px",
          },
        }}
      >
        <div className="rounded-t-[10px] bg-[#383D41] text-[#D1D7E0]">
          <DialogTitle id="alert-dialog-title">Delete a Note</DialogTitle>
        </div>

        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ color: "#383D41" }} className='pt-10'>
            Do you want to delete this note?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{ color: "#383D41" }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAndClose} id="delete" sx={{ color: "#383D41" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
