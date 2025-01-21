import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

export default function Filter({ open, handleClose, handleApplyFilter, handleResetFilter }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleReset = async () => {
    setIsLoading(true); // Start loading when resetting
    await handleResetFilter(); // Trigger the reset filter logic
    setIsLoading(false); // Stop loading after resetting
  };

  const handleApply = async () => {
    setIsLoading(true); // Start loading when applying filter
    await handleApplyFilter(selectedDate); // Pass selectedDate to parent for applying filter
    setIsLoading(false); // Stop loading after applying filter
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          width: "450px",
          height: "350px",
        },
      }}
    >
      <div className="rounded-t-[10px] bg-[#383D41] text-[#D1D7E0]">
        <DialogTitle>Filter Options</DialogTitle>
      </div>

      <div className="p-4" style={{ flex: 1 }}>
        <input
          type="date"
          id="custom-date-picker"
          value={selectedDate}
          onChange={handleDateChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
            cursor: "pointer"
          }}
        />
      </div>

      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#383D41" }}>
          Close
        </Button>
        <Button onClick={handleReset} sx={{ color: "#383D41" }} disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset'}
        </Button>
        <Button
          onClick={handleApply}
          sx={{ color: "#383D41" }}
          disabled={isLoading}
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
