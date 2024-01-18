import React, { useState, useEffect } from "react";
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
import './calendar.css';

function Attendance() {
  const apiUrl = "http://localhost:5000";
  const dispatch = useDispatch();
  const [checkinTime, setCheckinTime] = useState(localStorage.getItem("checkinTime") || "");
  const [checkoutTime, setCheckoutTime] = useState(localStorage.getItem("checkoutTime") || "");
  const [total, setTotal] = useState(localStorage.getItem("total") || "");
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isCheckinButtonDisabled, setCheckinButtonDisabled] = useState(
    localStorage.getItem("isCheckinButtonDisabled") === "true" || false
  );

  const [isCheckoutButtonDisabled, setCheckoutButtonDisabled] = useState(
    localStorage.getItem("isCheckoutButtonDisabled") === "true" || false
  );
  const [selectedAttendanceData, setSelectedAttendanceData] = useState([]);

  const dayCellRenderer = ({ date }) => {
    // Check if the date is in the past or today
    const isPastOrPresentDate = moment(date).isSameOrBefore(moment(), "day");

    // Find the attendance data for the current date
    const attendanceDataForDate = selectedAttendanceData.find((item) =>
      moment(item.currentDate).isSame(date, "day")
    );

    // Determine the symbol based on whether it is in the past or today and has attendance
    const symbol =
      isPastOrPresentDate && attendanceDataForDate ? "P" : isPastOrPresentDate ? "A" : "";

    // Apply fixed padding for all cells
    const cellStyle = {
      padding: "9px", // Set your desired fixed padding value here
      textAlign: "center",
      fontWeight: "bold",
      color: isPastOrPresentDate ? (symbol === "P" ? "green" : "red") : "unset",
      cursor: "not-allowed", // Add cursor style for future dates
    };

    const handleDateClick = () => {
      if (isPastOrPresentDate && !attendanceDataForDate) {
        // Toggle attendance on date click only for past or present dates without data
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
      }
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
  ];

  const mappedData = attendanceData.map((item, index) => ({
    ...item,
    id: index + 1,
    name: item.name,
    empId: item.empId,
    status: item.checkOutTime ? 'Present' : 'Absent',
  }));

  const fetchLatestCheckinAndCheckout = async () => {
    try {
      const response = await fetch(`${apiUrl}/att/latest?empId=${empId}`);
      if (response.ok) {
        const data = await response.json();
        setCheckinTime(data.latestCheckin);
        setCheckoutTime(data.latestCheckout);
      } else {
        console.error("Failed to fetch latest check-in and check-out data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLatestCheckinAndCheckout();
  }, [empId, selectedDate]);

  const handleCheckin = async () => {
    try {
      // Set the check-in button to disabled
      setCheckinButtonDisabled(true);
      localStorage.setItem("isCheckinButtonDisabled", "true");

      // Define 'timeNow'
      const timeNow = moment().format("hh:mm a");

      // Send check-in time to the server
      const response = await fetch(`${apiUrl}/att/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          empId,
          checkInTime: timeNow,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Check-in time saved successfully");

        // Update the latest check-in time in the component state
        setCheckinTime(data.latestCheckin);
      } else {
        console.error("Failed to save check-in time");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      // Set the check-out button to disabled
      setCheckoutButtonDisabled(true);
      localStorage.setItem("isCheckoutButtonDisabled", "true");

      // Define 'checkTime'
      const checkTime = moment().format("hh:mm a");

      // Send check-out time to the server
      const response = await fetch(`${apiUrl}/att/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empId,
          checkOutTime: checkTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Check-out time saved successfully");

        // Update the latest check-out time and total in the component state
        setCheckoutTime(data.latestCheckout);
        setTotal(data.latestTotal);

        await fetchData(); // Refresh data after check-out
      } else {
        console.error("Failed to save check-out time");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Enable the check-in and check-out buttons again after 1 hour
      setTimeout(() => {
        setCheckinButtonDisabled(false);
        localStorage.setItem("isCheckinButtonDisabled", "false");

        setCheckoutButtonDisabled(false);
        localStorage.setItem("isCheckoutButtonDisabled", "false");
      }, 3600000); // 1 hour in milliseconds
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
                      style={{ marginLeft: "100px" }}
                      disabled={isCheckinButtonDisabled}
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
                      disabled={isCheckoutButtonDisabled}
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

