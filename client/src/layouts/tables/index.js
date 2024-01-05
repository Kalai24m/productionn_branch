import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
// import MDInput from "components/MDInput";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import "react-datepicker/dist/react-datepicker.css";
// Attandance
import React, { useState } from "react";
import moment from "moment";
// import PropTypes from "prop-types";
// import { connect, useSelector } from "react-redux";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import { checkIn } from "../actions/checkActions";
// import { logoutUser } from "../actions/authActions";

function Tables() {
  const [ctime, setTime] = useState();
  const [checkT, setCheckT] = useState();
  const [total, setTotal] = useState();
  const [remain, setRemain] = useState();
  // const [outTime,setOutTime] = useState();
  const [isDisabled, setDisabled] = useState(false);

  function calc(checkoutTime) {
    // setInterval(()=>{})
    const time = new Date();
    // const checkoutTime = moment(ctime).add(570,'minutes').format('hh:mm a');
    const f = checkoutTime;
    console.log(checkoutTime);

    const a = moment(f, "hh:mm a");
    const b = moment(time, "hh:mm a");
    const c = moment.duration(a.diff(b));
    const d = `${c.hours()}hrs : ${c.minutes()}mins`;
    console.log(`${c.hours()}hrs : ${c.minutes()}mins`);
    setRemain(d);
  }

  //    useEffect(()=>{
  //         calc()
  //    },[])
  //    setInterval(()=>{calc()},60000)
  const onCheckout = (e) => {
    e.preventDefault();
    const cOut = new Date();
    const checkTime = moment(cOut).format("hh:mm a");
    setCheckT(checkTime);
    const a = moment(ctime, "hh:mm a");
    const b = moment(checkTime, "hh:mm a");
    const overAll = moment.duration(b.diff(a));
    console.log(overAll.minutes());
    setTotal(`${overAll.hours()}hrs : ${overAll.minutes()}mins`);
  };

  const onCheck = (e) => {
    e.preventDefault();
    const time = new Date();
    const checkoutTime = moment(time).add(570, "minutes").format("hh:mm a");
    console.log(checkoutTime);

    moment.defaultFormat = "hh:mm";
    console.log(time);
    const timeNow = moment(time).format("hh:mm a");
    console.log(timeNow);
    const a = moment("6:00 pm", "hh:mm a");
    const b = moment(time, "hh:mm a");
    const c = moment.duration(a.diff(b));
    calc(checkoutTime);
    // console.log(outTime)
    setInterval(() => {
      calc(checkoutTime);
    }, 60000);
    console.log(`${c.hours()}Hours &  Minutes ${c.minutes()}`);
    console.log(moment("08:30", moment.defaultFormat).fromNow());
    setTime(timeNow);
    setDisabled(true);
    // setOutTime(checkoutTime)
    // setTimeout(()=>{ var d = c.hours()+'Hours &  Minutes '+c.minutes();
    // console.log(c.hours()+'Hours &  Minutes '+c.minutes())
    // setRemain(d)},1000)
    // const check = {
    //   timeNow,
    // };
    // props.checkIn(check);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={6}>
        <MDBox mt={4} mb={8}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Card mb={3}>
                <MDBox
                  // mb={7}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MDTypography mt={2} mb={3} variant="caption" color="info" fontWeight="regular">
                    <h1>Employee Attendance</h1>
                  </MDTypography>
                  <MDBox
                    display="flex"
                    width="850px"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-evenly"
                  >
                    <Grid mt={3} item xs={12} md={6} lg={4}>
                      <MDButton
                        mb={3}
                        type="submit"
                        color="info"
                        onClick={onCheck}
                        disabled={isDisabled}
                      >
                        Check In!
                      </MDButton>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          mt={3}
                          // mb={3}
                          variant="caption"
                          color="dark"
                          fontWeight="regular"
                          flexDirection="column"
                        >
                          <h3>Time:{ctime}</h3>
                        </MDTypography>
                      </MDBox>
                    </Grid>
                    <Grid mt={3} item xs={12} md={6} lg={4}>
                      <MDButton type="submit" color="success" onClick={onCheckout}>
                        Check out!
                      </MDButton>
                      <MDBox display="flex" flexDirection="column">
                        <MDTypography
                          mt={3}
                          // mb={3}
                          variant="caption"
                          color="dark"
                          fontWeight="regular"
                          flexDirection="column"
                        >
                          <h3>Time:{checkT}</h3>
                        </MDTypography>
                      </MDBox>
                    </Grid>
                  </MDBox>
                </MDBox>
                {/* <Grid item xs={12} lg={8}> */}
                <MDBox mt={4} px={10} display="flex" flexDirection="column">
                  <MDTypography mb={1} variant="caption" color="dark" fontWeight="regular">
                    <h3>Over All Time: {total}</h3>
                  </MDTypography>

                  <MDTypography mb={3} variant="caption" color="dark" fontWeight="regular">
                    <h3>Remaning Time: {remain}</h3>
                  </MDTypography>
                </MDBox>
                {/* </Grid> */}
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Tables;
