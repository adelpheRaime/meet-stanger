import React, { useRef, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane"
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync"
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload"
import useFetch from "../../useFetch"
import Dialogs from "../dialogs"
import grey from '@mui/material/colors/grey';
import Link from '@mui/material/Link';
import UserList from "../user/UserList"
import { useStates } from "from-react-context"
import { socket } from "../App"
import { useNavigate, useLocation } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Isloggedin from "../../Isloggedin"
import { makeStyles } from '@mui/styles';
import Search from "../search"
import cloudinaryApi from "../../cloudinaryApi"
const useStyles = makeStyles((theme) => ({
  attachFile: {
    display: "flex",
    padding: "8px",
    justifyContent: "center",
    color: "#1976d2",
    fontSize: "1.5rem",
    '&:hover': {
      cursor: "pointer"
    }
  },
  image: {
    '&:hover': {
      cursor: "pointer"
    }
  }
}));
export default function Footer() {
  const contentRef = useRef(null)
  const me = Isloggedin()
  const theme = useTheme();
  const file = useRef()
  const location = useLocation()
  const path = location.pathname.split("/")[1]
  const isConversation = path === "conversation" ? true : false
  const navigate = useNavigate()
  const classes = useStyles()
  const [ReceivedBy] = useStates("ReceivedBy")
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [Message, setMessage] = useStates("Messages")
  const [Progress, setProgress] = useStates("FileProgress")
  const [FilePath, setFilePath] = useState(null)
  const [open, setOpen] = useStates("IsDialogOpen");
  const [, setisFileUpload] = useStates("isFileUpload")
  const [isAuthorized, setisAuthorized] = useStates("FlashError")

  //add the conversation into inbox after sending message
  //and emit socket event within inbox data
  const { send: sendInbox } = useFetch("inbox/add", {
    method: "POST",
    onCompleted: (data) => {
      socket.emit("sendInbox", data)
    },

  })
  //add the conversation 
  const { send } = useFetch("conversation/add", {
    method: "POST",
    onCompleted: (data) => {
      socket.emit("sendMsg", data)
      //when the upload process finished stop the progress icon
      //because that progress is visible only for a file message
      sendInbox(data)
      setMessage([...Message, data])
      setFilePath(null)

    },
    onError: (error) => {
      if (error.hasOwnProperty("code")) {
        if (error.code == "TkerrorNotBscad") {
          navigate("/login")
          return
        }
      }
    }
  })

  function messageHandler() {
    //open user tab if the recipiant is not set
    if (!ReceivedBy.hasOwnProperty("_id")) {
      setOpen(true)
      return
    }
    const data = {
      content: {
        type: "txt",
        filename: "",
        mimeType: "",
        body: contentRef.current.innerText
      },
      receivedBy: ReceivedBy._id

    }
    send(data)
  }
  //allow user to send a message with the enter key
  function handlekeypress(e) {
    e.preventDefault()
    if (e.keyCode === "Enter") {
      messageHandler()
    }
  }

  useEffect(() => {
    if (ReceivedBy.hasOwnProperty("_id")) {
      setOpen(false)
    }
  }, [ReceivedBy])
  function uploadFile() {
    if (!ReceivedBy.hasOwnProperty("_id")) {
      setOpen(false)
      return
    }
    const inputFile = file.current.files[0]
    setProgress(true)
    setFilePath(inputFile)
  }
  //file handler
  useEffect(() => {

    if (FilePath) {
      const mimeType = FilePath.type.split("/")[0]
      const authorizedFile = mimeType === "video" || mimeType === "image" || mimeType === "audio"
      if (FilePath.size > 16000000) {
        setProgress(false)
        setisFileUpload(true)
        setisAuthorized({
          ...isAuthorized,
          status: true,
          message: "file is too large.The file should not exeed 16MB"

        })
        return
      } else if (!authorizedFile) {
        setProgress(false)
        setisFileUpload(true)
        setisAuthorized({
          ...isAuthorized,
          status: true,
          message: "Sorry!only video and image format are allowed"
        })
        return
      }
      const data = {
        content: {
          type: "file",
          body: "",
          filename: FilePath.name,
          mimeType: FilePath.type.split("/")[0]
        },
        receivedBy: ReceivedBy._id
      }
      //await all file uploading process before sending request
      //because we need to store the file url in database
      if (!ReceivedBy.hasOwnProperty("_id")) {
        setOpen(true)
        return
      } else if (!me) {
        navigate("/login")
        return
      }
      Promise.resolve(cloudinaryApi(FilePath)).then(path => {
        if (path !== "") {
          data.content.body = path
          send(data)
        }
        setProgress(false)

      }).catch(err=>{
        setProgress(false)
        setisAuthorized({
          ...isAuthorized,
          status: true,
          message: "Sorry!uploading error"
        })
      })
    }
  }, [FilePath])

  return (
    <div style={{
      padding: ".5rem",
      backgroundColor: isConversation ? "#fff" : "black",
      zIndex: 10
    }}>
      {isConversation
        ? <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Box display="flex" style={{ width: isMobile ? "100%" : "75%" }} alignItems="center" component="form" >
            {Progress
              ? <div className={classes.attachFile}>
                <FontAwesomeIcon icon={faSync} size={32} className="fa-spin" />
              </div>
              : <label htmlFor="file">
                <div className={classes.attachFile}>
                  <FontAwesomeIcon icon={faUpload} />
                </div>
                <input
                  style={{ display: "none" }}
                  id="file"
                  type="file"
                  multiple
                  data-test="file-to-upload"
                  onChange={uploadFile}
                  ref={file}
                />
              </label>
            }
            <div
              ref={contentRef}
              contentEditable={true}
              data-test="message-body"
              style={{
                border: `1px solid ${grey[300]}`,
                caretColor: "red",
                padding: "0 4px 0 4px",
                height: "3rem",
                width: "95%",
                overflowY: "scroll",
                wordBreak: "break-all",
                hyphens: "manual"
              }}
            />
            <IconButton
              onKeyPress={handlekeypress}
              onClick={messageHandler}
              data-test="message-submit"
              aria-label="delete" color="primary"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </IconButton>
          </Box>
        </div>
        : <Typography variant="body2" color="text.secondary" align="center" >
          {'Copyright © '}
          <Link color="inherit" target="_blank" href="https://github.com/adelpheRaime">
            Ramiandrisoa Adelphe Aime
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      }
      <Dialogs
        open={open}
        setOpen={setOpen}
        ModalTitle={<Search />}
      >
        <UserList />
      </Dialogs>


    </div>
  );
}