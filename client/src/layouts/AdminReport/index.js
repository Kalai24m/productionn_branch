import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDInput from "components/MDInput";
import IconButton from "@mui/material/IconButton";
import * as React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import IconButton from "@material-ui/core/IconButton";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import { useState, useEffect, useMemo } from "react";
import Button from '@material-ui/core/Button';
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import moment from "moment";
// import Drawer from "@mui/material/Drawer";
import FilterListIcon from "@material-ui/icons/FilterList";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import Dialog from "@mui/material/Dialog";
// import CloseIcon from "@mui/icons-material/Close";
// import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";

function AdminReport() {

  const apiUrl = process.env.REACT_APP_API_URL;
  const initialValues = {
    startDate: "",
    endDate: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);
  const [name, setName] = useState([]);
  const [empName, setEmpName] = useState(null);
  const [teamList, setTeamList] = useState(null);
  const [report, setReport] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleChange = (event, value) => setEmpName(value);
  const handleTeamChange = (event, value) => setTeamList(value);

  const allReport = (e) => {
    axios
      .get(`${apiUrl}/analyst`)
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(err));
  };
  // console.log(values.endDate)
  // console.log(empName)

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Function to handle opening the filter popup
  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  // Function to handle closing the filter popup
  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };
  const handleCancel = () => {
    // Reset all fields to their initial values
    setValues(initialValues);
    setEmpName(null);
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      startDate: values.startDate,
      endDate: values.endDate,
      empname: empName,
      team: teamList,
    };
    console.log(userData);

    const sDate = values.startDate;
    const eDate = values.endDate;
    const name = empName;
    const team = teamList;
    // console.log(name !== "");
    if (name == null && team == null) {
      axios
        .get(`${apiUrl}/fetch/report/date/?sDate=` + sDate + "&eDate=" + eDate)
        .then((res) => {
          setReport(res.data);
        })
        .catch((err) => console.log(err));
    } else if (name === null) {
      axios
        .get(
          `${apiUrl}/fetch/report/team/?sDate=${sDate}&eDate=${eDate}&team=${team}`
        )
        .then((res) => {
          // console.log(res.data);
          setReport(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    } else if (team === null) {
      axios
        .get(
          `${apiUrl}/fetch/report/user/?sDate=${sDate}&eDate=${eDate}&name=${name}`
        )
        .then((res) => {
          // console.log(res.data);
          setReport(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    } else {
      axios
        .get(
          `${apiUrl}/fetch/report/?sDate=${sDate}&eDate=${eDate}&name=${name}&team=${team}`
        )
        .then((res) => {
          // console.log(res.data);
          setReport(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    }
    setValues(initialValues);
    setEmpName(null);
    setTeamList(null);

    closeFilterDialog();
  };

  useEffect(() => {
    userName();
  }, []);

  const userName = () => {
    axios.get(`${apiUrl}/users`).then((res) => {
      setName(res.data);
    });
    // console.log(name);
  };
  const openDialog = (userData) => {
    setSelectedUserData(userData);
    setDialogOpen(true);
  };

  // Function to handle closing the dialog
  const closeDialog = () => {
    setSelectedUserData(null);
    setDialogOpen(false);
  };
  // tabel report
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "date",
      headerName: "Date",
      // type: 'date',
      width: 100,
      editable: false,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      editable: false,
      flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      width: 70,
      editable: false,
      flex: 1,
    },

    {
      field: "projectName",
      headerName: "Project Name",
      // type: 'time',
      width: 150,
      editable: false,
      flex: 1,
    },
    // {
    //   field: "task",
    //   headerName: "Task",
    //   // type: 'number',
    //   width: 200,
    //   editable: false,
    //   flex: 1.5,
    // },
    {
      field: "managerTask",
      headerName: "Project Manager",
      // type: 'number',
      width: 150,
      editable: false,
      flex: 1,
    },
    // {
    //   field: "sessionOne",
    //   headerName: "Hours",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton style={{ color: '#2196f3' }} onClick={() => openDialog(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
    // {
    //   field: "sessionTwo",
    //   headerName: "Session Two",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    // {
    //   field: "others",
    //   headerName: "Others",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    // {
    //   field: "comments",
    //   headerName: "Comments",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    // {
    //   field: "total",
    //   headerName: "Toltal Hours",
    //   // type: 'number',
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
  ];
  const row = useMemo(
    () =>
      report.map((item, index) => ({
        ...item,
        id: index + 1,
        name: item.name,
        team: item.team,
        date: moment(item.createdAt).format("DD-MM-YYYY"),
        // TotalTime: moment
        //   .utc(moment.duration(item.TotalTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        // ActiveTime: moment
        //   .utc(moment.duration(item.ActiveTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        // EntityTime: moment
        //   .utc(moment.duration(item.EntityTime, "seconds").as("milliseconds"))
        //   .format("HH:mm:ss"),
        projectName: item.projectName,
        task: item.task,
        managerTask: item.managerTask,
        sessionOne: item.sessionOne,
        // sessionTwo: item.sessionTwo,
        // others: item.others,
        // comments: item.comments,
        // total: item.total,
      })),
    [report]
  );

  // Team List
  const list = ["CV", "NLP", "CM", "SOURCING"];

  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    setPopperOpen((prev) => !prev);
  };

  const handlePopperClose = () => {
    setPopperOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Grid item xs={12} mb={1}>
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
                top: "120px",
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
                        onSubmit={handleSubmit}
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
                            name="startDate"
                            size="small"
                            sx={{ width: "100%" }}
                            value={values.startDate}
                            onChange={handleInputChange}
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
                            name="endDate"
                            size="small"
                            sx={{ width: "100%", border: "none !important" }}
                            value={values.endDate}
                            onChange={handleInputChange}
                          />
                        </MDBox>
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography variant="h6" fontWeight="medium">
                            Team
                          </MDTypography>
                          <Autocomplete
                            options={list}
                            onChange={handleTeamChange}
                            id="movie-customized-option-demo"
                            disableCloseOnSelect
                            sx={{ width: "100%" }}
                            PopperComponent={(props) => (
                              <Popper
                                {...props}
                                style={{ zIndex: 99999, position: "relative" }}
                              >
                                {props.children}
                              </Popper>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" />
                            )}
                          />
                        </MDBox>
                        <MDBox
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginRight: 2,
                          }}
                        >
                          <MDTypography variant="h6" fontWeight="medium">
                            User Name
                          </MDTypography>

                          <Autocomplete
                            options={name.map((option) => option.name)}
                            onChange={handleChange}
                            id="movie-customized-option-demo"
                            disableCloseOnSelect
                            sx={{ width: "100%" }}
                            PopperComponent={(props) => (
                              <Popper
                                {...props}
                                style={{ zIndex: 99999, position: "relative" }}
                              >
                                {props.children}
                              </Popper>
                            )}
                            renderInput={(params) => (
                              <TextField {...params} variant="standard" />
                            )}
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
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg">
  <DialogTitle
    style={{
      background: "#2196f3",
      color: "white",
      fontSize: "1.2rem",
      padding: "20px",
    }}
  >
    {"Task List"}
  </DialogTitle>
  <DialogContent>
    {selectedUserData && (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          style={{ fontSize: "1rem", marginTop: "10px", padding: "10px" }}
        >
          <strong style={{ fontSize: "18px" }}>
            Project Name:
          </strong>{" "}
          {selectedUserData.projectName}
        </Typography>
        <div
          style={{
            maxHeight: "300px", // Set a fixed height for the scrollable area
            overflow: "auto",  // Enable scrolling
            marginTop: "10px",
          }}
        >
          <table
            style={{
              width: "600px",
              borderCollapse: "collapse",
              fontSize: "1rem",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    minWidth: "150px",
                  }}
                >
                  Task Name
                </th>
                <th
                  style={{
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    minWidth: "150px",
                  }}
                >
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedUserData.sessionOne.map((session, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  >
                    {session.task}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    {session.sessionOne}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={closeDialog} color="primary">
      Cancel
    </Button>
  </DialogActions>
</Dialog>

      <Grid item xs={12} mb={10}>
        {/* <IconButton  onClick={openDrawer} color="primary" aria-label="Filter">
      <FilterListIcon />
    </IconButton> */}

        <MDBox pt={1}>
          <Grid item xs={12}>
            <Card>
              {/* <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Reports Table
                </MDTypography>
              </MDBox> */}
              <MDBox pt={0}>
                {/* <Datatable tableHead={mytableHead} dataSrc={mydataSrc} /> */}
                {/* <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                /> */}

                {/* <Box sx={{ height: 480, width: "100%" }}> */}
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
                    rows={row}
                    columns={columns}
                    // pageSize={10}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    checkboxSelection
                    disableSelectionOnClick
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
                          <div
                            style={{
                              display: "flex",
                              marginLeft: "auto",
                              alignItems: "center",
                              padding: "10px"
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
                          </div>
                        </div>
                      ),
                    }}
                  // components={{
                  //   Toolbar: () => (
                  //     <div style={{ display: 'flex' }}>
                  //       <GridToolbar />
                  //       {/* Custom filter icon with aria-label */}

                  //       <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }} >

                  //         <FilterListIcon
                  //           className="team-filter-icon"
                  //           // style={{ cursor: 'pointer', color: '#3a87ea', fontSize: '20px' }}
                  //           // onClick={openDrawer}
                  //           style={{ cursor: 'pointer', color: '#3a87ea', fontSize: '20px' }}
                  //           onClick={openFilterDialog}
                  //           aria-label="Team Filter"
                  //         />
                  //         <MDTypography variant="h6"  onClick={openFilterDialog} style={{ color: '#3a87ea', cursor: 'pointer', fontSize: '12.1px', marginRight: '10px', }}>
                  //           TEAM FILTER
                  //         </MDTypography>
                  //         <MDButton
                  //           className="team-report-btn"
                  //           variant="outlined"
                  //           color="error"
                  //           size="small"
                  //           style={{ marginRight: '13px' }}
                  //           onClick={allReport}
                  //         // onClick={() => setShow(!show)}
                  //         >
                  //           &nbsp;All Report
                  //         </MDButton>
                  //       </div>
                  //     </div>
                  //   ),
                  // }}
                  />
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </MDBox>
      </Grid>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}
export default AdminReport;
