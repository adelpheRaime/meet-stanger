import React, { lazy, Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { styled } from "@mui/styles"
import { useStates } from "from-react-context"
import Footer from "./footer"
import Navbar from "./navbar"
import Fab from '@mui/material/Fab';
import Dialogs from "./dialogs"
import { faSync } from "@fortawesome/free-solid-svg-icons/faSync"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAdd } from "@fortawesome/free-solid-svg-icons/faAdd"
const UserList = lazy(() => import("./user/UserList"))
const Container = styled('div')(
  ({ theme }) => ({
    minHeight: "100vh",
    position: "relative"
  }));
const Main = styled('div')(
  ({ theme }) => ({
    width: "100%",
    padding: `4.5rem .5rem 0 .5rem`,
    [theme.breakpoints.down("md")]: {
      padding: "4.5rem 0 0 0"
    }
  }));
const LeftSide = styled('div')(
  ({ theme }) => ({
    width: "23%",
    [theme.breakpoints.down("md")]: {
      display: "none"
    },
    position: "fixed",
  }));
const Feed = styled('div')(
  ({ theme }) => ({
    marginLeft: "15rem",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0",
      width: "100%",
    },

  }));
const FooterContainer = styled('div')(
  ({ theme }) => ({
    position: "absolute",
    bottom: "0px",
    width: "100%"
  }));
const MobileAddUser = styled('div')(
  ({ theme }) => ({
    [theme.breakpoints.down("md")]: {
      display: "block",
      position: "absolute",
      top: "4.5rem",
      right: 0
    },
    display: "none"
  }));
// this is the simple build of layout output
//  -----------------------------------
// | logo                     menu     |
// |___fixed appbar____________________|                                   |
// |         |                         |
// |         |                         |
// | fixed   |       Feed              |
// | LeftSide|                         |
// |         |                         |
// |         |                         |
// |      Footer or text Input         |
//  -----------------------------------
const Layout = () => {
  const location = useLocation()
  const path = location.pathname.split("/")
  //exclude the navbar and footer component from layout if 
  //path matched with the key in array
  const exclude = ["", "register", "login", "noMatch", "send"].includes(path[1])
  const [IsDialogOpen, setIsDialogOpen] = useStates("IsDialogOpen")
  return (
    <>
      {exclude
        ? <Outlet />
        : (<>
          <Container>
            <Navbar />
            <Main>
              <LeftSide>
                <UserList />
              </LeftSide>
              <Feed>
                <Outlet />
              </Feed>
            </Main>
            <MobileAddUser>
              <Fab
                size="small"
                color="secondary"
                aria-label="add"
                onClick={() => setIsDialogOpen(true)}
              >
                <FontAwesomeIcon icon={faAdd} />
              </Fab>
            </MobileAddUser>
            <FooterContainer>
              <Footer />
            </FooterContainer>
          </Container>
          <Dialogs
            open={IsDialogOpen}
            setOpen={setIsDialogOpen}
            ModalTitle="Stranger"
          >
            <Suspense fallback={
              <div
                style={{
                  width: "100%",
                  height: "50vh",
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <FontAwesomeIcon icon={faSync} size={32} className="fa-spin" />
              </div>
            }>
              <UserList />
            </Suspense>

          </Dialogs>
        </>)
      }
    </>
  )
}


export default Layout
