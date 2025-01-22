import * as React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

export default function Filter({ open, handleClose, handleApplyFilter, handleResetFilter }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleReset = async () => {
    setIsLoading(true);
    setStartDate("");
    setEndDate("");
    await handleResetFilter();
    setIsLoading(false);
    handleClose(); // Close modal after operation
  };

  const handleApply = async () => {
    setIsLoading(true);
    await handleApplyFilter({ startDate, endDate });
    setIsLoading(false);
    handleClose(); // Close modal after operation
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          width: "450px",
          height: "400px",
        },
      }}
    >
      <div className="rounded-t-[10px] bg-[#383D41] text-[#D1D7E0]">
        <DialogTitle>Filter Options</DialogTitle>
      </div>

      <div className="p-4" style={{ flex: 1 }}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="start-date-picker" style={{ display: "block", marginBottom: "5px", color: "#383D41" }}>
            Start Date:
          </label>
          <input
            type="date"
            id="start-date-picker"
            value={startDate}
            onChange={handleStartDateChange}
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

        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="end-date-picker" style={{ display: "block", marginBottom: "5px", color: "#383D41" }}>
            End Date:
          </label>
          <input
            type="date"
            id="end-date-picker"
            value={endDate}
            onChange={handleEndDateChange}
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
      </div>

      <DialogActions>
        <Button onClick={handleClose} sx={{ color: "#383D41" }} disabled={isLoading}>
          Close
        </Button>
        <Button onClick={handleReset} sx={{ color: "#383D41" }} disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset'}
        </Button>
        <Button onClick={handleApply} sx={{ color: "#383D41" }} disabled={isLoading}>
          {isLoading ? 'Applying...' : 'Apply'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
