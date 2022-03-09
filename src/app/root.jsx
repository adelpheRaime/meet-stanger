import React from 'react';
import Layout from "./components/Layout"
import Conversation from "./components/Conversation"
import Inbox from "./components/Inbox"
import Home from "./components/Home"
import Profile from "./components/profile"
import EditProfile from "./components/profile/Edit"
import Login from "./components/login/Login"
import Register from "./components/register/Register"
import { useRoutes, Navigate } from 'react-router-dom';
import NoMatch from "./components/NoMatch"
import Confirmation from "./components/Confirmation"
import ConfirmationMiddleWare from "./components/ConfirmationMiddleWare"
import Isloggedin from "./Isloggedin"
const me = Isloggedin()
export default function Root() {

    const AppRoutes = [
        {
            path: '/',
            element: <Layout />,
            children: [
                { path: "/", element: me ? <Navigate to="/inbox" />:<Home /> },
                { path: "/inbox", element: me ? <Inbox /> : <Navigate to="/login" /> },
                { path: "/conversation", element: me ? <Conversation /> : <Navigate to="/login" /> },
                { path: "/user/:name", element: me ? <Profile /> : <Navigate to="/login" /> },
                { path: "/user/edit", element: me ? <EditProfile /> : <Navigate to="/login" /> },
                // { path: "/user", element: <User /> },
                { path: "/login", element: <Login /> },
                { path: "/register", element: <Register /> },
                { path: "/send/confirmation/:email", element: <ConfirmationMiddleWare /> },
                { path: '/send/confirmation', element: <Confirmation /> },
                { path: '/noMatch', element: <NoMatch /> },
                { path: '*', element: <Navigate to="/noMatch" /> }
            ]
        },
    ]
    return useRoutes(AppRoutes)
}
