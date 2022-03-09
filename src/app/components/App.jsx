import React, { lazy, Suspense, useEffect } from "react"
import defaultTheme from "../theme"
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, useLocation,useNavigate } from "react-router-dom";
import { io } from "socket.io-client"
import useFetch from "../useFetch"
import Cookie from "universal-cookie"
import { useStates } from "from-react-context"
import Logo from "../Logo"
import { socketUrl } from "../baseUrl"
import Isloggedin from "../Isloggedin"
import LoadImage from "../../../public/images/fountain.gif"
//use dynamic import for root to reduce bundle size
const Root = lazy(() => import('../root'))
const me = Isloggedin()
const cookie = new Cookie()
const token = cookie.get("_fXeTk") ? cookie.get("_fXeTk") : null
export const socket = io(socketUrl, {
    auth: { token: token }
})
// ***********************************************************
//  here we import all roots dynamicly to reduce the bundle size
//  store the logged user information and the online users in global state
//
// ***********************************************************

const App = () => {
    const [, setUser] = useStates("User")
    const [, setOnlineUsers] = useStates("OnlineUsers")
    //store user information in user state
    const { send } = useFetch("users/me", {
        method: "GET",
        onCompleted: (data) => {
            setUser(data)
        }
    })
    useEffect(() => {
        send()
    }, [])
    useEffect(() => {
        socket.on("getUsers", (users) => {
            setOnlineUsers(users)
        })
    }, [socket])
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Suspense fallback={
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
                        <div style={{ width: "75%", textAlign: "center", margin: ".5rem" }}>
                            <Logo />
                        </div>
                        <img src={LoadImage} />
                    </div>
                }>
                    <Root />
                </Suspense>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;