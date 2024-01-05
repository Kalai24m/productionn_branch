import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import CardContent from "@mui/material/CardContent";
import * as React from "react";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { useState, useMemo, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useSelector } from "react-redux";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import moment from "moment";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import FilterListIcon from "@material-ui/icons/FilterList";
import DialogContent from "@mui/material/DialogContent";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
function Report() {

  const apiUrl = process.env.REACT_APP_API_URL;
  // task page code start
  const [data, setData] = useState([]);
  const [disable, setDisable] = useState(true);
  const [teamlist, setTeamlist] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [projectNames, setProjectNames] = useState([]);
  const [managers, setManagers] = useState([]);
  const name = useSelector((state) => state.auth.user.name);
  const empid = useSelector((state) => state.auth.user.empId);
  const initialvalues = {
    team: "",
    projectName: "",
    task: "",
    managerTask: "",
    dateTask: "",
    sessionOne: "",
  };
  const [value, setValue] = useState(initialvalues);
  const handleTeamchange = (event, value) => setTeamlist(value);
  const handleTaskChange = (index, event, value) => {
    const newTasks = [...tasks];
    newTasks[index].task = value; // Assuming you want to update the 'task' property here
  
    // Update the state with the new tasks
    setTasks(newTasks);
  };
  
  const handleInputchange = (e) => {
    const { name, value: inputValue } = e.target;

    setValue((prevValue) => ({
      ...prevValue,
      [name]: inputValue,
    }));
  };

  const [tasks, setTasks] = useState([
    {
      task: "",
      sessionOneHours: "",
      sessionOneMinutes: "",
    },
  ]);

  const handleTaskInputChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index][event.target.name] = event.target.value;
    setTasks(newTasks);
  };

  const handleAddTaskField = () => {
    setTasks([...tasks, { task: "", sessionOneHours: "", sessionOneMinutes: "" }]);
  };

  const handleRemoveTaskField = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };

  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);

    // Reset project name and managerTask when the drawer is closed
    setValue((prevValues) => ({
      ...prevValues,
      projectName: "",
      managerTask: "",
      sessionOne: "",
      // sessionMinute: ''
    }));
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
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  // Define getCurrentDate function
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios.get(`${apiUrl}/admin`).then((response) => {
      const projects = response.data.map((item) => item.projectname);
      const managers = response.data
        .map((item) => item.jobs?.managerTeam)
        .filter(Boolean);
      axios.get(`${apiUrl}/fetch/task-data`).then((response) => {
        setTaskList(response.data);
      });
      setProjectNames(projects);
      setManagers(managers);

      const currentDate = getCurrentDate();

      // Find the selected project in the response data
      const selectedProject = response.data.find(
        (item) => item.projectname === value.projectName
      );

      if (selectedProject) {
        const projectManager = selectedProject.jobs?.managerTeam;
        const projectTeam = selectedProject.team; // Assuming the team information is available in the API response

        setValue((prevValues) => ({
          ...prevValues,
          dateTask: currentDate,
          managerTask: projectManager || "",
          team: projectTeam || "", // Set the team based on the selected project
        }));
      } else {
        // Reset date, manager, and team when another project name is selected
        setValue((prevValues) => ({
          ...prevValues,
          dateTask: "",
          managerTask: "",
          team: "", // Reset team value
        }));
      }
    });
  }, [value.projectName]);


  // Upload Data
  const submit = (e) => {
    e.preventDefault();
  
    // const tasksData = tasks.map((task) => ({
    //   task: task.task,
    //   sessionOne: `${task.sessionOneHours}:${task.sessionOneMinutes || "00"}`,
    // }));
  
    const userData = {
      name,
      empId,
      team: value.team,
      projectName: value.projectName,
      managerTask: value.managerTask,
      dateTask: value.dateTask,
      sessionOne: tasks.map((task) => ({
        task: task.task,
        sessionOne: `${task.sessionOneHours}:${task.sessionOneMinutes || "00"}`,
      })),
    };
  
    axios
      .post(`${apiUrl}/add`, userData)
      .then(() => {
        toast.success("Successfully Data Submitted 👌");
        closeDrawer();
        fetchData();
        axios
          .get(`${apiUrl}/fetch/userdata/?empId=${empId}`)
          .then((response) => {
            setInitialData(response.data);
          });
      })
      .catch((err) =>
        toast.error(`Try Again Followed Error Acquired: ${err}☹️`)
      );
  };
  
  const listtask = ["CV", "NLP", "CM"];

  const tasklist = [
    "Initial Annotation-Billable",
    "QC Annotation-Billable",
    "Project Training-Billable",
    "Spot QC-Non Billable",
    "Other-Interval Tracking -Billable",

    "Guidelines",
    "POC",
  ];

  // task page code end

  // const { columns, rows } = authorsTableData();
  const initialValues = {
    startDate: "",
    endDate: "",
    empname: "",
    team: "",
  };
  const [values, setValues] = useState(initialValues);
  const [report, setReport] = useState([]);
  const [teamList, setTeamList] = useState(null);
  const [reversedRows, setReversedRows] = useState([]);
  const empId = useSelector((state) => state.auth.user.empId);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleTeamChange = (event, value) => setTeamList(value);
  const [show, setShow] = useState(false);

  const [initialData, setInitialData] = useState([]);

  // Fetch initial data without filter
  // Fetch initial data
  useEffect(() => {
    axios.get(`${apiUrl}/fetch/userdata/?empId=${empId}`).then((response) => {
      setInitialData(response.data);
    });
  }, [empId]);

  const openDialog = (userData) => {
    setSelectedUserData(userData);
    setDialogOpen(true);
  };

  // Function to handle closing the dialog
  const closeDialog = () => {
    setSelectedUserData(null);
    setDialogOpen(false);
  };
  // Fetch data when a new task is submitted
  const fetchData = () => {
    console.log("Start Date:", values.startDate);
    console.log("End Date:", values.endDate);
    console.log("Team List:", teamList);

    axios
      .get(
        `${apiUrl}/fetch/user-data/?sDate=${values.startDate}&eDate=${values.endDate}&empId=${empId}&team=${teamList}`
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error:${err}`));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      startDate: values.startDate,
      endDate: values.endDate,
      team: teamList,
    };
    // console.log(userData);
    fetchData();
    axios
      .get(
        `${apiUrl}/fetch/user-data/?sDate=${values.startDate}&eDate=${values.endDate}&empId=${empId}&team=${teamList}`
      )
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.log(`Error:${err}`));

    setValues(initialValues);
    setTeamList(null);

    closeFilterDialog();
  };

  // tabel report

  const initialDataColumns = [
    {
      field: "dateTask",
      headerName: "Date",
      width: 130,
      editable: false,
      flex: 1,
      valueFormatter: (params) => {
        return moment(params.value).format("DD-MM-YYYY");
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 50,
      editable: false,
      flex: 1,
    },
    {
      field: "projectName",
      headerName: "Project Name",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "team",
      headerName: "Team",
      width: 50,
      editable: false,
      flex: 1,
    },
    // {
    //   field: "task",
    //   headerName: "Task",
    //   width: 150,
    //   editable: false,
    //   flex: 1,
    // },
    {
      field: "managerTask",
      headerName: "Project Manager",
      width: 150,
      editable: false,
      flex: 1,
    },
    // {
    //   field: "sessionOne",
    //   headerName: "Hours",
    //   width: 110,
    //   editable: false,
    // },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => openDialog(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    ...initialDataColumns,
  ];

  useEffect(() => {
    const reversedRowsData =
      report.length === 0
        ? initialData
          .slice()
          .reverse()
          .map((item, index) => ({
            ...item,
            id: index + 1,
            name: item.name,
            team: item.team,
            date: moment(item.createdAt).format("DD-MM-YYYY"),
            projectName: item.projectName,
            task: item.task,
            managerTask: item.managerTask,
            sessionOne: item.sessionOne,
            // sessionMinute: item.sessionMinute,
          }))
        : report.slice().reverse() || [];

    setReversedRows(reversedRowsData);
  }, [report, initialData]);
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
            // padding: "6px 12px", // Adjusted padding
            fontSize: "0.7rem", // Adjusted font size
            borderRadius: "10px",
            textAlign: "center",
            minHeight: "10px", // Adjust the height as needed
            minWidth: "120px", // Adjust the width as needed
          }}
        >
          Create Task
        </MDButton>
      </div>

      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="md">
  <DialogContent>
    <IconButton
      edge="end"
      color="inherit"
      onClick={closeDialog}
      aria-label="close"
      sx={{ position: "absolute", right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
    {selectedUserData && (
      <div style={{ padding: '16px' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: '#fff', backgroundColor: '#3a87ea', padding: '8px' }}>
          Employee Details
        </Typography>
        <Typography>
          <strong style={{ display: 'inline-block', width: '150px' }}>Emp ID:</strong> {selectedUserData.empId}
        </Typography>
        <Typography>
          <strong style={{ display: 'inline-block', width: '150px' }}>Team:</strong> {selectedUserData.team}
        </Typography>
        <Typography>
          <strong style={{ display: 'inline-block', width: '150px' }}>Project Name:</strong> {selectedUserData.projectName}
        </Typography>
        <Typography>
          <strong style={{ display: 'inline-block', width: '150px' }}>Manager Task:</strong> {selectedUserData.managerTask}
        </Typography>
        <Typography>
          <strong style={{ display: 'inline-block', width: '150px' }}>Date Task:</strong> {new Date(selectedUserData.dateTask).toLocaleDateString()}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '16px', marginBottom: '8px', textAlign: 'center', color: '#fff', backgroundColor: '#3a87ea', padding: '8px' }}>
        Task List
        </Typography>
        {selectedUserData.sessionOne.map((session, index) => (
          <div key={index} style={{ marginLeft: '20px', marginBottom: '10px' }}>
            <Typography>
              <strong style={{ display: 'inline-block', width: '150px' }}>Task:</strong> {session.task}
            </Typography>
            <Typography>
              <strong style={{ display: 'inline-block', width: '150px' }}>Hours:</strong> {session.sessionOne}
            </Typography>
          </div>
        ))}
      </div>
    )}
  </DialogContent>
</Dialog>

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
            mb: 2, // Adjusted margin-bottom
          }}
        >
          <Typography variant="h6">New Task</Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }} // Positioned to the top right corner
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="project-name">Select Project Name</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              id="project-name"
              options={projectNames}
              value={value.projectName}
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  projectName: newValue,
                });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="department">Department</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              disablePortal
              id="combo-box-demo"
              options={list}
              value={
                value.projectName === "Not assigned-CV"
                  ? "CV"
                  : value.projectName === "Not assigned-NLP"
                    ? "NLP"
                    : value.team
              }
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  team: newValue,
                });
              }}
              renderInput={(params) => <TextField {...params} />}
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
            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="task">
              Task
            </InputLabel>
            <InputLabel sx={{ mt: 1, ml: 21.5 }} htmlFor="hour">
              Hour
            </InputLabel>
            <InputLabel sx={{ mt: 1, mr: 14.4 }} htmlFor="minute">
              Minute
            </InputLabel>
            <IconButton onClick={handleAddTaskField}>
          <AddCircleOutlineIcon />
        </IconButton>
          </MDBox>
          {tasks.map((task, index) => (
          <MDBox
            sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
          >
   <Autocomplete
      disablePortal
      id={`task_${index}`} // Unique ID for each Autocomplete
      name={`createTask_${index}`} // Unique name for each Autocomplete
      options={(Array.isArray(taskList) ? taskList : []).map(
        (task) => task.createTask
      )}
      onChange={(event, value) => handleTaskChange(index, event, value)}
      sx={{ width: "46%", mt: 1 }}
      renderInput={(params) => <TextField {...params} />}
    />
            <FormControl sx={{ minWidth: 120, width: "24%", ml: 1 }}>
              <TextField
                id="sessionOneHours"
                name="sessionOneHours"
                // value={value.sessionOne.split(":")[0]}
                sx={{ width: "100%", p: 1.5 }}
                value={task.sessionOneHours}
                onChange={(e) => handleTaskInputChange(index, e)}
                variant="outlined"
                select
                SelectProps={{
                  native: true,
                  IconComponent: () => <></>,
                }}
              >
                <option value="" disabled>
                  Hours
                </option>
                {[...Array(13).keys()].slice(1).map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </TextField>
            </FormControl>
            <FormControl sx={{ minWidth: 120, width: "24%" }}>
              <TextField
                id="sessionOneMinutes"
                name="sessionOneMinutes"
                // value={value.sessionOne.split(":")[1] || ""}
                sx={{ width: "100%", p: 1.5 }}
                value={task.sessionOneMinutes}
                onChange={(e) => handleTaskInputChange(index, e)}
                variant="outlined"
                select
                SelectProps={{
                  native: true,
                  IconComponent: () => <></>,
                }}
              >
                <option value="" disabled>
                  Minutes
                </option>
                <option value="00">00</option>
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="45">45</option>
              </TextField>
            </FormControl>
            <IconButton onClick={() => handleRemoveTaskField(index)}>
            <CloseIcon />
          </IconButton>
          </MDBox>
       ))}
          <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="manager">
              Manager
            </InputLabel>
            <InputLabel sx={{ mt: 1, mr: 37 }} htmlFor="date">
              Date
            </InputLabel>
          </MDBox>
          <MDBox
            sx={{ p: 1, ml: 1 }}
            style={{
              display: "flex",
            }}
          >
            <Autocomplete
              fullWidth
              id="manager"
              options={managers}
              value={value.managerTask}
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  managerTask: newValue,
                });
              }}
              sx={{ width: 305 }}
              renderInput={(params) => <TextField {...params} />}
            />

            <TextField
              sx={{ width: 305, ml: 2 }}
              style={{
                display: "flex",
              }}
              id="date"
              variant="outlined"
              fullWidth
              type="date"
              name="dateTask"
              value={value.dateTask}
              onChange={handleInputchange}
            />
          </MDBox>

          <MDBox
            pt={3}
            px={2}
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <MDButton type="submit" color="success">
              Save
            </MDButton>
          </MDBox>
        </MDBox>
      </Drawer>

      <Grid item xs={12} mb={5}>
        {/* <Card> */}
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
                  top: "131px",
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
                                  style={{
                                    zIndex: 99999,
                                    position: "relative",
                                  }}
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
        {/* </Card> */}
        {/* {show ? ( */}
        <MDBox pt={4}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={0}>
                {/* <Box sx={{ height: 500, width: "100%", display: "flex", borderRadius: 20 }}> */}
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
                    rows={reversedRows}
                    columns={report.length === 0 ? initialDataColumns : columns} // Use initialDataColumns when report is empty
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    getRowId={(row) => row._id}
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
                            }}
                          >
                            {/* <MDButton
                            className="team-report-btn"
                            variant="outlined"
                            color="error"
                            size="small"
                            style={{ marginRight: "13px" }}
                            onClick={allReport}
                          >
                            &nbsp;All Report
                          </MDButton> */}
                          </div>
                        </div>
                      ),
                    }}
                  />
                </Box>
              </MDBox>
            </Card>
          </Grid>
        </MDBox>
        {/* ) : null} */}
      </Grid>
      {/* <Footer /> */}
      <ToastContainer />
    </DashboardLayout>
  );
}

export default Report;




// 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CardActionArea, CardActions, IconButton } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MDButton from 'components/MDButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';
import * as XLSX from 'xlsx';

const TaskWiseBarChart = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const getCurrentMonthStartDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  };

  const getCurrentMonthEndDate = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  };

  const [startDate, setStartDate] = useState(getCurrentMonthStartDate());
  const [endDate, setEndDate] = useState(getCurrentMonthEndDate());
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [tableData, setTableData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // New state variables
  const [idleNonBillableCount, setIdleNonBillableCount] = useState(0);
  const [idleBillableCount, setIdleBillableCount] = useState(0);
  const [productionCount, setProductionCount] = useState(0);

  // New state variable for Pie Chart
  const [pieChartData, setPieChartData] = useState({
    labels: ['Idle - Non Billable', 'Idle - Billable', 'Production'],
    datasets: [
      {
        data: [0, 0, 0], // Initial percentages set to 0
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  });

  useEffect(() => {
    const fetchProjectNames = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projectNames`);
        const projectNames = response.data;
        setProjectNames(projectNames);
      } catch (error) {
        console.error('Error fetching project names:', error);
      }
    };

    fetchProjectNames();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchPieChartData = () => {
      const total = idleNonBillableCount + idleBillableCount + productionCount;

      const percentages = [
        (idleNonBillableCount / total) * 100,
        (idleBillableCount / total) * 100,
        (productionCount / total) * 100,
      ];

      setPieChartData((prevData) => ({
        ...prevData,
        datasets: [
          {
            data: percentages,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      }));
    };

    fetchPieChartData();
  }, [idleNonBillableCount, idleBillableCount, productionCount]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate || !endDate)  {
          setChartData({
            labels: [],
            datasets: [],
          });
          setTableData([]);
          setIdleNonBillableCount(0);
          setIdleBillableCount(0);
          setProductionCount(0);
          return;
        }

        let response;
        if (selectedProject) {
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split('T')[0],
              eDate: endDate.toISOString().split('T')[0],
              projectName: selectedProject,
            },
          });
        } else {
          // Fetch data for all projects
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split('T')[0],
              eDate: endDate.toISOString().split('T')[0],
            },
          });
        }
        const data = response.data;

        const uniqueDates = [...new Set(data.map((item) => item._id.date))];
        const formattedDates = uniqueDates.map(date => {
          const formattedDate = new Date(date);
          return formattedDate.getDate(); // Only get the day part
        });

        const uniqueTasks = [...new Set(data.map((item) => item._id.task))];

        const datasets = uniqueTasks.map((task) => {
          const taskData = data.filter((item) => item._id.task === task);
          return {
            label: task,
            data: formattedDates.map((date) => {
              const matchingItem = taskData.find((item) => {
                const itemDate = new Date(item._id.date);
                return itemDate.getDate() === date;
              });
              return matchingItem ? matchingItem.count : 0;
            }),
            backgroundColor: getRandomColor(),
          };
        });

        let idleNonBillableCount = 0;
        let idleBillableCount = 0;
        let productionCount = 0;

        datasets.forEach((dataset) => {
          const task = dataset.label.toLowerCase();
          const count = dataset.data.reduce((sum, value) => sum + value, 0);

          if (task.includes('idle') && task.includes('non billable')) {
            idleNonBillableCount += count;
          } else if (task.includes('idle') && task.includes('billable')) {
            idleBillableCount += count;
          } else {
            productionCount += count;
          }
        });

        setIdleNonBillableCount(idleNonBillableCount);
        setIdleBillableCount(idleBillableCount);
        setProductionCount(productionCount);

        setChartData({
          labels: formattedDates,
          datasets: datasets,
        });

        const tableData = uniqueTasks.map((task, index) => ({
          id: index + 1,
          task: task,
          count: datasets[index].data.reduce((sum, value) => sum + value, 0),
          // Include count property in the tableData
        }));

        setTableData(tableData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startDate, endDate, selectedProject]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const exportChartDataToExcel = async () => {
    try {
      if (!selectedProject) {
        console.error('No project selected for export');
        return;
      }

      const response = await axios.get(`${apiUrl}/fetch/taskwise`, {
        params: {
          sDate: startDate.toISOString().split('T')[0],
          eDate: endDate.toISOString().split('T')[0],
          projectName: selectedProject,
        },
      });

      const data = response.data;

      if (data.length === 0) {
        console.error('No data available for export');
        return;
      }

      const wb = XLSX.utils.book_new();

      const uniqueDates = [...new Set(data.map((item) => item._id.date))];
      const formattedDates = uniqueDates.map(date => {
        const formattedDate = new Date(date);
        return formattedDate.getDate(); // Only get the day part
      });

      const uniqueTasks = [...new Set(data.map((item) => item._id.task))];

      const datasets = uniqueTasks.map((task) => {
        const taskData = data.filter((item) => item._id.task === task);
        return {
          label: task,
          data: formattedDates.map((date) => {
            const matchingItem = taskData.find((item) => {
              const itemDate = new Date(item._id.date);
              return itemDate.getDate() === date;
            });
            return matchingItem ? matchingItem.count : 0;
          }),
        };
      });

      const wsData = [['Task', ...formattedDates]];

      datasets.forEach((dataset) => {
        const row = [dataset.label, ...dataset.data];
        wsData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, selectedProject);

      XLSX.writeFile(wb, 'TaskWiseUserCount.xlsx');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleViewTable = () => {
    setShowTable(!showTable);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
  {/* Filters Container */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mt={2}
    mb={2}
    p={2}
  >
    {/* Start Date Filter */}
    <Grid item xs={12} md={4} >
      <TextField
        label="Start Date"
        sx={{ backgroundColor: '#fff', borderRadius: '8px',}}
        type="date"
        value={startDate.toISOString().split('T')[0]}
        onChange={(event) => setStartDate(new Date(event.target.value))}
        fullWidth
        variant="outlined"
        color="secondary"
      />
    </Grid>
    <Grid item xs={12} md={4} >
      <TextField
        label="End Date"
        type="date"
        sx={{ backgroundColor: '#fff', borderRadius: '8px', marginLeft: '5px'}}
        value={endDate.toISOString().split('T')[0]}
        onChange={(event) => setEndDate(new Date(event.target.value))}
        fullWidth
        variant="outlined"
        color="secondary"
      />
    </Grid>
    <Grid item xs={12} md={4} sx={{  padding: '8px'  }}>
      <Autocomplete
        value={selectedProject}
        sx={{ backgroundColor: '#fff', borderRadius: '8px', marginLeft: '3px'}}
        onChange={(event, newValue) => setSelectedProject(newValue)}
        options={projectNames}
        renderInput={(params) => (
          <TextField {...params} label="Project Name" fullWidth variant="outlined" color="secondary" />
        )}
      />
    </Grid>
  </Box>
</Grid>
<Grid item xs={12} md={3}>
          <Card>
            <CardActionArea>
              <CardActions sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    transform: 'translate(35%, -40%)',
                  }}
                >
                  {/* Material-UI icon for Idle - Non Billable */}
                  <IconButton>
                    <AccessTimeIcon fontSize="large" style={{ color: '#FF6384' }} />
                  </IconButton>
                </Box>
              </CardActions>
              <CardContent>
                <h3>Empoyees</h3>
                <p>1837</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

<Grid item xs={12} md={3}>
          <Card>
            <CardActionArea>
              <CardActions sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    transform: 'translate(35%, -40%)',
                  }}
                >
                  {/* Material-UI icon for Idle - Non Billable */}
                  <IconButton>
                    <AccessTimeIcon fontSize="large" style={{ color: '#FF6384' }} />
                  </IconButton>
                </Box>
              </CardActions>
              <CardContent>
                <h3>Idle - Non Billable Count</h3>
                <p>{idleNonBillableCount}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* ... (rest of your code) */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardActionArea>
              <CardActions sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    transform: 'translate(35%, -40%)',
                  }}
                >
                  {/* Material-UI icon for Idle - Billable */}
                  <IconButton>
                    <AssessmentIcon fontSize="large" style={{ color: '#36A2EB' }} />
                  </IconButton>
                </Box>
              </CardActions>
              <CardContent>
                <h3>Idle - Billable Count</h3>
                <p>{idleBillableCount}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {/* ... (rest of your code) */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardActionArea>
              <CardActions sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    transform: 'translate(35%, -40%)',
                  }}
                >
                  {/* Material-UI icon for Production */}
                  <IconButton>
                    <WorkIcon fontSize="large" style={{ color: '#FFCE56' }} />
                  </IconButton>
                </Box>
              </CardActions>
              <CardContent>
                <h3>Production Count</h3>
                <p>{productionCount}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>




