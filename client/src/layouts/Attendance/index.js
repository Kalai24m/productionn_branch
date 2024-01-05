import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton/index";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import checkinImage from "../images/check-in.png";
import checkoutImage from "../images/check-out.png";
import Box from "@mui/material/Box";
import './calendar.css'

function Attendance() {

  const apiUrl = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [checkinTime, setCheckinTime] = useState(sessionStorage.getItem("checkinTime") || "");
  const [checkoutTime, setCheckoutTime] = useState(sessionStorage.getItem("checkoutTime") || "");
  const [checkinTimeForCheckout, setCheckinTimeForCheckout] = useState("");
  const [total, setTotal] = useState(sessionStorage.getItem("total") || "");
  const [remainingTime, setRemainingTime] = useState("");
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [resetTimeoutId, setResetTimeoutId] = useState(null);

  const [selectedAttendanceData, setSelectedAttendanceData] = useState([]);

  const dayCellRenderer = ({ date }) => {
    // Check if the date is the present date
    const isPresentDate = moment(date).isSame(moment(), "day");

    // Determine the symbol based on whether it is the present date or has attendance
    const symbol = selectedAttendanceData.find((item) => moment(item.currentDate).isSame(date, "day")) ? "P" : "A";

    // Apply different styles for days with and without attendance
    const cellStyle = {
      padding: "0px",
      textAlign: "center",
      fontWeight: "bold",
      color: isPresentDate ? "green" : symbol === "P" ? "green" : "red",
      cursor: "pointer", // Add cursor pointer for interaction
    };


    const handleDateClick = () => {
      // Toggle attendance on date click
      const updatedData = selectedAttendanceData.map((item) => {
        if (moment(item.currentDate).isSame(date, "day")) {
          return {
            ...item,
            hasAttendance: !item.hasAttendance,
          };
        }
        return item;
      });

      setSelectedAttendanceData(updatedData);
    };

    return (
      <div style={cellStyle} onClick={handleDateClick}>
        {symbol}
      </div>
    );
  };

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [empId, selectedDate]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetch/att-data?empId=${empId}`);

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data = await response.json();
      const mappedData = data.map((item) => ({ ...item, id: item._id, hasAttendance: true })); // Set hasAttendance to true for all dates

      // Filter data based on the selected date if it's set
      const filteredData = selectedDate
        ? mappedData.filter((item) => moment(item.currentDate).isSame(selectedDate, "day"))
        : mappedData;

      setAttendanceData(filteredData);
      setSelectedAttendanceData(mappedData); // Set the selected data for the DataGrid
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const columns = [
    { field: "id", headerName: "S.No", editable: false },
    {
      field: "currentDate",
      headerName: "Date",
      width: 120,
      valueGetter: (params) => moment(params.row.currentDate).format("YYYY-MM-DD"),
    },
    { field: "checkInTime", headerName: "Check In", width: 120, flex: 1 },
    { field: "checkOutTime", headerName: "Check Out", width: 120, flex: 1 },
    { field: "total", headerName: "Total", width: 120, flex: 1 },
    // { field: 'status', headerName: 'Status', width: 120, flex: 1 },

  ];

  const mappedData = attendanceData.map((item, index) => ({
    ...item,
    id: index + 1,
    name: item.name,
    empId: item.empId,
    status: item.checkOutTime ? 'Present' : 'Absent',
  }));

  const resetFunction = useCallback(() => {
    setCheckinTime("");
    setCheckoutTime("");
    setTotal("");
    setRemainingTime("");
    sessionStorage.removeItem("checkinTime");
    sessionStorage.removeItem("checkoutTime");
    sessionStorage.removeItem("total");
    setResetTimeoutId(null);

    // Clear existing timeout
    clearTimeout(resetTimeoutId);
  }, [resetTimeoutId]);


  useEffect(() => {
    if (resetTimeoutId) {
      const timeoutId = setTimeout(resetFunction, 3600000);

      return () => clearTimeout(timeoutId);
    }
  }, [resetTimeoutId, resetFunction]);



  const handleCheckin = async () => {
    try {
      const timeNow = moment().format("hh:mm a");

      setCheckinTime(timeNow);
      setCheckinTimeForCheckout(timeNow);

      sessionStorage.setItem("checkinTime", timeNow);
      sessionStorage.setItem("checkinTimeForCheckout", timeNow);
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("empId", empId);

      // Refresh data after check-in
      await fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleCheckout = async () => {
    try {
      const checkTime = moment().format("hh:mm a");
      setCheckoutTime(checkTime);

      // Ensure checkinTimeForCheckout is set correctly, use the current time if not set
      const checkinMoment = moment(sessionStorage.getItem("checkinTimeForCheckout") || moment(), "hh:mm a");
      const checkoutMoment = moment(checkTime, "hh:mm a");
      const overAll = moment.duration(checkoutMoment.diff(checkinMoment));

      setTotal(`${overAll.hours()}hrs : ${overAll.minutes()}mins`);

      sessionStorage.setItem("checkoutTime", checkTime);
      sessionStorage.setItem("name", name);
      sessionStorage.setItem("empId", empId);
      sessionStorage.setItem("total", `${overAll.hours()}hrs : ${overAll.minutes()}mins`);

      // Send check-out time to the server
      const response = await fetch(`${apiUrl}/att`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkInTime: sessionStorage.getItem("checkinTimeForCheckout") || checkTime,
          checkOutTime: checkTime,
          name: name,
          empId: empId,
          total: `${overAll.hours()}hrs : ${overAll.minutes()}mins`,
        }),
      });

      if (response.ok) {
        console.log("Checkout time saved successfully");

        // Reset function logic
        setResetTimeoutId(setTimeout(resetFunction, 3600000));
        await fetchData(); // Refresh data after check-out
      } else {
        console.error("Failed to save checkout time");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid item xs={12} mt={1}>
        <MDBox mt={2} mb={2}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
              >
                <MDTypography mb={3} style={{ marginRight: "80px" }} variant="caption" color="info" fontWeight="regular">
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
                      type="submit"
                      onClick={handleCheckin}
                      disabled={!!checkinTime}
                      style={{ marginLeft: "100px" }}
                    >
                      <img
                        src={checkinImage}
                        alt="Check In"
                        display="flex"
                        style={{ cursor: "pointer", marginBottom: "16px", width: "100%", maxWidth: "100px" }}
                      />
                    </MDButton>
                    <MDBox display="flex" flexDirection="column">
                      <MDTypography mt={3} variant="caption" color="dark" fontWeight="regular" style={{ marginLeft: "90px" }}>
                        <h3>Check-In Time: {checkinTime}</h3>
                      </MDTypography>
                    </MDBox>
                  </Grid>
                  <Grid mt={3} item xs={12} md={6} lg={4}>
                    <MDButton
                      type="submit"
                      onClick={handleCheckout}
                      disabled={!!checkoutTime}
                    >
                      <img
                        src={checkoutImage}
                        alt="Check Out"
                        style={{ cursor: "pointer", marginBottom: "16px", width: "100%", maxWidth: "100px" }}
                      />
                    </MDButton>
                    <MDBox display="flex" flexDirection="column">
                      <MDTypography mt={3} variant="caption" color="dark" fontWeight="regular" style={{ marginLeft: "0px" }}>
                        <h3>Check-Out Time: {checkoutTime}</h3>
                      </MDTypography>
                    </MDBox>
                  </Grid>
                </MDBox>
              </MDBox>
              {/* <MDBox mt={4} px={10} display="flex" flexDirection="column">
                <MDTypography mb={1} variant="h6" color="info" fontWeight="regular" style={{ marginLeft: "70px" }}>
                  <h3>Working Hours: {total}</h3>
                </MDTypography>
              </MDBox> */}
            </Grid>
          </Grid>
        </MDBox>
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} lg={7} xl={6}>
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            style={{
              height: '500', overflowY: 'auto', "@media screen and (min-width: 768px)": {
                height: '570',
              },
            }}
          >
            <Calendar
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                fetchData(); // Fetch data for the selected date
              }}
              dateFormat="yyyy-MM-dd"
              isClearable
              tileContent={({ date }) => dayCellRenderer({ date })}
            />
          </MDBox>
        </Grid>
        <Grid item xs={12} lg={5} xl={6}>
          <Card>
            <Box
              sx={{
                height: 480,
                width: "100%",
                "@media screen and (min-width: 768px)": {
                  height: 545,
                },
              }}
            >
              <DataGrid rows={mappedData} columns={columns} rowsPerPageOptions={[5, 10, 25, 50, 100]} components={{ Toolbar: () => <GridToolbar /> }} />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}

export default Attendance;