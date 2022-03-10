import React, { lazy, Fragment, useEffect, useState, useRef, Suspense } from 'react';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch"
import styled from '@mui/material/styles/styled';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Badge from '@mui/material/Badge';
import useFetch from "../../useFetch"
import { useStates } from "from-react-context"
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
// ***********************************************************
//  here we can get all user from our database 
//  where the loggedin user is excluded from the list
//  we can search user
//
// ***********************************************************

const UserList = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const [, setReceivedBy] = useStates("ReceivedBy")
  const [, setProgress] = useStates("FileProgress")
  const [onlineUsers] = useStates("OnlineUsers")
  const [Users, setUsers] = useStates("UserLists")
  const [, setIsDialogOpen] = useStates("IsDialogOpen")
  const [, setProfile] = useStates("Profile")
  const { send } = useFetch(`users/`, {
    method: "GET",
    onCompleted: (data) => {
      setUsers(data)
    }
  })
  useEffect(() => {
    send()
  }, [])

  function _setReceivedBy(e) {
    setReceivedBy(e)
    setIsDialogOpen(false)
    setProgress(false)
    localStorage.setItem("_ftrd", e._id)
    navigate("/conversation")
  }
  
  function goToProfile(e) {
    setProfile(e)
    navigate("/users")
  }
  return (
    <div>
      <div style={{marginTop:".5rem"}}>
        <List>
          {
            Users.length > 0 && Users.map((user, index) => (
              <Fragment key={index}>
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => _setReceivedBy(user)}
                  >

                    <ListItemIcon>
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant={onlineUsers.some(e => e.userId === user._id) ? "dot" : ""}

                      >
                        <Avatar
                          alt={user.username}
                          onClick={() => goToProfile(user._id)}
                          src={user.profile} />
                      </StyledBadge>
                    </ListItemIcon>
                    <ListItemText primary={user.username} />
                  </ListItemButton>
                </ListItem>
              </Fragment>
            ))
          }

        </List>
      </div>
    </div>

  )
}
export default UserList