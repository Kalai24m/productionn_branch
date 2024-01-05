// @mui material components
//  import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom";
// import { format } from 'date-fns'
import moment from "moment";
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
// import MDAvatar from "components/MDAvatar";
import cartoon from "assets/images/cartoon.png";
// Billing page components
// import Greeting from "layouts/Greeting";
// import PropTypes from "prop-types";
// function Greetings() {
//   const [greet, setGreet] = useState("");
//   const [time, setTime] = useState("");
//   useEffect(() => {
function Greetings() {
  let greet;
  const date = new Date();
  const hours = date.getHours();
  const today = moment();

  const styles = {
    fontSize: 35,
  };

  if (hours < 12) {
    greet = "morning";
    styles.color = "#D90000";
  } else if (hours >= 12 && hours < 17) {
    greet = "afternoon";
    styles.color = "#04733F";
  } else if (hours >= 17 && hours < 20) {
    greet = "evening";
    styles.color = "#04756F";
  } else {
    greet = "night";
    styles.color = "#04756F";
  }

  return (
    <Card lg={{ pb: "20px", height: "100%" }}>
      <MDBox pt={3} px={2} mb={8}>
        <MDBox
          display="flex"
          flexDirection="row"
          // flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <MDTypography variant="h2" fontWeight="bold" color="info" textTransform="capitalize">
            <div>Good {greet} Shankar</div>
          </MDTypography>
          <MDBox display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
            <MDBox color="text" mr={0.5} lineHeight={0}>
              <Icon color="info" fontSize="large">
                schedule
              </Icon>
            </MDBox>
            <MDTypography color="Warning" fontWeight="regular">
              <div> {today.format("LT")}</div>
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox
          pt={3}
          pb={2}
          px={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <MDBox mb={2}>
            <MDTypography variant="caption" color="success" fontWeight="bold">
              <h1>Welcome to Objectways</h1>
            </MDTypography>
            {/* <MDTypography variant="caption" color="success" fontWeight="bold">
              <h2>Here whats happening in your account today</h2>
            </MDTypography> */}
            {/* <MDTypography component="a" href="#" type="button" color="info" fontWeight="medium">
            <h4> Whats New</h4>
          </MDTypography> */}
          </MDBox>
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-evenly"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            <Grid container alignItems="center">
              <Grid item>
                <MDBox component="img" src={cartoon} alt="cartoon" width="100%" mt={1} />
              </Grid>
              <Grid item>
                {/* <MDBox component="img" src={cartoon} alt="cartoon" width="100%" mt={1} /> */}
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}
// Greeting.propTypes = {
//   color: PropTypes.oneOf([
//     "primary",
//     "secondary",
//     "info",
//     "success",
//     "warning",
//     "error",
//     "light",
//     "dark",
//   ]).isRequired,
//   icon: PropTypes.node.isRequired,
//   name: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
// };
export default Greetings;
