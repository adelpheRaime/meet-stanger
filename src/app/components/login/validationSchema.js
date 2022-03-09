import  {object,string}  from "yup";
const validationSchema = object().shape({
  ["email"]: string().required("Email is required").email(),
  ["password"]: string().nullable().required("Password is required"),
});

export default validationSchema;
