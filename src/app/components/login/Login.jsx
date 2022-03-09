import React, { lazy, Suspense } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useFetch from "../../useFetch"
import { useStates } from "from-react-context"
import { Helmet } from 'react-helmet';
import validationSchema from "./validationSchema"
import { io } from "socket.io-client"
import { Formik, Form } from "formik";
import useStyles from "./style"
import { socketUrl } from "../../baseUrl"
const Logo = lazy(() => import("../../Logo"))
const initialValues = {
  email: '',
  password: '',
}
// ***********************************************************
//  simple login with yup form client and express validator from server
//  the validation is from validationSchema.js
// ***********************************************************

const Login = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [, setUser] = useStates("User");

  const { loading, data, error, send } = useFetch("auth/login", {
    method: "POST",
    onCompleted: (data) => {
      setUser(data.user)
      io(socketUrl, {
        auth: { token: data.token }
      })
      window.location.assign("/")
    }
  })
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const loginHandler = async (values, actions) => {
    await sleep(1000)
    actions.setSubmitting(true);
    send(values)
  };
  function enhanceError(field) {
    if (error) {
      if (error.hasOwnProperty("errors")) {
        const index = error.errors.findIndex(e => e.param === field)
        if (index !== -1) {
          return error.errors[index].msg
        }
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Meet-Stranger | Login</title>
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Suspense fallback={<span></span>}>
            <Logo sx={{ m: 4 }} />
          </Suspense>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={loginHandler}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                touched,
                values }) => (
                <Form >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        className={classes.root}
                        fullWidth
                        error={Boolean(touched.email && errors.email || enhanceError("email"))}
                        helperText={touched.email && errors.email || enhanceError("email")}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.email}
                        name="email"
                        id="email"
                        label="email"
                        data-test="signin-email"
                        autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        className={classes.root}
                        fullWidth
                        error={Boolean(touched.password && errors.password || enhanceError("password"))}
                        helperText={touched.password && errors.password || enhanceError("password")}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        data-test="signin-password"
                        autoComplete="new-password"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    data-test="signin-submit"
                    variant="contained"
                    disabled={loading ? true : false}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Form>
              )}
            </Formik>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Do not have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container></>
  );
}

export default Login