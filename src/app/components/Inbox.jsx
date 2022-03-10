import React, { useState, Fragment } from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash"
import useFetch from "../useFetch"
import { Helmet } from 'react-helmet';
import Dialogs from "./dialogs"
import Search from "./search"
import UserList from "./user/UserList"
import { useStates } from "from-react-context"
import { Link as RouterLInk, useNavigate } from 'react-router-dom';
import  truncate  from "lodash/truncate"
import Isloggedin from "../Isloggedin"

const me = Isloggedin()
// ***********************************************************
//  here we can get and handle the inboxs message
//
// ***********************************************************

export default function Inbox() {
  const [inbox, setInbox] = useStates('Inbox')
  const [isInboxUpdated] = useStates('isInboxUpdated')
  const [ReceivedBy, setReceivedBy] = useStates('ReceivedBy')
  const [User] = useStates("User")
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  //when user click to the inbox item
  //set it as viewed and navigate to the discussion
  const { send: editInbox } = useFetch("inbox/edit", {
    method: "PATCH",
    onCompleted: (data) => {
      navigate(`/conversation`)
    },
    onError: (error) => {
      if (error.hasOwnProperty("code")) {
        if (error.code === "TkerrorNotBscad") {
          navigate("/login")
          return
        }
      }
    }
  })
  const { send: delConversation } = useFetch("conversation/delete", {
    method: "DELETE",
    onError: (error) => {
      if (error.hasOwnProperty("code")) {
        if (error.code === "TkerrorNotBscad") {
          navigate("/login")
          return
        }
      }
    }
  })
  const { send: delInbox } = useFetch("inbox/delete", {
    method: "DELETE",
    onCompleted: (data) => {
      if (data.success) {
        delConversation({ receivedBy: ReceivedBy._id })
        const inboxs = inbox.filter(e => e._id !== data.payload._id)
        setInbox(inboxs)
      }
    },
    onError: (error) => {
      if (error.hasOwnProperty("code")) {
        if (error.code === "TkerrorNotBscad") {
          navigate("/login")
          return
        }
      }
    }
  })

  function _delInbox(id) {
    delInbox({
      _id: id,
      receivedBy: ReceivedBy._id
    })
  }
  function _editInbox(msg) {
    setReceivedBy(msg.user)
    if (!msg.view.includes(User._id)) {
      editInbox({
        _id: msg._id
      })
      return
    }
    navigate(`/conversation`)
  }
  return (
    <>
      <Helmet>
        <title>Meet-Stranger | Inbox</title>
      </Helmet>
      <Box>
        {inbox.length > 0 && inbox.map((value, index) => (
          <List key={index} dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  onClick={() => _delInbox(value._id)}
                >
                  <FontAwesomeIcon  icon={faTrash} />
                </IconButton>
              }
              disablePadding

            >
              <ListItemButton
                onClick={() => _editInbox(value)}
                component={RouterLInk}
                to="/conversation"
              >
                <ListItemAvatar>
                  <Avatar
                    alt={value.user.username}
                    src={value.user.profile}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      {value.user.username}
                    </Typography>
                  }
                  secondary={
                    <Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                        style={{
                          fontWeight: !value.view.includes(value.receiver._id) ? "bold" : ""
                        }}
                      >
                        {
                          value.content.type == "file"
                            ? (typeof value.content.mimeType === "string"
                              ? "has sent you " + value.content.mimeType
                              : "has sent you a file")
                            : truncate(
                              value.content.body, {
                              'length': 15,
                              'separator': ' '
                            })
                        }
                      </Typography>
                    </Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
          </List>))}
        {((inbox.length === 0 && isInboxUpdated || !me) &&
          <Box display="flex" style={{ minHeight: "75vh" }} justifyContent="center" alignItems="center" alignColumn="center" flexDirection="column">
            <div style={{ width: "50%", textAlign: "center" }}>
              <Typography variant="body1">You inbox is empty!</Typography>
              <Button
                style={{ marginTop: "1rem" }}
                variant="contained"
                onClick={() => setOpen(true)}
              >
                Chat
              </Button>
            </div>
          </Box>)
        }
        <Dialogs
          open={open}
          setOpen={setOpen}
          ModalTitle={<Search />}
        >
          <UserList />
        </Dialogs>
      </Box>
    </>);
}
