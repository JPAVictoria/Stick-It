"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export default function Modal({ open, handleClose, setNewNote, handleSave, note, isEdit, resetError }) {
  const [showError, setShowError] = useState({ title: false, description: false });

  const handleChange = (e) => {
    setNewNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setShowError((prevError) => ({
      ...prevError,
      [e.target.name]: e.target.value === '' // Show error only if field is empty
    }));
  };

  const handleSubmit = () => {
    if (!note.title || !note.description) {
      setShowError({ title: !note.title, description: !note.description }); // Show specific errors
      return;
    }
    handleSave();
  };

  return (
    <Dialog open={open} onClose={() => { handleClose();}} sx={{ "& .MuiDialog-paper": { borderRadius: "10px" } }}>
      <div className="rounded-t-[10px] bg-[#383D41] text-[#D1D7E0]">
        <DialogTitle>{isEdit ? 'Update a Note' : 'Paste a Note'}</DialogTitle>
      </div>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Note Title"
          fullWidth
          variant="outlined"
          name="title"
          value={note.title}
          onChange={handleChange}
          error={showError.title}
          helperText={showError.title ? 'Title is required' : ''}
        />
        <TextField
          margin="dense"
          label="Note Content"
          fullWidth
          multiline
          rows={5}
          variant="outlined"
          name="description"
          value={note.description}
          onChange={handleChange}
          error={showError.description}
          helperText={showError.description ? 'Description is required' : ''}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={() => { handleClose(); resetError(); }} sx={{ color: "#383D41" }}>Cancel</Button>
        <Button id="save" onClick={handleSubmit} sx={{ color: "#383D41" }}>
          {isEdit ? 'Update' : 'Paste'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
