"use client";

import { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";

const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}

export function SnackbarProvider({ children }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        TransitionComponent={(props) => <Slide {...props} direction="up" />}
        message={snackbarMessage}
        key={Slide.name}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        ContentProps={{
          style: {
            backgroundColor: snackbarSeverity === "success" ? "green" : "red",
            zIndex: 9999,
          },
        }}
      />
    </SnackbarContext.Provider>
  );
}
