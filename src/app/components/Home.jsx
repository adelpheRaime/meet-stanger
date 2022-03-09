import React, { lazy, Suspense } from 'react';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Helmet } from 'react-helmet';
const Logo = lazy(() => import("../Logo"))
// ***********************************************************
//  simple HomePage for our app
//  if the user is logged-in change our homepage into inbox page
//  if not user stay here for signin or signup
//  you can see the root configuration
//
// ***********************************************************

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Meet-Stranger</title>
      </Helmet>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
              width: "100%",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center"
          }}
        >
            <Suspense fallback={<span></span>}>
                <Logo sx={{ m: 4 }} />
            </Suspense>
            <Typography  variant="h3">
                Meet Stranger
            </Typography>
            <Typography sx={{width:"50%",textAlign:"center"}}  variant="h6">
                one way to connect people around the world for free
            </Typography>
            <Box display="flex" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="contained" component={RouterLink} to="/login" >Login</Button>
                <Typography sx={{m:3}} variant="body2">
                    or
                </Typography>
                <Button variant="contained" sx={{bgColor:"background.secondary"}} component={RouterLink} to="/register">Register</Button>
            </Box>
        </Box>
      </Container></>
  );
}

export default Home