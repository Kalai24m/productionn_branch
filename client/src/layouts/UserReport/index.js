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
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
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
import { fontSize } from "@mui/system";

function Report() {
  const apiUrl = "http://localhost:5000";
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
    setTasks([
      ...tasks,
      { task: "", sessionOneHours: "", sessionOneMinutes: "" },
    ]);
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
      .catch((err) => toast.error(`All fields required☹️`));
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
    {
      field: "taskCount",
      headerName: "Task Count",
      width: 120,
      editable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 15 }}>
          {params.row.sessionOne.length}
        </Typography>
      ),
      align: "center",
    },
    {
      field: "managerTask",
      headerName: "Project Manager",
      width: 150,
      editable: false,
      flex: 1,
    },
    {
      field: "totalHours",
      headerName: "Total Hours",
      width: 140,
      editable: false,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 15 }}>
          {calculateTotalHours(params.row.sessionOne)}
        </Typography>
      ),
      align: "center",
    },
    {
      field: "view",
      headerName: "View",
      sortable: false,
      filterable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          style={{ color: "#2196f3" }}
          onClick={() => openDialog(params.row)}
        >
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

  const calculateTotalHours = (sessionOne) => {
    let totalMinutes = 0;

    sessionOne.forEach((task) => {
      const [hours, minutes] = task.sessionOne.split(":");
      totalMinutes += parseInt(hours) * 60 + parseInt(minutes);
    });

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return `${hours}:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}`;
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
                <strong style={{ fontSize: "18px" }}>Project Name:</strong>{" "}
                {selectedUserData.projectName}
              </Typography>
              <div
                style={{
                  maxHeight: "300px", // Set a fixed height for the scrollable area
                  overflow: "auto", // Enable scrolling
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
          <Typography variant="h6"> New Task</Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }} // Positioned to the top right corner
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="project-name">Project Name</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              id="project-name"
              options={projectNames}
              value={value.projectName}
              aria-required            
              onChange={(event, newValue) => {
                setValue({
                  ...value,
                  projectName: newValue,
                });
              }}
              renderInput={(params) => <TextField {...params} required />}
            />
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="department">Department</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              disablePortal
              id="combo-box-demo"
              options={list}
              aria-required
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
              renderInput={(params) => <TextField {...params} required />}
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
            <InputLabel sx={{ mt: 1, ml: 2, width: "46%" }} htmlFor="task">
              Task
            </InputLabel>
            <InputLabel sx={{ mt: 1, ml: 2, width: "22%" }} htmlFor="hours">
              Hours
            </InputLabel>
            <InputLabel sx={{ mt: 1, ml: 2, width: "23%" }} htmlFor="minute">
              Minutes
            </InputLabel>
          </MDBox>
          {tasks.map((task, index) => (
            <MDBox
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
              key={index}
            >
              <Autocomplete
                disablePortal
                aria-required
                id={`task_${index}`} // Unique ID for each Autocomplete
                name={`createTask_${index}`} // Unique name for each Autocomplete
                options={(Array.isArray(taskList) ? taskList : []).map(
                  (task) => task.createTask
                )}
                onChange={(event, value) =>
                  handleTaskChange(index, event, value)
                }
                sx={{ width: "46%", mt: 1 }}
                renderInput={(params) => <TextField {...params}  required />}
              />
              
              <FormControl sx={{ minWidth: 120, width: "24%", ml: 1 }}>
                <TextField
                  id="sessionOneHours"
                  name="sessionOneHours"
                  sx={{ width: "100%", p: 1.5 }}
                  aria-required
                  required
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
                  sx={{ width: "100%", p: 1.5 }}
                  required
                  value={task.sessionOneMinutes}
                  onChange={(e) => handleTaskInputChange(index, e)}
                  variant="outlined"
                  aria-required
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

              {index > 0 && (
                <div style={{ position: "relative" }}>
                  <IconButton
                    onClick={() => handleRemoveTaskField(index)}
                    sx={{
                      position: "absolute",
                      top: 13,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  {/* Rest of the content for this row */}
                </div>
              )}
            </MDBox>
          ))}
          <MDButton
            onClick={handleAddTaskField}
            color="success"
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              padding: "1px 7px", // Adjust top and bottom padding
              marginLeft: "15px",
              marginTop: "5px",
              minHeight: "30px", // Adjust the height as needed
            }}
          >
            Add Task
          </MDButton>

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
