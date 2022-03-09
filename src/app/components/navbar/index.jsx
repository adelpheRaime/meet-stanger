import React, { lazy, Suspense } from "react"
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import  {faEnvelope}  from "@fortawesome/free-solid-svg-icons/faEnvelope"
import  {faDoorClosed}  from "@fortawesome/free-solid-svg-icons/faDoorClosed"
import  {faEdit}  from "@fortawesome/free-solid-svg-icons/faEdit"
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import useMediaQuery from '@mui/material/useMediaQuery'
import  styled  from '@mui/material/styles/styled';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useStates } from "from-react-context"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AppBar from "@mui/material/AppBar";
import  Toolbar from "@mui/material/Toolbar";
import  CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import useTheme  from "@mui/material/styles/useTheme";
import { makeStyles } from "@mui/styles";
import useFetch from "../../useFetch"
import { socket } from "../App"
import Isloggedin from "../../Isloggedin"
const Logo = lazy(() => import("../../Logo"))
const me = Isloggedin()
const Navigation = styled(AppBar)(({ theme }) => ({
  backgroundColor: "black",
  position: "fixed",
  marginBottom:"4rem",
  zIndex: 10
}));
const useStyles = makeStyles((theme) => ({
  navlinks: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    flexGrow: "1",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  dropDown: {
    position: 'absolute',
    top: 45,
    right: "0rem",
    width: "10rem",
    zIndex: 10,
    border: '1px solid grey',
    p: 1,
    color: "black",
    backgroundColor: "white",
  },
  link: {
    textDecoration: "none",
    color: "white",
    fontSize: "20px",
    marginLeft: "1rem",
  },
}));
// ***********************************************************
//  here we handle the inbox global state
//  count only the viewed message from global state 
//  
// ***********************************************************

const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);
  const [Inbox, setInbox] = useStates("Inbox");
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [, setIsInboxUpdated] = useStates('isInboxUpdated')
  const [User] = useStates("User");
  const location = useLocation()
  const navigate = useNavigate()
  const { send } = useFetch(`inbox/list`, {
    method: "GET",
    onCompleted: (data) => {
      setIsInboxUpdated(true)
      if (data.length > 0) {
        setInbox(data)
      }
    }
  })
  const { send: logout } = useFetch("auth/logout", {
    method: "POST",
    onCompleted: (data) => {
      if (data) {
        socket.emit("end")
        navigate("/login")
      }
    }
  })
  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  React.useEffect(() => {
    send()
  }, [location])
  //notification handler
  React.useEffect(() => {
    socket.on("getInbox", data => {
      setInbox((prev) => {
        const index = prev.findIndex(e => e.user._id === data.user._id)
        if (index === -1) {
          return [...prev, data]
        } else {
          prev[index] = data
          return [...prev]
        }
      })
    })
  }, [socket])
  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <>

      <Navigation position="static" color="secondary">
        <CssBaseline />
        <Toolbar>
          <Box className={classes.logo}>
            <Suspense fallback={<span></span>}>
              <Logo style={{ width: isMobile ? ".5rem" : "2rem" }} />
            </Suspense>
            {!isMobile && <Typography color="text.secondary" variant="h6">Meet Stranger</Typography>}
          </Box>
          <div className={classes.navlinks}>
            {!me ?
              <Link to="/login" className={classes.link}>
                <Typography color="text.secondary" variant="h6">Login</Typography>
              </Link> :
              (<>
                <Link to="/inbox" className={classes.link}>
                  <Badge color="secondary" badgeContent={Inbox.length > 0 ? Inbox.filter(e => !e.view.includes(e.receiver._id)).length : 0}>
                    <FontAwesomeIcon icon={faEnvelope} />
                  </Badge>
                </Link>
                <ClickAwayListener

                  mouseEvent="onMouseDown"
                  touchEvent="onTouchStart"
                  onClickAway={handleClickAway}
                >
                  <Box className={classes.link} sx={{ position: 'relative' }}>
                    <Avatar onClick={handleClick}
                      src={User.hasOwnProperty("profile")?User.profile:me.profile}
                    />
                    {open ? (
                      <Box className={classes.dropDown}>
                        <List >
                          <ListItem
                            secondaryAction={
                              <IconButton onClick={() => navigate("/user/edit")} edge="end" aria-label="delete">
                                <FontAwesomeIcon icon={faEdit} />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={me.username}
                            />
                          </ListItem>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => logout()}
                              >
                                <FontAwesomeIcon icon={faDoorClosed} />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary="Logout"
                            />
                          </ListItem>
                        </List>
                      </Box>
                    ) : null}
                  </Box>
                </ClickAwayListener></>)
            }

          </div>
        </Toolbar>
      </Navigation>
    </>
  )
}
export default Navbar