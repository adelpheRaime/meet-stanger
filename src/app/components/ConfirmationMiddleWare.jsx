import React from 'react'
import { Link as RouterLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import useFetch from "../useFetch"
import Typography from '@mui/material/Typography';
import { useStates } from "from-react-context"
import LoadImage from "../../../public/images/fountain.gif"
import { io } from "socket.io-client"
import { Helmet } from 'react-helmet';
import {socketUrl} from "../baseUrl"
// ***********************************************************
// This page is shown after the registration i validated
// await for the email confirmation
// it redirects user in inbox page if user have confirmed his email
// ***********************************************************

export default function ConfirmationMiddleWare() {
    const { email } = useParams()
    const [, setUser] = useStates("User");
    const { send } = useFetch(`auth/check/${email}`, {
        method: "GET",
        onCompleted: (data) => {
            io(socketUrl, {
                auth: { token: data.token }
            })
            setUser(data.user)
            window.location.assign("/")
        }
    })
    // send request to the database every 10 second to track if user is confirmed
    const watchConfirm = React.useCallback(() => {
        send()
        setTimeout(watchConfirm, 10000);
    }, [])
    React.useEffect(() => {
        watchConfirm()
    }, [watchConfirm])
    return (
        <>
            <Helmet>
                <title>Meet-Stranger | Awaiting Confirmation</title>
            </Helmet>
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <div style={{ width: "75%", margin: ".5rem" }}>
                    <Typography variant="body1">
                        <span style={{ marginRight: ".5rem" }}> Almost done... We just sent an email to</span>
                        <a href="https://mail.google.com" target="_blank">{email}</a>
                        <span style={{ marginLeft: ".5rem" }}>.If you don't get the email,please check your spam </span>

                    </Typography>
                </div>
                <img src={LoadImage} />
            </div>

        </>
    )
}

