import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from "../useFetch"
import { useStates } from "from-react-context"
import LoadImage from "../../../public/images/fountain.gif"
import { io } from "socket.io-client"
import { Helmet } from 'react-helmet';
import {socketUrl} from "../baseUrl"
// ***********************************************************
// It is the page shown after following the activate link from email
//
// ***********************************************************

export default function Confirmation() {

    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const id = query.get("tkn")
    const navigate = useNavigate()
    const [, setUser] = useStates("User");
    const { loading, data, error, send } = useFetch(`auth/confirmation/${id}`, {
        method: "GET",
        onCompleted: (data) => {
            io(socketUrl, {
                auth: { token: data.token }
            })
            setUser(data.user)
            window.location.assign("/")
        },
        onError: () => {
            navigate("/register")
        }
    })
    React.useEffect(() => {
        send()
    }, [])
    return (
        <>
            <Helmet>
                <title>Meet-Stranger | Confirmation</title>
            </Helmet>
            <div style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <img src={LoadImage} />
            </div>

        </>
    )
}
