import * as React from 'react';
import Card from '@mui/material/Card';
import { useNavigate,useParams } from 'react-router-dom';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import moment from "moment";
import Typography from '@mui/material/Typography';
import red  from '@mui/material/colors/red';
import useFetch from "../../useFetch"
import { Helmet } from 'react-helmet';
import Loading from "../Loading"
const Profile=() =>{
  const {name}=useParams()
  const navigate = useNavigate()
  const {loading:loadingProfile,data,send}=useFetch(`users/profile/${name}`,{
    method:"GET",
    onError:(err)=>{
      if(err){
        navigate("/")
      }
    }
  })
  
  React.useEffect(()=>{
    send()
  },[])
  return (
    <>
    <Helmet>
        <title>Meet-Stranger | Profile</title>
      </Helmet>
      {loadingProfile && <Loading />}
      {
        data&&(
          <Box sx={{minHeight:"75vh",mt:"1rem",mb:"1.5rem"}}>
          <Card>
          <CardHeader
          avatar={
            <Avatar 
            sx={{ bgcolor: red[500] }} 
            src={data.profile}
            >
              {data.username}
            </Avatar>
          }
          title={data.username}
          subheader={
            <Typography variant="body1">
            {"join meet-stranger on " + moment(data.createdAt).fromNow()}
            </Typography>
          }
         
        />
        <CardMedia
          component="img"
          height="194"
          image={data.coverPhoto}
          alt={data.username}
        />
        <CardContent>
          <Typography style={{marginTop:".5rem"}} variant="body1">
            <strong>{data.username}</strong>
          </Typography>
          <Typography variant="body2">
            {data.about}
          </Typography>
          <Typography style={{marginTop:".5rem"}} variant="body1">
            <strong>I'm looking for</strong>
          </Typography>
          <Typography variant="body2">
           {data.userStatus}
          </Typography>
        </CardContent>
        </Card>
        </Box>
         ) }
         </>)
 }
export default Profile