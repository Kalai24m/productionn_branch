import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import man from "assets/images/man.jpg";
import { loginUser } from "actions/authAction";
import { connect } from "react-redux";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import axios from "axios";

const Basic = function (props) {
  const [rememberMe, setRememberMe] = useState();
  const [err, setErr] = useState({
    email: "",
    password: "",
    emailIncorrect: "",
    passwordIncorrect: "",
  });
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const [values, setValues] = useState(initialValues);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [red, setRed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
      showPassword: !values.showPassword,
    });
  };

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      navigate("/dashboard");
    }
  });

  useEffect(() => {
    if (props.errors) {
      setErr({
        email: props.errors.email,
        password: props.errors.password,
        emailIncorrect: props.errors.emailnotfound,
        passwordIncorrect: props.errors.passwordinCorrect,
      });
    }
    if (
      err.email ||
      (err.emailIncorrect && err.password) ||
      err.passwordIncorrect !== ""
    ) {
      setRed(true);
    }
    // console.log(err)
  }, [props.errors]);

  const img = "https://source.unsplash.com/random/2560×1600/?Nature";

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: values.email,
      password: values.password,
    };
    // console.log(userData);
    props.loginUser(userData);
  };

  return (
    <BasicLayout image={img}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Jump In
          </MDTypography>
        </MDBox>

        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                value={values.email}
                onChange={handleInputChange}
                helperText={err.email || err.emailIncorrect}
                name="email"
                fullWidth
                error={red}
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
                helperText={err.password || err.passwordIncorrect}
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

            <MDBox mt={2} mb={1}>
              <MDButton variant="gradient" type="submit" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Forgot your password?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/forgotpwd"
                  variant="button"
                  color="error"
                  fontWeight="medium"
                  textGradient
                >
                  Get new
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.error,
});

export default connect(mapStateToProps, { loginUser })(Basic);
