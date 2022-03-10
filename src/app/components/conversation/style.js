import { makeStyles } from "@mui/styles";
import { indigo, red } from "@mui/material/colors";
const useStyles = makeStyles(theme => ({
  sending_container: {
    backgroundColor: red[50],
    display: "flex",
    borderRadius: "10px",
    alignItems: "center",
    width: "50%",
    padding: ".5rem",
    margin: "1rem",
    height:"auto"
  },
  receiving_container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: indigo[50],
    borderRadius: "10px",
    width: "50%",
    padding: ".5rem",
    margin: "1rem",
    height:"auto"
  },
  MsgContainer:{
    position:"relative",
    display:"flex",
    flexDirection:"column",
    padding: "1rem", 
    width: "100%",
    overflowY: "auto",
    height: "70vh",
    marginBottom:"1rem" 
  },
  MsgContainerJustify:{
    display:"flex",
    flexDirection:"column",
    padding: "1rem", 
    width: "100%",
    overflowY: "auto",
    height: "70vh",
    justifyContent:"center",
    alignItems:"center", 
  },
  mobileAddUser:{
    position:"absolute",
    top:0,
    right:0
  },
  cover:{
    width:"100%",
    objectFit:"cover"
  }
  
}));

export default useStyles;
