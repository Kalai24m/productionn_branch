import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Card, TextField } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import moment from 'moment';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Popper from "@mui/material/Popper";
import FilterListIcon from "@material-ui/icons/FilterList";
// import Footer from 'examples/Footer';
import MDBox from 'components/MDBox';
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MDTypography from 'components/MDTypography';
import DialogContent from "@mui/material/DialogContent";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

function Attendance() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const name = useSelector((state) => state.auth.user.name);
  const empId = useSelector((state) => state.auth.user.empId);

  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/emp-attendance`)
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((item, index) => ({ ...item, id: index + 1 }));
        setAttendanceData(mappedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    setPopperOpen((prev) => !prev);
  };

  const handlePopperClose = () => {
    setPopperOpen(false);
  };

  const filteredData = attendanceData.filter((item) => {
    if (startDate && endDate) {
      const startDateTime = moment(startDate).startOf('day');
      const endDateTime = moment(endDate).endOf('day');
      const itemDateTime = moment(item.currentDate);

      return itemDateTime.isBetween(startDateTime, endDateTime, null, '[]');
    }
    return true;
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    {
      field: 'currentDate',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => moment(params.row.currentDate).format('YYYY-MM-DD'),
    },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 },
    { field: 'empId', headerName: 'Employee ID', width: 150, flex: 1 },
    { field: 'checkInTime', headerName: 'Check In', width: 150, flex: 1 },
    { field: 'checkOutTime', headerName: 'Check Out', width: 150 },
    { field: 'total', headerName: 'Total', width: 150 },

  ];


  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* <Grid container justifyContent="center">
        <Grid item xs={12} lg={8}>
          <Card mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <MDTypography mt={2} mb={3} variant="caption" color="info" fontWeight="regular">
                <h1>Employee Attendance</h1>
              </MDTypography>
            </MDBox>
          </Card>
        </Grid>
      </Grid> */}
      <Grid item xs={12} mt={2} mb={1}>
        <Card>
          <Box>
            <Popper
              open={popperOpen}
              // anchorEl={/* Provide the reference to the element that triggers the popper */}
              role={undefined}
              transition
              disablePortal
              style={{
                zIndex: 9999,
                position: "absolute",
                top: "125px",
                left: "0px",
              }}
            >
              {({ TransitionProps, placement }) => (
                <ClickAwayListener onClickAway={handlePopperClose}>
                  <Paper>
                    {/* <DialogTitle sx={{ textAlign: 'center' }}>Your Popper Title</DialogTitle> */}
                    <DialogContent>
                      <MDBox
                        component="form"
                        role="form"
                        // onSubmit={handleSubmit}
                        className="filter-popup"
                        sx={{ display: "flex", padding: "0px" }}
                      >
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography
                            variant="h6"
                            fontWeight="medium"
                            sx={{ fontSize: "15px" }}
                          >
                            Start Date
                          </MDTypography>
                          <MDInput
                            type="date"
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            value={startDate}
                          />
                        </MDBox>
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography
                            variant="h6"
                            // fontWeight="medium"
                            size="small"
                          >
                            End Date
                          </MDTypography>
                          <MDInput
                            id="movie-customized-option-demo"
                            type="date"
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            value={endDate}
                          />
                        </MDBox>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          pt={3}
                        >
                          <MDButton
                            variant="gradient"
                            size="small"
                            color="info"
                            type="submit"
                          >
                            Search
                          </MDButton>
                        </Box>
                      </MDBox>
                    </DialogContent>
                  </Paper>
                </ClickAwayListener>
              )}
            </Popper>
          </Box>
        </Card>
      </Grid>
      <Grid mt={4} mb={10}>
        <Card>
          <Box
            sx={{
              height: 480,
              width: "100%",
              "@media screen and (min-width: 768px)": {
                height: 670,
              },
            }}
          >
            <DataGrid
              rows={filteredData}
              columns={columns}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              components={{
                Toolbar: () => (
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "5px",
                        marginLeft: "10px",
                      }}
                    >
                      <FilterListIcon
                        className="team-filter-icon"
                        style={{
                          cursor: "pointer",
                          color: "#1a73e8",
                          fontSize: "20px",
                        }}
                        onClick={handlePopperToggle}
                        aria-label="Team Filter"
                      />
                      <MDTypography
                        variant="h6"
                        onClick={handlePopperToggle}
                        style={{
                          color: "#1a73e8",
                          cursor: "pointer",
                          fontSize: "12.1px",
                        }}
                      >
                        DATE FILTER
                      </MDTypography>
                    </div>

                    <GridToolbar />
                    {/* <div
                      style={{
                        display: "flex",
                        marginLeft: "auto",
                        alignItems: "center"
                      }}
                    >
                    <MDButton
                      className="team-report-btn"
                      variant="outlined"
                      color="error"
                      size="small"
                      style={{ marginRight: "13px" }}
                      onClick={allReport}
                    >
                      &nbsp;All Report
                    </MDButton>
                    </div> */}
                  </div>
                ),
              }}

            />
          </Box>
        </Card>
      </Grid>

      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Attendance;
