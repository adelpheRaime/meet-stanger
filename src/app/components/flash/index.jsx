import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useStates } from "from-react-context"
export default function Flash({ children, state, severity }) {
  const [open, setOpen] = useStates(state)
  return (
    <>
      {open && <Box sx={{ width: '100%' }} m={2}>
        <Alert
          severity={severity}
          onClose={() => setOpen(false)}
        >
          {children}
        </Alert>

      </Box>}
    </>
  );
}
