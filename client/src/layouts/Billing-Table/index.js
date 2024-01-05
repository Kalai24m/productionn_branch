import * as React from "react";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useState, useEffect, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DialogContent from "@mui/material/DialogContent";
import FilterListIcon from "@material-ui/icons/FilterList";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import CheckIcon from "@mui/icons-material/Check";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";

export default function ColumnGroupingTable() {

  const apiUrl = process.env.REACT_APP_API_URL;
  // drawer code
  const columns = [
    { field: "projectname", headerName: "Projectname", flex: 1 },
    { field: "team", headerName: "Department", flex: 1 },
    { field: "batch", headerName: "No.of.Members", flex: 1 },
    // { field: "reportDate", headerName: "StartDate", flex: 1 },
    // { field: "jobs.cDate", headerName: "EndDate", flex: 1 },
    // { field: "jobs.managerTeam", headerName: "Manager", flex: 1 },
    // { field: "jobs.status1", headerName: "Status", flex: 1 },
    {
      field: "reportDate",
      headerName: "StartDate",
      flex: 1,
      renderCell: (params) => (
        <div style={{ padding: "8px" }}>
          {moment(params.row.reportDate).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      field: "jobs.cDate",
      headerName: "EndDate",
      flex: 1,
      renderCell: (params) => (
        <div style={{ padding: "8px" }}>
          {moment(params.row.jobs?.cDate).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      field: "jobs.managerTeam",
      headerName: "Manager",
      flex: 1,
      renderCell: (params) => (
        <div style={{ padding: "8px" }}>
          {params.row.jobs?.managerTeam}
        </div>
      ),
    },
    {
      field: "jobs.status1",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <div
          style={{
            padding: "2px",
            borderBottom: `5px solid`,
            borderRadius: `5px `,
            color: statusColors[params.row.jobs?.status1],
          }}
        >
          {statusIcons[params.row.jobs?.status1]}
          {params.row.jobs?.status1}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => (
        <>
          <Link to={`/project-entry/edit/${params.row._id}`}>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>{" "}
          </Link>
          |
          <IconButton
            onClick={() => handleDelete(params.row._id)}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const [count, setCount] = useState({ aTotal: "" });
  const [bill, setBill] = useState({
    tDate: "",
    team: "",
    projectname: "",
    batch: "",
    jobs: {
      managerTeam: "",
      status1: "",
      cDate: "",
    },
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const openFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const closeFilterDialog = () => {
    setFilterDialogOpen(false);
  };
  const handleCancel = () => {
    setValues(initialValues);
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  const empId = useSelector((state) => state.auth.user.empId);
  const name = useSelector((state) => state.auth.user.name);

  const [teamList, setTeamList] = useState(null);
  const handleTeamChange = (event, value) => setTeamList(value);
  const [managers, setManagers] = useState([]);
  const handleManagerChange = (event, value) => setManagers(value);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBill({
      ...bill,
      [name]: value,
      team: teamList,
      // managerTeam: managerTeamList,
      // status1: status,
    });
  };



  const handleManagerTeamChange = (event, value) => {
    setBill({
      ...bill,
      jobs: {
        ...bill.jobs,
        managerTeam: event.target.value,
      },
    });
  };

  const handleStatusChange = (event) => {
    setBill({
      ...bill,
      jobs: {
        ...bill.jobs,
        status1: event.target.value,
      },
    });
  };

  useEffect(() => {
    setCount({
      ...count,
    });
  }, [bill]);
  const list = ["CV", "NLP", "CM", "Sourcing"];
  const submit = (e) => {
    e.preventDefault();

    const billData = {
      name: name,
      team: teamList,
      empId: empId,
      batch: bill.batch,
      reportDate: bill.tDate,
      projectname: bill.projectname,
      jobs: {
        managerTeam: managers,
        status1: bill.jobs.status1,
        cDate: bill.jobs.cDate,
      },
    };

    axios
      .post(`${apiUrl}/new`, billData)
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/billing?empId=${empId}`).then((response) => {
          setData(response.data);
        });
        axios.get(`${apiUrl}/fetch/addteam-data`).then((response) => {
          setTeamList(response.data);
        });

        axios.get(`${apiUrl}/fetch/manager-data`).then((response) => {
          setManagers(response.data);
        });
      })
      .catch((err) => toast.error(err));

    closeDrawer();

    // Reset the state to initial values
    setBill({
      tDate: "",
      team: "",
      projectname: "",
      batch: "",
      jobs: {
        managerTeam: "",
        status1: "",
        cDate: "",
      },
    });
  };


  // drawer code end

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${apiUrl}/billing/` + id)
      .then((res) => toast.warn(res.data))
      .catch((err) => console.log(err));
    setData(data.filter((el) => el._id !== id));
  };

  // card
  const initialValues = {
    startDate: "",
    endDate: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);

  const [teamlist, setTeamlist] = useState(null);
  // const [report, setReport] = useState([]);

  const handleInputchange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  // const handleChange = (event, value) => setEmpName(value);
  const handleTeamchange = (event, value) => setTeamlist(value);

  const [initialData, setInitialData] = useState([]);

  // Fetch initial data without filter
  // useEffect(() => {
  //   axios.get(`/billing/`).then((response) => {
  //     // Update initial data
  //     setInitialData(response.data);
  //   });
  // }, []);

  useEffect(() => {
    axios.get(`${apiUrl}/billing?empId=${empId}`).then((response) => {
      // Update initial data
      setInitialData(response.data);
      setData(response.data);
    });
    axios.get(`${apiUrl}/fetch/addteam-data`).then((response) => {
      setTeamList(response.data);
    });
    axios.get(`${apiUrl}/fetch/manager-data`).then((response) => {
      setManagers(response.data);
    });
  }, []); // Remove dependencies from the dependency array


  
  // useEffect(() => {
  //   axios.get(`/billing/`).then((response) => {
  //     // Update initial data
  //     setInitialData(response.data);
  //     setData(response.data);
  //   });
  //   axios.get("/create/fetch/addteam-data").then((response) => {
  //     setTeamList(response.data);
  //   });
  //   axios.get("/create/fetch/manager-data").then((response) => {
  //     setManagers(response.data);
  //   });
  // }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    const sDate = values.startDate;
    const eDate = values.endDate;
    const team = teamlist;

    if (team == null) {
      axios
        .get(`${apiUrl}/fetch/date/?sDate=` + sDate + "&eDate=" + eDate)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(
          `${apiUrl}/fetch/report/?sDate=` +
          sDate +
          "&eDate=" +
          eDate +
          "&team=" +
          team
        )
        .then((res) => {
          // console.log(res.data);
          setData(res.data);
        })
        .catch((err) => console.log(`Error:${err}`));
    }
  };
  // const allReport = (e) => {
  //   axios
  //     .get("/billing/")
  //     .then((res) => setData(res.data))
  //     .catch((err) => console.log(err));
  //   // setData(data.filter((el) = > el._id !== id));
  // };
  const formattedData = useMemo(() => {
    const reversedData = data.map((row) => ({
      ...row,
      id: row._id,
    }));
    reversedData.reverse();
    return reversedData;
  }, [data]);
  // Team List
  const List = ["CV", "NLP", "CM", "Sourcing"];
  const [popperOpen, setPopperOpen] = useState(false);

  const handlePopperToggle = () => {
    setPopperOpen((prev) => !prev);
  };

  const handlePopperClose = () => {
    setPopperOpen(false);
  };
  const statusIcons = {
    "POC": <SelfImprovementIcon />,
    "NOT-Started": <SelfImprovementIcon />,
    "Training": <SelfImprovementIcon />,
    "In-Progress": <DirectionsRunIcon />,
    "Completed-Won": <CheckIcon />,
    "Completed-Lost": <CloseIcon />,
  };
  const statusColors = {
    "POC": "#2196F3", // Blue
    "NOT-Started":"#979700",//dark yellow
    "Training": "#9F00FF", // purple
    "In-Progress": "#FF9800", // orange
    "Completed-Won": "#8BC34A", // Light Green
    "Completed-Lost": "#FF5722", // Deep Orange
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <MDButton
          variant="gradient"
          color="success"
          startIcon={<AddCircleOutlineIcon />}
          onClick={openDrawer}
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "0.7rem",
            borderRadius: "10px",
            textAlign: "center",
            minHeight: "10px",
            minWidth: "120px",
          }}
        >
          Create Project
        </MDButton>
      </div>
      <Drawer
        anchor="right"
        PaperProps={{
          style: {
            width: 712,
            backgroundColor: "#fff",
            color: "rgba(0, 0, 0, 0.87)",
            boxShadow:
              "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            flex: "1 0 auto",
            zIndex: 1200,
            WebkitOverflowScrolling: "touch",
            position: "fixed",
            top: 0,
            outline: 0,
            margin: "0",
            border: "none",
            borderRadius: "0",
            padding: "23px",
          },
        }}
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <MDBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">New Project</Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }}
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <MDBox>
              <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="project-name">
                Project Name
              </InputLabel>
              <TextField
                sx={{ width: 305, mt: 1, ml: 2 }}
                id="project-name"
                variant="outlined"
                fullWidth
                name="projectname"
                value={bill.projectname}
                onChange={handleInputChange}
                required
              />
            </MDBox>
            <MDBox sx={{ width: 730, ml: 2, mt: 1 }}>
              <InputLabel htmlFor="department">Department</InputLabel>
              {/* <Autocomplete
                disablePortal
                id="department"
                options={list}
                onChange={handleTeamChange}
                sx={{
                  width: 305,
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    padding: 0.5,
                  },
                }}
                renderInput={(params) => <TextField {...params} />}
                required
              /> */}
              <Autocomplete
                disablePortal
                id="department"
                name="team"
                options={(Array.isArray(teamList) ? teamList : []).map((addteam) => addteam.createTeam)}
                onChange={handleTeamChange}
                sx={{
                  width: 305,
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    padding: 0.5,
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required  // Add this line for validation
                  />
                )}
              />
            </MDBox>
          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 2, ml: 2 }} htmlFor="manager">
              Manager
            </InputLabel>
            <InputLabel sx={{ mt: 2, mr: 28 }} htmlFor="members">
              No.of.Resources
            </InputLabel>
          </MDBox>
          <MDBox sx={{ display: 'flex', alignItems: 'center', p: 1, ml: 1 }}>
            {/* <TextField
              sx={{ width: 305 }}
              select
              fullWidth
              id="manager"
              name="managerTeam"
              value={bill.jobs.managerTeam}
              required
              onChange={handleManagerTeamChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Manager</option>
              <option value="Balamurugan">Balamurugan</option>
              <option value="Rajesh">Rajesh</option>
              <option value="Naveen">Naveen</option>
              <option value="Sowmiya">Sowmiya</option>
            </TextField> */}
            <Autocomplete
              disablePortal
              id="manager"
              name="managerTeam"
              options={(Array.isArray(managers) ? managers : []).map((addmanager) => addmanager.createManager)}
              onChange={handleManagerChange}
              sx={{
                width: 305,
                "& .MuiOutlinedInput-root": {
                  padding: 0.5,
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required  // Add this line for validation
                />
              )}
            />
            <TextField
              sx={{ width: 305, ml: 2 }}
              type="number"
              id="members"
              variant="outlined"
              fullWidth
              name="batch"
              value={bill.batch}
              required
              onChange={handleInputChange}
            />
          </MDBox>
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 2, ml: 2 }} htmlFor="start-date">
              Start date
            </InputLabel>
            <InputLabel sx={{ mt: 2, mr: 34 }} htmlFor="end-date">
              End date
            </InputLabel>
          </MDBox>
          <MDBox sx={{ p: 1, ml: 1 }}>
            <TextField
              sx={{ width: 305 }}
              type="date"
              variant="outlined"
              id="start-date"
              fullWidth
              name="tDate"
              value={bill.tDate}
              onChange={handleInputChange}
              required
            />
            <TextField
              sx={{ width: 305, ml: 2 }}
              type="date"
              variant="outlined"
              id="end-date"
              fullWidth
              name="cDate"
              value={bill.cDate}
              onChange={handleInputChange}
              required
              disabled
            />
          </MDBox>
          <MDBox sx={{ width: 200, p: 1, mt: 3, ml: 1 }}>
            <InputLabel htmlFor="status">Status</InputLabel>
            <TextField
              sx={{ width: 625, mt: 1, mr: 1 }}
              select
              fullWidth
              id="status"
              name="status1"
              value={bill.jobs.status1}
              required
              onChange={handleStatusChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Status</option>
              <option value="NOT-Started">NOT Started</option>
              <option value="Training">Training</option>
              <option value="POC">POC</option>
              <option value="In-Progress">In Progress</option>
              <option value="Completed-Won">Completed Won</option>
              <option value="Completed-Lost">Completed Lost</option>
            </TextField>
          </MDBox>
          <MDBox
            pt={1}
            px={1}
            display="flex"
            justifycontent="center"
            alignItems="center"
          >
            <Grid>
              <Grid>
                <MDBox
                  pt={1}
                  pb={1}
                  px={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <MDButton variant="gradient" color="success" type="submit">
                    &nbsp;Save
                  </MDButton>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      </Drawer>
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
                top: "100px",
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
                            onChange={handleInputchange}
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
                            onChange={handleInputchange}
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
                            onChange={handleTeamchange}
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

      <Grid item xs={12} mt={1} mb={10}>
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
              rows={formattedData}
              getRowId={(row) => row._id}
              columns={columns}
              // columns={columns.map((column) => {
              //   if (column.field === "reportDate") {
              //     return {
              //       ...column,
              //       renderCell: (params) => (
              //         <TableCell style={{ padding: 0 }}>
              //           {moment(params.row.reportDate).format("DD/MM/YYYY")}
              //         </TableCell>
              //       ),
              //     };
              //   }

              //   if (column.field === "jobs.managerTeam") {
              //     return {
              //       ...column,
              //       renderCell: (params) => (
              //         <TableCell style={{ padding: 0 }}>
              //           {params.row.jobs?.managerTeam}
              //         </TableCell>
              //       ),
              //     };
              //   }

              //   if (column.field === "jobs.status1") {
              //     return {
              //       ...column,
              //       renderCell: (params) => (
              //         //   <TableCell style={{ backgroundColor: statusColors[params.row.jobs?.status1] }}>
              //         //   {statusIcons[params.row.jobs?.status1]}
              //         //   {params.row.jobs?.status1}
              //         // </TableCell>
              //         <TableCell
              //           style={{
              //             padding: "2px",
              //             borderBottom: `5px solid`,
              //             borderRadius: `5px `,
              //             color: statusColors[params.row.jobs?.status1],
              //           }}
              //         >
              //           {statusIcons[params.row.jobs?.status1]}
              //           {params.row.jobs?.status1}
              //         </TableCell>
              //       ),
              //     };
              //   }
              //   if (column.field === "jobs.cDate") {
              //     return {
              //       ...column,
              //       renderCell: (params) => (
              //         <TableCell style={{ padding: 0 }}>
              //           {moment(params.row.jobs?.cDate).format("DD/MM/YYYY")}
              //         </TableCell>
              //       ),
              //     };
              //   }

              //   return column;
              // })}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              checkboxSelection
              disableSelectionOnClick
              //  disableColumnMenu
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
      <ToastContainer />
    </DashboardLayout>
  );
}
