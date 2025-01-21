import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

export default function Filter({ open, handleClose, handleApplyFilter, handleResetFilter }) {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleReset = () => {
    setSelectedDate(""); // Reset the selected date state
    handleResetFilter(); // Trigger parent reset logic if needed
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
        <Button onClick={handleReset} sx={{ color: "#383D41" }}>
          Reset
        </Button>
        <Button
          onClick={() => handleApplyFilter(selectedDate)} // Pass selectedDate to parent
          sx={{ color: "#383D41" }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
