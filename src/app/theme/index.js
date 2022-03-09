import createTheme from "@mui/material/styles/createTheme";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";
import indigo from "@mui/material/colors/indigo";
let defaultTheme = createTheme({
  palette: {
    background: {
      default: "black",
      primary: indigo[400],
      secondary: "#1976d2",
    },
    text: {
      primary: "#7a8192",
      secondary: "",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          backgroundColor: "#fff",
          overflowX: "hidden",
          height: "auto!important",
          minHeight: "100vh",
          "& a": {
            textDecoration: "none",
          },
          "& img": {
            cursor: "pointer",
          },
        },
      },
    },
  },
});
defaultTheme = responsiveFontSizes(defaultTheme);
export default defaultTheme;
