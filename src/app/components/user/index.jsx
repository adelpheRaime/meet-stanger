import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserList from './UserList';
import { Helmet } from 'react-helmet';
const User = () => {

  return (
    <div>
      <Helmet>
        <title>Meet-Stranger | Members</title>
      </Helmet>
      <Box display="flex">
        <UserList />
      </Box>
    </div>

  )
}
export default User