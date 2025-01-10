import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function DeleteDialog({ open, handleClose, handleDelete }) {
  const [loading, setLoading] = React.useState(false);

  const handleDeleteAndClose = async () => {
    setLoading(true);
    await handleDelete();
    setLoading(false);
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
          <Button onClick={handleClose} sx={{ color: "#383D41" }} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAndClose} id="delete" sx={{ color: "#383D41" }} autoFocus disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
