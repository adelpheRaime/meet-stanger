import  {object,string}  from "yup";
const validationSchema = object().shape({
  ["email"]: string().required("Email is required"),
  ["username"]: string()
    .matches(".{3,}", "at least 3 characters")
    .matches("^[a-zA-Z0-9_]*$", "Username can contain only letter or number")
    .required("Username is required"),
  ["password"]: string().nullable().required("Password is required"),
});

export default validationSchema;