<Grid container spacing={2} m={3}>


  <Grid item xs={12} md={8}>
    <Card>
    <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.7rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  minHeight: '10px',
                  minWidth: '120px',
                  marginLeft:"20px",
                  marginRight:"20px",
                  marginTop: '30px',
                }}
              >
                <MDButton variant="contained" color="primary" onClick={handleViewTable}>
                  {showTable ? 'Hide Table' : 'View in Table'}
                </MDButton>
                <MDButton variant="gradient" color="success" onClick={exportChartDataToExcel}>
                  Export
                </MDButton>
              </Grid>
      <CardHeader>
        <h3>Task-wise User Count</h3>
      </CardHeader>
      <CardContent>
      {chartData.labels.length > 0 && (
  <div style={{ height: '250px', overflowY: 'auto' }}>
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        barThickness: 30, // Adjust the value to your desired thickness
      }}
    />
  </div>
)}
        {showTable && (
          <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
            <DataGrid
              rows={tableData}
              columns={[
                { field: 'id', headerName: 'ID', width: 30 },
                { field: 'task', headerName: 'Task', width: 200, flex: 1 },
                { field: 'count', headerName: 'Members Count', width: 150, flex: 1 },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
            />
          </div>
        )}
      </CardContent>
    </Card>
  </Grid>
    <Grid item xs={12} md={4}>
    <Card>
      <CardHeader>
        <h3>Percentage Distribution</h3>
      </CardHeader>
      <CardContent>
        <Doughnut
          data={pieChartData}
          options={{
            plugins: {
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.formattedValue || '';
                    return `${label}: ${value}%`;
                  },
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  </Grid>
</Grid>

      </Grid>
    </DashboardLayout>
  );
};


