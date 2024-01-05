import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ToastContainer, toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
// import AddIcon from "@mui/icons-material/Add";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const TaskCreation = () => {

  const apiUrl = process.env.REACT_APP_API_URL;
  const [task, setTask] = useState({
    createTask: "",
  });

  const [addManager, setAddManager] = useState({
    createManager: "",
  });

  const [addTeam, setAddTeam] = useState({
    createTeam: "",
  });

  const [taskData, setTaskData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [managerData, setManagerData] = useState([]);

  const fetchData = () => {
    axios.get(`${apiUrl}/fetch/task-data`).then((response) => {
      setTaskData(response.data);
    });

    axios.get(`${apiUrl}/fetch/addteam-data`).then((response) => {
      setTeamData(response.data);
    });

    axios.get(`${apiUrl}/fetch/manager-data`).then((response) => {
      setManagerData(response.data);
    });
  };

  const updateData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  const handleInputChangeTwo = (e) => {
    const { name, value } = e.target;
    setAddManager({
      ...addManager,
      [name]: value,
    });
  };

  const handleInputChangeThree = (e) => {
    const { name, value } = e.target;
    setAddTeam({
      ...addTeam,
      [name]: value,
    });
  };

  const handleSubmit = () => {

    if (!task.createTask) {
      toast.error("Task cannot be empty");
      return;
    }

    const taskData = {
      createTask: task.createTask,
    };

    axios
      .post(`${apiUrl}/task/new`, taskData)
      .then((res) => {
        toast.success(res.data);
        updateData();
        setTask({
          createTask: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitTwo = () => {

    if (!addManager.createManager) {
      toast.error("Manager cannot be empty");
      return;
    }

    const managerData = {
      createManager: addManager.createManager,
    };

    axios
      .post(`${apiUrl}/add-manager/new`, managerData)
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/addteam-data`).then((response) => {
          setTeamData(response.data);
        });
        updateData();
        setAddManager({
          createManager: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleSubmitThree = () => {

    if (!addTeam.createTeam) {
      toast.error("Team cannot be empty");
      return;
    }
    
    const teamData = {
      createTeam: addTeam.createTeam,
    };

    axios
      .post(`${apiUrl}/add-team/new`, teamData)
      .then((res) => {
        toast.success(res.data);
        axios.get(`${apiUrl}/fetch/manager-data`).then((response) => {
          setManagerData(response.data);
        });
        updateData();
        setAddTeam({
          createTeam: "",
        });
      })
      .catch((err) => toast.error(err));
  };

  const handleDeleteTask = (id) => {
    axios
      .delete(`${apiUrl}/delete/task/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteManager = (id) => {
    axios
      .delete(`${apiUrl}/delete/manager/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTeam = (id) => {
    axios
      .delete(`${apiUrl}/delete/team/` + id)
      .then((res) => {
        toast.warn(res.data);
        updateData();
      })
      .catch((err) => console.log(err));
  };
  


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid
        container
        justifyContent="center"
        alignItems="top"
        style={{ height: "80vh" }}
        spacing={4}
      >
        {/* Task Section */}
        <Grid item xs={4}>
          <Card>
            <Box p={2}>
            <InputLabel sx={{ ml:1, mb:1, fontWeight: 'bolder', fontSize: '17px' }} htmlFor="add-task" >
              Add Task
            </InputLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  name="createTask"
                  id="add-task"
                  value={task.createTask}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  style={{ marginRight: '10px' }}
                  required
                />
                <IconButton
                  style={{ background: "#4caf50", borderRadius: "5px" }}
                  onClick={() => {
                    handleSubmit();
                    updateData();
                  }}
                >
                        {/* <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5 }} htmlFor="add-team">
              ADD
            </InputLabel><AddIcon style={{ color: "white" }} /> */}
                  <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5, padding:'5px' }} htmlFor="add-team">
              ADD
            </InputLabel>
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", paddingTop: 10, paddingLeft: 15, paddingRight: 15, maxHeight: "35vh", overflowY: "auto" }}>
                {taskData.slice(0).map((task) => (
                  <li
                    key={task._id}
                    style={{
                      borderBottom: "2px solid #f0f0f0",
                      padding: "3px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {task.createTask}
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      &#x1F5D1;
                    </span>
                  </li>
                ))}
              </ul>
            </Box>
          </Card>
        </Grid>

        {/* Manager Section */}
        <Grid item xs={4}>
          <Card>
            <Box p={2}>
            <InputLabel sx={{ ml: 1, mb:1, fontWeight: 'bolder', fontSize: '17px' }} htmlFor="add-manager">
              Add Manager
            </InputLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  name="createManager"
                  id="add-manager"
                  value={addManager.createManager}
                  onChange={handleInputChangeTwo}
                  variant="outlined"
                  fullWidth
                  style={{ marginRight: '10px' }}
                  required
                />
                <IconButton
                  style={{ background: "#4caf50", borderRadius: "5px" }}
                  onClick={() => {
                    handleSubmitTwo();
                    updateData();
                  }}
                >
            <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5, padding: '5px' }} htmlFor="add-team">
              ADD
            </InputLabel>
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", paddingTop: 10, paddingLeft: 15, paddingRight: 15, maxHeight: "35vh", overflowY: "auto" }}>
                {managerData.slice(0).map((manager) => (
                  <li
                    key={manager._id}
                    style={{
                      borderBottom: "2px solid #f0f0f0",
                      padding: "3px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {manager.createManager}
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                      onClick={() => handleDeleteManager(manager._id)}
                    >
                      &#x1F5D1;
                    </span>
                  </li>
                ))}
              </ul>
            </Box>
          </Card>
        </Grid>

        {/* Team Section */}
        <Grid item xs={4}>
          <Card>
        
            <Box p={2}>
            <InputLabel sx={{ ml: 1, mb:1, fontWeight: 'bolder', fontSize: '17px' }} htmlFor="add-team">
              Add Team
            </InputLabel>
              <div style={{ display: 'flex', alignItems: 'center' }}>
         
                <TextField
                  name="createTeam"
                  id="add-team"
                  value={addTeam.createTeam}
                  onChange={handleInputChangeThree}
                  variant="outlined"
                  fullWidth
                  style={{ marginRight: '10px' }}
                  required
                />
                <IconButton
                  style={{ background: "#4caf50", borderRadius: "5px" }}
                  onClick={() => {
                    handleSubmitThree();
                    updateData();
                  }}
                >
                  {/* <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5 }} htmlFor="add-team">
              ADD
            </InputLabel><AddIcon style={{ color: "white" }} /> */}
                  <InputLabel sx={{  fontWeight: 'bolder', color: '#fff', mt:0.5, padding: '5px' }} htmlFor="add-team">
              ADD
            </InputLabel>
                </IconButton>
              </div>
              <ul style={{ listStyleType: "none", paddingTop: 10, paddingLeft: 15, paddingRight: 15, maxHeight: "35vh", overflowY: "auto" }}>
                {teamData.slice(0).map((team) => (
                  <li
                    key={team._id}
                    style={{
                      borderBottom: "2px solid #f0f0f0",
                      padding: "3px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {team.createTeam}
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                        color: "red",
                      }}
                      onClick={() => handleDeleteTeam(team._id)}
                    >
                      &#x1F5D1;
                    </span>
                  </li>
                ))}
              </ul>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {/* <Footer /> */}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default TaskCreation;
