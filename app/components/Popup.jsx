import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function Popup({ open, message, backgroundColor, handleClose }) {
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      message={message}
      key={SlideTransition.name}
      autoHideDuration={2000}
      ContentProps={{
        style: { backgroundColor },
      }}
    />
  );
}
