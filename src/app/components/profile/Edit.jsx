import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Flash from "../flash"
import Avatar from '@mui/material/Avatar';
import red from '@mui/material/colors/red';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import useFetch from "../../useFetch"
import useStyles from "./style"
import cloudinaryApi from "../../cloudinaryApi"
import { useStates } from "from-react-context"
import { Helmet } from 'react-helmet';
import Loading from "../Loading"
const EditProfile = () => {
  const classes = useStyles()
  const [User, setUser] = useStates("User");
  const [, setIsEditProfile] = useStates("isEditProfile");
  const navigate = useNavigate()
  const userStatus = React.useRef()
  const about = React.useRef()
  const profile = React.useRef()
  const coverPhoto = React.useRef()
  const [ProfileFs, setProfileFs] = React.useState(null)
  const [CoverFs, setCoverFs] = React.useState(null)
  const { loading: loadingProfile, data, send } = useFetch(`users/me`, {
    method: "GET",
    onError: (err) => {
      if (err) {
        navigate("/login")
      }
    }
  })
  const { loading: loadingSave, data: dataEdit, error, send: userEdit } = useFetch("users/profile/edit", {
    method: "PATCH",
    onCompleted: (data) => {
      setUser({ ...data })
      setIsEditProfile(true)
    },
    onError: (error) => {
      if (error.hasOwnProperty("code")) {
        if (error.code === "TkerrorNotBscad") {
          navigate("/login")
          return
        }
      }
      setIsEditProfile(true)
    }
  })

  React.useEffect(() => {
    send()
  }, [])

  const upload = (type) => {
    if (type === "profile") {
      setProfileFs(profile.current.files[0])
      return
    }
    setCoverFs(coverPhoto.current.files[0])

  }
  function handleSubmit(e) {
    e.preventDefault()
    Promise.all([
      ProfileFs ? cloudinaryApi(ProfileFs) : data.profile,
      CoverFs ? cloudinaryApi(CoverFs) : data.coverPhoto
    ])
      .then(([pr, cr]) => {
        userEdit({
          id: User._id,
          about: about.current.innerText,
          userStatus: userStatus.current.innerText,
          profile: pr,
          coverPhoto: cr
        })
      })

  }

  return (
    <>
      <Helmet>
        <title>Meet-Stranger | Edit Profile</title>
      </Helmet>
      {loadingProfile && <Loading />}
      {dataEdit && <Flash state="isEditProfile" severity="success">Change saved</Flash>}
      {error && <Flash state="isEditProfile" severity="error">{error.message}</Flash>}
      <Box sx={{minHeight:"75vh",mt:"1rem",mb:"1.5rem"}}>
        {data &&
          (<form onSubmit={handleSubmit} >
            <Card >
              <CardHeader

                avatar={
                  <>
                    <label htmlFor="file">
                      <Avatar
                        sx={{ bgcolor: red[500] }}
                        alt={data.username}
                        className={classes.image}
                        src={
                          ProfileFs
                            ? URL.createObjectURL(ProfileFs)
                            : data.profile
                        }

                      />
                      <input
                        style={{ display: "none" }}
                        id="file"
                        type="file"
                        accept=".png,.jpeg,.jpg"
                        onChange={() => upload("profile")}
                        ref={profile}
                      />
                    </label>
                  </>}
              />
              <label htmlFor="cover">
                <CardMedia
                  component="img"
                  height="194"
                  image={
                    CoverFs
                      ? URL.createObjectURL(CoverFs)
                      : data.coverPhoto
                  }
                  className={classes.image}
                  alt={data.username}
                />
                <input
                  style={{ display: "none" }}
                  id="cover"
                  type="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={() => upload("coverPhoto")}
                  ref={coverPhoto}
                />
              </label>
              <CardContent>
                <Typography style={{ textAlign: "left", marginTop: ".5rem" }} variant="body1">
                  <strong>{data.username}</strong>
                </Typography>
                <div
                  style={{
                    textAlign: "left"
                  }}
                  contentEditable="true"
                  ref={about}
                >
                  {data.about}
                </div>
                <Typography style={{ textAlign: "left", marginTop: ".5rem" }} variant="body1">
                  <strong>I'm looking for</strong>
                </Typography>
                <div
                  style={{
                    textAlign: "left"
                  }}
                  contentEditable="true"
                  ref={userStatus}
                >
                  {data.userStatus}
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loadingSave ? true : false}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Save
                </Button>

              </CardContent>

            </Card>
          </form>)
        }
      </Box> </>);

}
export default EditProfile