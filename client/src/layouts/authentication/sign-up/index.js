import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Select from "@mui/material/Select";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import InputLabel from "@mui/material/InputLabel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { connect } from "react-redux";
import { registerUser } from "actions/authAction";

function Cover(props) {
  const initialValues = {
    name: "",
    empid: "",
    role: "",
    email: "",
    password: "",
    cpassword: "",
  };
  const [values, setValues] = useState(initialValues);
  const [err, setErr] = useState({
    name: "",
    role: "",
    empId: "",
    email: "",
    password: "",
    password2: "",
    emailAlready: "",
    emailNotFound:"",
  });
  const [red, setRed] = useState(false);
 const img="https://images.unsplash.com/photo-1471734134930-fdd4b1af533e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1749&q=80"
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      
      [name]: value,
    });
  };

  useEffect(() => {
    if (props.errors) {
      setErr({
        name: props.errors.name,
        // role: props.errors.role,
        empId: props.errors.empId,
        email: props.errors.email,
        password: props.errors.password,
        password2: props.errors.password2,
        emailAlready: props.errors.emailAlready,
        emailNotFound: props.errors.emailNotFound,
      });
    }

    if (
      err.email &&
      err.password &&
      err.name &&
      // err.role &&
      err.empId &&
      err.password2 &&
      err.emailNotFound &&
      err.emailAlready !== ""
      
    ) {
      setRed(true);
    }
    
  }, [props.errors]);

  // const [show, setShow] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: values.name,
      empId: values.empid,
      role: values.role,
      email: values.email,
      password: values.password,
      password2: values.cpassword,
    };
    // console.log(userData);
    props.registerUser(userData);

  
  };
  return (
    <>
      <CoverLayout image={img}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Join The Force
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your email and password to register
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Full Name"
                  value={values.name}
                  onChange={handleInputChange}
                  helperText={err.name}
                  name="name"
                  fullWidth
                />
              </MDBox>
              <MDBox
                mt={2}
                mb={2}
                display="flex"
                justifycontent="space-evenly"
                alignItems="center"
              >
                <Grid container spacing={2}>
                  <Grid item xs={1} md={7}>
                    <MDInput
                      type="text"
                      value={values.empid}
                      onChange={handleInputChange}
                      helperText={err.empId}
                      name="empid"
                      label="Employee Number"
                    />
                  </Grid>
                  <Grid item xs={1} md={3}>
                    <div>
                      <FormControl>
                        <InputLabel htmlFor="grouped-native-select">
                          Role
                        </InputLabel>
                        <Select
                          native
                          id="grouped-native-select"
                          label="Role"
                          name="role"
                          value={values.role}
                          onChange={handleInputChange}
                          // sx={{ Width: 300 }}
                          style={{ width: "130px" }}
                        >
                          <option aria-label="None" />
                          <option value="analyst">Analyst</option>
                          {/* <option value="Project Manager">Project Manager</option>*/}
                          <option value="admin">Admin</option>
                        </Select>
                        <FormHelperText>{err.role}</FormHelperText>
                      </FormControl>
                    </div>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  value={values.email}
                  onChange={handleInputChange}
                  name="email"
                  helperText={err.email || err.emailAlready || err.emailNotFound}
                  label="Email"
                  fullWidth
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Password"
                  variant="outlined"
                  name="password"
                  value={values.password}
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  error={red}
                  helperText={err.password}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  label="Confirm Password"
                  variant="outlined"
                  name="cpassword"
                  value={values.cpassword}
                  type={showPassword ? "text" : "password"}
                  onChange={handleInputChange}
                  error={red}
                  helperText={err.password2}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  type="submit"
                  color="info"
                  fullWidth
                >
                  sign in
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Already have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-in"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign In
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.error,
});

export default connect(mapStateToProps, { registerUser })(Cover);
