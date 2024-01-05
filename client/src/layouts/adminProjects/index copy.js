import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import moment from "moment";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { useState, useEffect, useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import TableFooter from "@mui/material/TableFooter";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { CSVLink } from "react-csv";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import { ToastContainer, toast } from "react-toastify";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FilterListIcon from "@material-ui/icons/FilterList";
import DialogActions from "@mui/material/DialogActions";
import { useHistory } from 'react-router-dom';


const columns = [
  // { id: "date", label: "Date", minWidth: 100 },
  // { id: "team", label: "Team", minWidth: 150 },
  // { id: "batch", label: "Members", minWidth: 150 },
  // { id: "aannotation", label: "Annotation", minWidth: 100 },
  // { id: "aqc", label: "QC", minWidth: 100 },
  // { id: "apmsme", label: "PM + SME", minWidth: 100 },
  // { id: "atotal", label: "Total", minWidth: 100 },
  // { id: "hannotation", label: "Annotation", minWidth: 100 },
  // { id: "hqc", label: "QC", minWidth: 100 },
  // { id: "hpmsme", label: "PM + SME", minWidth: 100 },
  // { id: "hprojectTraning", label: "Project Traning", minWidth: 100 },
  // { id: "hojt", label: "OJT", minWidth: 100 },
  // { id: "hqualityfeedback", label: "Quality Feedback", minWidth: 100 },
  // { id: "hidleHours", label: "Idle Hours", minWidth: 100 },
  // { id: "hother", label: "Other", minWidth: 100 },
  // { id: "hcomments", label: "Comments", minWidth: 100 },
  // { id: "htotal", label: "Total", minWidth: 100 },
  // { id: "jannotation", label: "Annotation", minWidth: 100 },
  // { id: "jqc", label: "QC", minWidth: 100 },
  // { id: "jtotal", label: "Total", minWidth: 100 },
  { id: "jmanagerTeam", label: "Manager", minWidth: 100 },
  { id: "jstatus1", label: "Status", minWidth: 100 },
  { id: "jcDate", label: "EndDate", minWidth: 100 },
  { id: "action", label: "    Action", minWidth: 50 },
  // { id: 'jtotal', label: 'Total', minWidth: 100, format: (value) => value.toLocaleString('en-US'), },
];

function createData(
  date,
  team,
  projectname,
  batch,
  // aannotation,
  // aqc,
  // apmsme,
  // atotal,
  // hannotation,
  // hqc,
  // hpmsme,
  // hprojectTraning,
  // hojt,
  // hqualityfeedback,
  // hidleHours,
  // hother,
  // hcomments,
  // htotal,
  // jannotation,
  // jqc,
  // jtotal
  jmanagerTeam,
  jstatus1,
  jcDate
) {
  //   const density = population / size;
  return {
    date,
    team,
    batch,
    projectname,
    // aannotation,
    // aqc,
    // apmsme,
    // atotal,
    // hannotation,
    // hqc,
    // hpmsme,
    // hprojectTraning,
    // hojt,
    // hqualityfeedback,
    // hidleHours,
    // hother,
    // hcomments,
    // htotal,
    // jannotation,
    // jqc,
    // jtotal,
    jmanagerTeam,
    jstatus1,
    jcDate,
  };
}
const apiUrl = process.env.REACT_APP_API_URL;
const rowData = [];

axios
  .get(`${apiUrl}/billing/`)
  .then((res) => rowData[res.data])
  .catch((err) => console.log(err));
console.log(rowData);

const rows = [
  rowData.map((item, index) => {
    createData(
      item.reportDate,
      item.team,
      item.projectname,
      item.batch,
      // item.associated.annotation,
      // item.associated.qc,
      // item.associated.pm,
      // item.associated.total,
      item.jobs.managerTeam,
      item.jobs.status1,
      item.jobs.cDate

      // item.hours.annotation,
      // item.hours.qc,
      // item.hours.pm,
      // item.hours.training,
      // item.hours.otj,
      // item.hours.qcFeedback,
      // item.hours.other,
      // item.hours.total,
      // item.jobs.annotation,
      // item.jobs.qc,
      // item.jobs.total

      // item.jobs.managerTeam,
      // item.jobs.status1,
      // item.jobs.cDate,
    );
  }),
];

export default function ColumnGroupingTable() {
  // drawer code

  const [count, setCount] = useState({ aTotal: "" });
  const [bill, setBill] = useState({
    tDate: "",
    team: "",
    projectname: "",
    batch: "",
    // associated: {
    //   annotation: 0,
    //   qc: 0,
    //   pmsme: 0,
    // },
    // hours: {
    //   annotation: 0,
    //   qc: 0,
    //   pmsme: 0,
    //   projecttraning: 0,
    //   ojt: 0,
    //   qualityannotator: 0,
    //   idelhours: 0,
    //   other: 0,
    //   comments: "",
    // },t
    jobs: {
      // annotation: 0,
      // qc: 0,
      managerTeam: "",
      status1: "",
      cDate: "",
    },
  });

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
    setTeamList(null);

    // Close the filter popup
    closeFilterDialog();
  };

  const empId = useSelector((state) => state.auth.user.empId);
  const name = useSelector((state) => state.auth.user.name);

  const [teamList, setTeamList] = useState(null);
  // const [managerTeamList, setManagerTeamList] = useState(null);
  // const [status, setStatus] = useState(null);

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

  const handleTeamChange = (event, value) => setTeamList(value);
  // const handleMangerTeamChange = (event, value) => setManagerTeamList(value);
  // const handleStatusChange = (event, value) => setStatus(value);
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
    // var assTotal =
    //   bill.associated.annotation + bill.associated.qc + bill.associated.pmsme;
    // var hourTotal =
    //   bill.hours.annotation +
    //   bill.hours.qc +
    //   bill.hours.pmsme +
    //   bill.hours.projecttraning +
    //   bill.hours.ojt +
    //   bill.hours.qualityannotator +
    //   bill.hours.idelhours +
    //   bill.hours.other;
    // var jobTotal = bill.jobs.annotation + bill.jobs.qc;
    setCount({
      ...count,
      // aTotal: assTotal,
      // hTotal: hourTotal,
      // jTotal: jobTotal,
    });
  }, [bill]);
  const list = ["CV", "NLP", "CM", "Sourcing"];
  // const managerTeam = [
  //   "naveen",
  //   "kavin",
  //   "Rajesh",
  // ];
  // const status1 = [
  //   "Active",
  //   "Completed",
  // ];
  const submit = (e) => {
    e.preventDefault();
    const billData = {
      name: name,
      team: bill.team,
      empId: empId,
      batch: bill.batch,
      reportDate: bill.tDate,
      projectname: bill.projectname,
      // associated: {
      //   annotation: bill.associated.annotation,
      //   qc: bill.associated.qc,
      //   pm: bill.associated.pmsme,
      //   total: count.aTotal,
      // },
      // hours:{
      //   annotation:bill.hours.annotation,
      //   qc:bill.hours.qc,
      //   pm:bill.hours.pmsme,
      //   training:bill.hours.projecttraning,
      //   ojt:bill.hours.ojt,
      //   qcFeedback:bill.hours.qualityannotator,
      //   other:bill.hours.other,
      //   idle:bill.hours.idelhours,
      //   total:count.hTotal,
      //   comments:bill.hours.comments
      // },
      jobs: {
        // annotation:bill.jobs.annotation,
        managerTeam: bill.jobs.managerTeam,
        // qc:bill.jobs.qc,
        status1: bill.jobs.status1,
        cDate: bill.jobs.cDate,
        // total:count.jTotal
      },
    };
    axios
      .post(`${apiUrl}/new`, billData)
      .then((res) => toast.success(res.data))
      // .then(() => (window.location = "/project-report"))
      .catch((err) => toast.error(err));
    closeDrawer()
    // console.log(bill.tDate)
  };

  // drawer code end

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({
    countTotal: 0,
    hoursTotal: 0,
    jobTotal: 0,
  });

  const headers = [
    { label: "Date", key: "reportDate" },
    { label: "Team", key: "team" },
    { label: "Projectname", key: "projectname" },
    { label: "Members", key: "batch" },
    // { label: 'Count of Associates | Annotation', key: 'associated.annotation' },
    // { label: 'Count of Associates | QC', key: 'associated.qc' },
    // { label: 'Count of Associates | PM+SME', key: 'associated.pm' },
    // { label: 'Count of Associates | Total', key: 'associated.total' },
    // {label:'Total Hours Spent | Annotation',key:'hours.annotation'},
    // {label:'Total Hours Spent | QC',key:'hours.qc'},
    // {label:'Total Hours Spent | PM+SME',key:'hours.pm'},
    // {label:'Total Hours Spent | Project Training',key:'hours.training'},
    // {label:'Total Hours Spent | OJT',key:'hours.ojt'},
    // {label:'Total Hours Spent | Quality Feedback',key:'hours.qcFeedback'},
    // {label:'Total Hours Spent | Other',key:'hours.other'},
    // {label:'Total Hours Spent | Idle Hours',key:'hours.idle'},
    // {label:'Total Hours Spent | Total',key:'hours.total'},
    // {label:'Total Hours Spent | Comments',key:'hours.comments'},
    // {label:'Total Jobs worked on | Annotation',key:'jobs.annotation'},
    // {label:'Total Jobs worked on | Qc',key:'jobs.qc'},
    // {label:'Total Jobs worked on | Total',key:'jobs.total'},
    { label: "Total Jobs worked on | Manager", key: "jobs.managerTeam" },
    { label: "Total Jobs worked on | Status", key: "jobs.status1" },
    { label: "Total Jobs worked on | EndDate", key: "jobs.cDate" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    var countTotal = 0;
    // var hoursTotal =0
    // var jobTotal = 0
    let activeCount = 0;
    let completedCount = 0;
    let projectTotal = 0;

    data.map((item) => {
      // countTotal += item.associated.total
      // projectTotal += item.projectname
      projectTotal += item.projectname ? 1 : 0;
      // hoursTotal += item.hours.total
      // jobTotal += item.jobs.total
      if (item.jobs.status1 === "Active") {
        activeCount++;
      } else if (item.jobs.status1 === "Completed") {
        completedCount++;
      }
    });

    setTotal({
      ...total,
      // countTotal: countTotal,
      // hoursTotal: hoursTotal,
      // jobTotal:jobTotal
      activeCount,
      completedCount,
      projectTotal,
    });
  }, [data]);

  // React.useEffect(()=>{
  //   axios.get("/billing/")
  //   .then((res)=>setData(res.data))
  //   .catch(err=>console.log(err))
  // },[])

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
  const allReport = (e) => {
    axios
      .get(`${apiUrl}/billing/`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  // Team List
  const List = ["CV", "NLP", "CM", "Sourcing"];
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
            minWidth: "120px",
            // Adjust the width as needed
          }}
        >
          Add Project
        </MDButton>
      </div>
      <Drawer
        anchor="right"
        PaperProps={{ style: { width: 712 } }}
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
          <Typography variant="h6">New Project</Typography>
          <IconButton
            sx={{ position: "absolute", top: 10, right: 0 }} // Positioned to the top right corner
            onClick={closeDrawer}
          >
            <CloseIcon />
          </IconButton>
        </MDBox>

        <MDBox pb={5} component="form" role="form" onSubmit={submit}>
          {/* <MDBox
              mx={2}
              // mt={-3}
              py={3}
              pt={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Create Project
              </MDTypography>
            </MDBox> */}
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
              <Autocomplete
                disablePortal
                id="department"
                options={list}
                onChange={handleTeamChange}
                sx={{
                  width: 280, mt: 1, "& .MuiOutlinedInput-root": {
                    padding: 0.5,
                  },
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </MDBox>
          </MDBox>
          {/* <Typography variant="h6" mt={3}>Members</Typography> */}

          {/* <MDBox
   pb={1}
   pt={1}
   px={1}
pl={2}
   display="flex"
   justifycontent="space-evenly"
   alignItems="center"
 >
   <Grid container spacing={1}>
     <Grid item xs={2} md={3}>
       <MDTypography variant="h6" fontWeight="medium">
         Annotation *
       </MDTypography>
       <MDInput
         type="number"
         name="annotation"
         value={bill.associated.annotation}
         required
         onChange={(e) =>
           setBill({
             ...bill,
             associated: {
               ...bill.associated,
               annotation: Number(e.target.value),
             },
           })
         }
       />
     </Grid>
     <Grid item xs={2} md={3}>
       <MDTypography variant="h6" fontWeight="medium">
         QC
       </MDTypography>
       <MDInput
         type="number"
         name="qc"
         value={bill.associated.qc}
         required
         onChange={(e) =>
           setBill({
             ...bill,
             associated: {
               ...bill.associated,
               qc: Number(e.target.value),
             },
           })
         }
       />
     </Grid>
     <Grid item xs={2} md={3}>
       <MDTypography variant="h6" fontWeight="medium">
         PM + SME
       </MDTypography>
       <MDInput
         type="number"
         name="pmsme"
         value={bill.associated.pmsme}
         required
         onChange={(e) =>
           setBill({
             ...bill,
             associated: {
               ...bill.associated,
               pmsme: Number(e.target.value),
             },
           })
         }
       />
     </Grid>
     <Grid item xs={2} md={3}>
       <MDTypography variant="h6" fontWeight="medium">
         Total
       </MDTypography>
       <MDInput
         type="number"
         name="total"
         InputProps={{ readOnly: true }}
         value={count.aTotal}
         onChange={(e) =>
           setBill({
             ...bill,
             associated: {
               ...bill.associated,
               total: Number(e.target.value),
             },
           })
         }
       />
     </Grid>
   </Grid>
 </MDBox> */}
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
            <InputLabel sx={{ mt: 2, mr: 25 }} htmlFor="members">
              No.of.Resources
            </InputLabel>
          </MDBox>
          <MDBox sx={{ p: 1, ml: 1 }}>
            {/* <MDInput
                    type="number"
                    name="annotation"
                    value={bill.jobs.annotation}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        jobs: {
                          ...bill.jobs,
                          annotation: Number(e.target.value),
                        },
                      })
                    }
                  /> */}

            {/* <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={managerTeam}
                    onChange={handleMangerTeamChange}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} />}
                  /> */}
            <TextField
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
            </TextField>

            <TextField
              sx={{ width: 280, ml: 2 }}
              type="number"
              id="members"
              variant="outlined"
              fullWidth
              name="batch"
              value={bill.batch}
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
            <InputLabel sx={{ mt: 2, mr: 30.5 }} htmlFor="end-date">
              End date
            </InputLabel>
          </MDBox>
          <MDBox sx={{ display: "flex", flexDirection: "row", mt: 1 }}>
            <TextField
              sx={{ width: 685, ml: 2, mr: 2 }}
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
              sx={{ width: 620, mr: 2.5 }}
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
              sx={{ width: 610, mt: 1, mr: 1 }}
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
              <option value="POC">POC</option>
              <option value="In-Progress">In Progress</option>
              <option value="Completed-Won">Completed Won</option>
              <option value="Completed-Lost">Completed Lost</option>
            </TextField>
          </MDBox>

          {/* <MDBox
              mx={2}
              // mt={-3}
              py={3}
              pt={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Total Hours Spent
              </MDTypography>
            </MDBox>
            <MDBox
              pb={5}
              pt={6}
              px={4}
              display="flex"
              justifycontent="space-evenly"
              alignItems="center"
            >
              <Grid container spacing={3}>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Annotation
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="annotation"
                    value={bill.hours.annotation}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: {
                          ...bill.hours,
                          annotation: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    QC
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="qc"
                    value={bill.hours.qc}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: { ...bill.hours, qc: Number(e.target.value) },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    PM + SME
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="pmsme"
                    value={bill.hours.pmsme}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: { ...bill.hours, pmsme: Number(e.target.value) },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Project Traning
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="projecttraning"
                    value={bill.hours.projecttraning}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: {
                          ...bill.hours,
                          projecttraning: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    OJT
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="ojt"
                    value={bill.hours.ojt}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: { ...bill.hours, ojt: Number(e.target.value) },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Quality Annatator
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="qualityannotator"
                    value={bill.hours.qualityannotator}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: {
                          ...bill.hours,
                          qualityannotator: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Idle Hours
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="idlehours"
                    value={bill.hours.idelhours}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: {
                          ...bill.hours,
                          idelhours: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Other
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="other"
                    value={bill.hours.other}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: { ...bill.hours, other: Number(e.target.value) },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Comments
                  </MDTypography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={4}
                    name="comments"
                    value={bill.hours.comments}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: { ...bill.hours, comments: e.target.value },
                      })
                    }
                    // placeholder="Minimum 3 rows"
                    style={{ width: 200 }}
                  />
                </Grid>
                <Grid item xs={2} md={3}>
                  <MDTypography variant="h6" fontWeight="medium">
                    Total
                  </MDTypography>
                  <MDInput
                    type="number"
                    name="total"
                    InputProps={{ readOnly: true }}
                    value={count.hTotal}
                    onChange={(e) =>
                      setBill({
                        ...bill,
                        hours: { ...bill.hours, total: Number(e.target.value) },
                      })
                    }
                  />
                </Grid>
              </Grid>
            </MDBox> */}

          <MDBox
            pt={1}
            px={1}
            display="flex"
            justifycontent="center"
            alignItems="center"
          >
            <Grid >
              <Grid >
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
      <Grid item xs={12} mt={4} mb={1}>
        <Card>
          <Dialog
            open={filterDialogOpen}
            onClose={closeFilterDialog}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle sx={{ textAlign: "left" }}>
              Your Dialog Title
            </DialogTitle>
            <DialogContent>
              <MDBox
                component="form"
                role="form"
                onSubmit={handleSubmit}
                className="filter-popup"
              >
                <Grid container spacing={3}>
                  {/* Row 1: Start Date and End Date */}
                  <Grid item xs={6}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Start Date
                    </MDTypography>
                    <MDInput
                      type="date"
                      name="startDate"
                      sx={{ width: "100%" }}
                      value={values.startDate}
                      onChange={handleInputchange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography variant="h6" fontWeight="medium">
                      End Date
                    </MDTypography>
                    <MDInput
                      type="date"
                      name="endDate"
                      sx={{ width: "100%" }}
                      value={values.endDate}
                      onChange={handleInputchange}
                    />
                  </Grid>

                  {/* Row 2: Team and Name */}
                  <Grid item xs={6}>
                    <MDTypography variant="h6" fontWeight="medium">
                      Team
                    </MDTypography>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={list}
                      onChange={handleTeamchange}
                      sx={{ width: "100%" }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>

                  {/* Row 3: Search Button */}
                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      pt={3}
                    >
                      <MDButton
                        variant="gradient"
                        size="small"
                        color="success"
                        type="submit"
                      >
                        Search
                      </MDButton>
                      <MDButton
                        variant="gradient"
                        size="small"
                        color="warning"
                        onClick={handleCancel}
                        style={{ marginLeft: "10px" }}
                      >
                        Cancel
                      </MDButton>
                    </Box>
                  </Grid>
                </Grid>
              </MDBox>
            </DialogContent>
            {/* <DialogActions>
    Add a close button or any other UI element to close the filter popup
    <IconButton onClick={closeFilterDialog}>
      <CloseIcon />
    </IconButton>
  </DialogActions> */}
          </Dialog>
        </Card>
      </Grid>
      <Grid item xs={12} mt={1} mb={10}>
        <Paper sx={{ width: "100%" }}>
          {/* <MDBox
              mx={2}
              // mt={-3}
              py={3}
              pt={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Project Reports
              </MDTypography>
            </MDBox> */}

          <TableContainer sx={{ maxHeight: 740 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={2}>
                    <MDButton
                      type="submit"
                      color="info"
                      variant="outlined"
                      size="small"
                      style={{ marginRight: "13px" }}
                    >
                      <CSVLink
                        data={data}
                        filename={"Billing.csv"}
                        headers={headers}
                      >
                        <MDTypography variant="outlined" color="info">
                          <SaveAltIcon /> Export
                        </MDTypography>
                      </CSVLink>
                    </MDButton>
                    <MDButton
                      type="submit"
                      onClick={openFilterDialog}
                      color="info"
                      variant="outlined"
                      size="small"
                    >
                      <FilterListIcon
                        className="team-filter-icon"
                        style={{
                          cursor: "pointer",
                          color: "#3a87ea",
                          fontSize: "20px",
                        }}
                        onClick={openFilterDialog}
                        aria-label="Team Filter"
                      />
                      <MDTypography
                        variant="h6"
                        onClick={openFilterDialog}
                        style={{
                          color: "#3a87ea",
                          cursor: "pointer",
                          fontSize: "12.1px",
                          marginRight: "10px",
                        }}
                      >
                        TEAM FILTER
                      </MDTypography>
                    </MDButton>
                  </TableCell>
                  {/* <TableCell align="center" bgcolor="#e91e63" colSpan={3}>
                    Item
                  </TableCell> */}
                  {/* <TableCell align="center" bgcolor="#f3e5f5" colSpan={4}>
                    Total Count of Associates : <b>{total.countTotal}</b>
                    Active project : <b>{total.activeCount}</b>
                  </TableCell> */}
                  {/* <TableCell align="center" bgcolor="#a7ffeb" colSpan={10}>
                    Total Completed project : <b>{total.hoursTotal}</b>
                    Completed project : <b>{total.completedCount}</b>
                  </TableCell> */}
                  {/* <TableCell align="center" bgcolor="#ffe0b2" colSpan={4}>
                    Total Project : <b>{total.jobTotal}</b>
                    Total Project : <b>{total.projectTotal}</b>
                  </TableCell> */}
                  <TableCell align="right" colSpan={2}>
                    {/* <FilterListIcon
                              className="team-filter-icon"
                              style={{ cursor: 'pointer', color: '#3a87ea', fontSize: '20px' }}
                              onClick={openFilterDialog}
                              aria-label="Team Filter"
                            />
                            <MDTypography variant="h6" onClick={openDrawer} style={{ color: '#3a87ea', cursor: 'pointer', fontSize: '12.1px', marginRight: '10px', }}>
                              TEAM FILTER
                            </MDTypography> */}
                    {/* <MDButton
                variant="outlined"
                color="error"
                
                onClick={allReport}
              // onClick={() => setShow(!show)}
              >
                &nbsp;All Report
              </MDButton> */}
                    <MDButton
                      className="team-report-btn"
                      variant="outlined"
                      color="error"
                      size="small"
                      // style={{ marginRight: '13px' }}
                      onClick={allReport}
                    // onClick={() => setShow(!show)}
                    >
                      &nbsp;All Report
                    </MDButton>
                    &nbsp; &nbsp;
                    {/* <MDButton type="submit"  color="info"  
                    variant="outlined"
                    // color="error"
                    size="small"
                    // style={{ marginRight: '13px' }}
            //                 style={{
            // fontSize: "0.7rem",
            // borderRadius: "10px",
            // textAlign: "center",
            // minHeight: "10px", 
            // minWidth: "120px", }} 
               > 
             <CSVLink data={data} filename={"Billing.csv"} headers={headers}>
                      <MDTypography variant="outlined"  size="small"  color="info" >
                        <SaveAltIcon /> Export
                      </MDTypography></CSVLink></MDButton> */}
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
            <Table>
              <TableHead sx={{ display: "table-header-group !important" }}>
                <TableRow>
                  <TableCell
                    align="center"
                    // bgcolor="#E91E63"
                    minwidth={150}
                    rowSpan={2}
                  >
                    Date
                  </TableCell>
                  <TableCell
                    align="center"
                    // bgcolor="#E91E63"
                    rowSpan={2}
                  >
                    Team
                  </TableCell>
                  <TableCell
                    align="center"
                    // width="2 rem"
                    // bgcolor="#E91E63"
                    //  sx={{width:"2 rem"}}
                    rowSpan={2}
                  >
                    No.of.Members
                  </TableCell>
                  <TableCell
                    align="center"
                    // width="2 rem"
                    // bgcolor="#E91E63"
                    //  sx={{width:"2 rem"}}
                    rowSpan={2}
                  >
                    Projectname
                  </TableCell>
                  {/* <TableCell align="center" bgcolor="#f3e5f5" colSpan={4}>
                    Count of Associates
                  </TableCell> */}
                  {/* <TableCell align="center" bgcolor="#a7ffeb" colSpan={10}>
                    Total Project Status
                  </TableCell> */}
                  {/* <TableCell align="center" bgcolor="#ffe0b2" colSpan={4}>
                    Total jobs worked on
                  </TableCell> */}
                </TableRow>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ top: 57, minwidth: column.minwidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        align="center"
                      >
                        {/* {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                        { value}
                        </TableCell>
                      );
                    })} */}
                        <TableCell align="center">
                          {moment(item.reportDate).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell align="center">{item.team}</TableCell>
                        <TableCell align="center">{item.batch}</TableCell>
                        <TableCell align="center">{item.projectname}</TableCell>
                        {/* <TableCell>{item.associated.annotation}</TableCell>
                        <TableCell>{item.associated.qc}</TableCell>
                        <TableCell>{item.associated.pm}</TableCell>
                        <TableCell>{item.associated.total}</TableCell> */}
                        <TableCell>{item.jobs?.managerTeam}</TableCell>
                        <TableCell>{item.jobs?.status1}</TableCell>
                        <TableCell>
                          {" "}
                          {moment(item.jobs?.cDate).format("DD/MM/YYYY")}
                        </TableCell>
                        {/* <TableCell>{item.hours.annotation}</TableCell>
                        <TableCell>{item.hours.qc}</TableCell>
                        <TableCell>{item.hours.pm}</TableCell>
                        <TableCell>{item.hours.training}</TableCell>
                        <TableCell>{item.hours.ojt}</TableCell>
                        <TableCell>{item.hours.qcFeedback}</TableCell>
                        <TableCell>{item.hours.idle}</TableCell>
                        <TableCell>{item.hours.other}</TableCell>
                        <TableCell>{item.hours.comments}</TableCell>
                        <TableCell>{item.hours.total}</TableCell>
                        <TableCell>{item.jobs.annotation}</TableCell>
                        <TableCell>{item.jobs.qc}</TableCell>
                        <TableCell>{item.jobs.total}</TableCell> */}

                        <TableCell>
                          <Link to={"/project-entry/edit/" + item._id}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>{" "}
                          </Link>
                          {/* <Link to={"/project-entry/edit/" + item._id}>
                            <IconButton aria-label="edit">
                              <EditIcon />
                            </IconButton>{" "}
                          </Link> */}

                          |
                          <IconButton
                            onClick={(e) => handleDelete(item._id)}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                          {/* <button onClick={e => handleDelete(index,e)}><DeleteForeverIcon/></button> */}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}
