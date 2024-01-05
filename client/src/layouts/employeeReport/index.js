import React, { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { DataGrid, GridToolbar, GridPagination } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import moment from "moment";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { useSelect } from "@mui/base";
import { ToastContainer, toast } from "react-toastify";
import InputLabel from "@mui/material/InputLabel";
import Pagination from '@mui/material/Pagination';
import FilterListIcon from '@material-ui/icons/FilterList';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const columns = [
  { field: 'id', headerName: 'Employee ID', width: 150, flex: 1 },
  { field: 'Employee Name', headerName: 'Employee Name', width: 200, flex: 1 },
  { field: 'Department', headerName: 'Department', width: 150, flex: 1 },
  { field: 'Role', headerName: 'Role', width: 150, flex: 1 },
];

const UserDataUpload = () => {
  const [rows, setRows] = useState(() => {
    // Attempt to retrieve data from localStorage on component mount
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : [];
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to handle opening the drawer
  const openDrawer = () => {
    setDrawerOpen(true);
  };


  // Function to handle closing the drawer
  const closeDrawer = () => {
    setDrawerOpen(false);
  }
  useEffect(() => {
    // Clear localStorage on component unmount (page refresh)
    return () => {
      localStorage.removeItem('userData');
    };
  }, []);

  return (
    <div>
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
              minWidth: "120px",
              // Adjust the width as needed
            }}
          >
            Add Employee
          </MDButton>
        </div>
        <Drawer anchor="right" PaperProps={{ style: { width: 712 } }} open={drawerOpen} onClose={closeDrawer}>
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

          <MDBox pb={5} component="form" role="form" >


            {/* <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="project-name">Select Project Name</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              id="project-name"
              // options={projectNames}
              // value={value.projectName}
              // onChange={(event, newValue) => {
              //   setValue({
              //     ...value,
              //     projectName: newValue,
              //   });
              // }}

              // renderInput={(params) => (
              //   <TextField {...params} />
              // )}
            />
          </MDBox> */}
            {/* <MDBox sx={{ width: 250, p: 2 }}>
            <InputLabel htmlFor="department">Department</InputLabel>
            <Autocomplete
              sx={{ width: 626, mt: 1 }}
              disablePortal
              id="combo-box-demo"
              // options={list}
              // value={
              //   value.projectName === "Not assigned-CV"
              //     ? "CV"
              //     : value.projectName === "Not assigned-NLP"
              //       ? "NLP"
              //       : value.team
              // }
              // onChange={(event, newValue) => {
              //   setValue({
              //     ...value,
              //     team: newValue,
              //   });
              // }}

              // renderInput={(params) => <TextField {...params} />}
            />
          </MDBox>
          <MDBox sx={{ width: 250, p: 2 }}>

            <InputLabel htmlFor="task">Task</InputLabel>
            <Autocomplete
              disablePortal
              id="task"
              // options={tasklist}
              // onChange={handleTaskChange}
              sx={{ width: 626, mt: 1 }}
              // renderInput={(params) => <TextField {...params} />}
            />


          </MDBox> */}
            {/* <MDBox
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              mt: 1,
            }}
          >

            <InputLabel sx={{ mt: 1, ml: 2 }} htmlFor="manager">Manager</InputLabel>
            <InputLabel sx={{ mt: 1, mr: 33 }} htmlFor="date">Date</InputLabel>
          </MDBox>
          <MDBox sx={{ p: 1, ml: 1 }}
            style={{
              display: "flex",
            }}
          >
            <Autocomplete
              fullWidth
              id="manager"
              // options={managers}
              // value={value.managerTask}
              // onChange={(event, newValue) => {
              //   setValue({
              //     ...value,
              //     managerTask: newValue,
              //   });
              // }}
              sx={{ width: 305 }}

              // renderInput={(params) => <TextField {...params} />}
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
              // value={value.dateTask}
              // onChange={handleInputchange}
            />


          </MDBox> */}

            <MDBox sx={{ width: 250, p: 2 }}>
              <InputLabel htmlFor="hour">Daily Log</InputLabel>

              <TextField
                sx={{ width: 305, mt: 1 }}
                select
                fullWidth
                id="hour"
                name="sessionOne"
                // value={value.sessionOne}
                // onChange={handleInputchange}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Hours</option>
                <option value="1hour">1 Hour</option>
                <option value="2hour">2 Hour</option>
                <option value="3hour">3 Hour</option>
                <option value="4hour">4 Hour</option>
              </TextField>


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
        <Card>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10, 20]} checkboxSelection />
          </div>
        </Card>
      </DashboardLayout>
    </div>
  );
};

export default UserDataUpload;
