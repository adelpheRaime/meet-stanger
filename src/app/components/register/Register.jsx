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
import Flash from "../flash"
import useStyles from "./style"
import validationSchema from "./validationSchema"
import { Formik, Form, Field, FieldProps } from "formik";
const Logo = lazy(() => import("../../Logo"))
const initialValues = {
  email: '',
  username: '',
  password: '',
}
// ***********************************************************
//  simple registration with yup form client and express validator from server
//  the validation is from validationSchema.js
// ***********************************************************

export default function Register() {
  const classes = useStyles()
  const navigate = useNavigate()
  const [isConfirm, setIsConfirm] = useStates("isConfirm");
  const { loading, data, error, send } = useFetch("auth/register", {
    method: "POST",
    onCompleted: (data) => {
      if (data) {
        navigate(`/send/confirmation/${data.email}`)
      }
    }
  })
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const registerHandler = async (values, actions) => {
    await sleep(1000)
    actions.setSubmitting(true);
    send(values)
  };
  //get the server errors
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
        <title>Meet-Stranger | Register</title>
      </Helmet>
      {isConfirm &&
        <Flash state="isConfirm" severity="success">
          Please confim your email to continue
        </Flash>}

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
            Sign Up
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={registerHandler}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                touched,
                values }) => (
                <Form >
                  <Grid container spacing={2}>
                    <Grid item xs={12} >
                      <TextField
                        required
                        className={classes.root}
                        fullWidth
                        error={Boolean(touched.username && errors.username || enhanceError("username"))}
                        helperText={touched.username && errors.username || enhanceError("username")}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.username}
                        name="username"
                        id="username"
                        label="username"
                        data-test="signin-username"
                        autoComplete="username"
                      />
                    </Grid>
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
                        fullWidth
                        className={classes.root}
                        error={Boolean(touched.password && errors.password || enhanceError("password"))}
                        helperText={touched.password && errors.password || enhanceError("password")}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="text"
                        value={values.password}
                        name="password"
                        id="password"
                        label="password"
                        data-test="signin-password"
                        autoComplete="password"
                      />
                    </Grid>

                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    data-test="signup-submit"
                    disabled={loading ? true : false}
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

