import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import "react-datepicker/dist/react-datepicker.css";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

function Edit() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
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

  const [drawerOpen1, setDrawerOpen1] = useState(true);

  // Function to handle opening the drawer
  const openDrawer1 = () => {
    setDrawerOpen1(true);
  };

  // Function to handle closing the drawer
  const closeDrawer1 = () => {
    setDrawerOpen1(false);
    navigate("/projects");
  };

  const handleCancel = () => {

    // const navigate = useNavigate();

    // Navigate to the "project-report" page
    navigate("/projects");
  };
  const empId = useSelector((state) => state.auth.user.empId);
  const name = useSelector((state) => state.auth.user.name);

  const [teamList, setTeamList] = useState(null);
  const [managerTeamList, setManagerTeamList] = useState(null);
  const [status, setStatus] = useState(null);

  const handleTeamChange = (event, value) => setBill({ ...bill, team: value });
  const handleMangerTeamChange = (event, value) =>
    setBill({ ...bill, jobs: { ...bill.jobs, managerTeam: value } });
  const handleStatusChange = (event, value) =>
    setBill({ ...bill, jobs: { ...bill.jobs, status1: value } });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setBill({
      ...bill,
      [name]: value,
      // team: teamList,
    });
  };
  const handleCDateChange = (e) => {
    const { name, value } = e.target;

    setBill({
      ...bill,
      jobs: {
        ...bill.jobs,
        [name]: value,
      },
    });
  };

  useEffect(() => {
    var assTotal = setCount({
      ...count,
    });
  }, [bill]);
  const list = [];
  const List = [];
  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`${apiUrl}/billing/` + id)
      .then((res) => {
        setBill({
          ...bill,
          tDate: moment(res.data.reportDate).format("YYYY-MM-DD"),
          team: res.data.team,
          projectname: res.data.projectname,
          batch: res.data.batch,
          jobs: {
            managerTeam: res.data.jobs.managerTeam,
            status1: res.data.jobs.status1,
            cDate: moment(res.data.jobs.cDate).format("YYYY-MM-DD"),
          },
        });
        setCount({
          ...count,
        });
      })
      .catch((err) => console.error(err));
    console.log(bill.tDate);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const billData = {
      name: name,
      team: bill.team,
      empId: empId,
      projectname: bill.projectname,
      batch: bill.batch,
      reportDate: bill.tDate,
      jobs: {
        managerTeam: bill.jobs.managerTeam,
        status1: bill.jobs.status1,
        cDate: bill.jobs.cDate,
      },
    };
    axios
      .post(`${apiUrl}/update/` + id, billData)
      .then((res) => toast.success(res.data))
      // .then(() => (window.location = "/projects"))
      .catch((err) => toast.error(err));
    // console.log(billData)
    navigate("/projects");
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Drawer anchor="right" PaperProps={{ style: { width: 712, backgroundColor: "#fff", color: "rgba(0, 0, 0, 0.87)", boxShadow: "0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)", overflowY: "auto", display: "flex", flexDirection: "column", height: "100%", flex: "1 0 auto", zIndex: 1200, WebkitOverflowScrolling: "touch", position: "fixed", top: 0, outline: 0, margin: "0", border: "none", borderRadius: '0', padding: "23px" } }} open={drawerOpen1} onClose={closeDrawer1}>
        <div>
          <MDBox
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,

            }}
          >
            <Typography variant="h6">Update Project</Typography>
            <IconButton
              sx={{ position: "absolute", top: 10, right: 0 }}
              onClick={closeDrawer1}
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
                  Project Name *
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
                <InputLabel sx={{ mr: 20 }} htmlFor="department">
                  Department *
                </InputLabel>
                <Autocomplete
                  disablePortal
                  sx={{
                    width: 305, mt: 1, "& .MuiOutlinedInput-root": {
                      padding: 0.5,
                    },
                  }}
                  id="combo-box-demo"
                  options={list}
                  isOptionEqualToValue={(list, value) =>
                    list.value === value.value
                  }
                  value={bill.team}
                  onChange={handleTeamChange}
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
                Manager *
              </InputLabel>
              <InputLabel sx={{ mt: 2, mr: 26.5 }} htmlFor="members">
                No.of.Resources *
              </InputLabel>
            </MDBox>
            <MDBox sx={{ display: 'flex', alignItems: 'center', p: 1, ml: 1 }}>
              {/* <TextField
                sx={{ width: 305 }}
                select
                fullWidth
                id="manager"
                required
                name="managerTeam"
                value={bill.jobs.managerTeam}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    jobs: {
                      ...bill.jobs,
                      managerTeam: e.target.value,
                    },
                  })
                }
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
                sx={{
                  width: 305, "& .MuiOutlinedInput-root": {
                    padding: 0.5,
                  },
                }}
                id="combo-box-demo"
                options={list}
                isOptionEqualToValue={(list, value) =>
                  list.value === value.value
                }
                name="managerTeam"
                value={bill.jobs.managerTeam}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    jobs: {
                      ...bill.jobs,
                      managerTeam: e.target.value,
                    },
                  })
                }
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
                Start date *
              </InputLabel>
              <InputLabel sx={{ mt: 2, mr: 30.5 }} htmlFor="end-date">
                End date *
              </InputLabel>
            </MDBox>
            <MDBox sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
              <TextField
                sx={{ width: 305, ml: 2 }}
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
                sx={{ width: 305, ml: 2, mr: 3 }}
                variant="outlined"
                id="end-date"
                type="date"
                name="cDate"
                required
                value={bill.jobs.cDate}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    jobs: {
                      ...bill.jobs,
                      cDate: e.target.value,
                    },
                  })
                }
              />
            </MDBox>
            <MDBox sx={{ width: 200, p: 1, mt: 3, ml: 1 }}>
              <InputLabel htmlFor="status">Status *</InputLabel>
              <TextField
                sx={{ width: 600, mt: 1, mr: 1 }}
                select
                fullWidth
                id="status"
                required
                name="status1"
                value={bill.jobs.status1}
                onChange={(e) =>
                  setBill({
                    ...bill,
                    jobs: {
                      ...bill.jobs,
                      status1: e.target.value,
                    },
                  })
                }
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
              sx={{
                display: "flex",
                flexDirection: "row", // Set flexDirection to "row" to place buttons in the same row
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MDButton variant="gradient" color="success" type="submit">
                &nbsp;Update
              </MDButton>
              <MDButton
                variant="gradient"
                // size="small"
                color="warning"
                onClick={handleCancel}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </MDButton>
            </MDBox>

          </MDBox>
        </div>
      </Drawer>

      {/* <Footer /> */}
      <ToastContainer />
    </DashboardLayout>
  );
}
export default Edit;
