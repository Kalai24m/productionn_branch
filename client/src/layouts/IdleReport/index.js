import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { CardActionArea, CardActions, IconButton } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Autocomplete from '@mui/material/Autocomplete';
import CheckIcon from "@mui/icons-material/Check";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import CloseIcon from "@mui/icons-material/Close";
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
import GroupIcon from '@mui/icons-material/Group';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';


const TaskWiseBarChart = () => {

  const apiUrl = 'http://localhost:5000';



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
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [allProjectNames, setAllProjectNames] = useState([]);
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
  const [teamProjects, setTeamProjects] = useState([]);

  // New state variable for Pie Chart
  const [pieChartData, setPieChartData] = useState({
    labels: ['Idle - Non Billable', 'Idle - Billable', 'Production'],
    datasets: [
      {
        data: [0, 0, 0], // Initial percentages set to 0
        backgroundColor: ['#7b69bc', '#435671', '#90C1F2' ],
        hoverBackgroundColor: ['#7b69bc', '#435671', '#90C1F2' ],
      },
    ],
  });


  const [teams, setTeams] = useState([]);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${apiUrl}/teams`);
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchAllProjectNames = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projectNames`);
        setAllProjectNames(response.data);
      } catch (error) {
        console.error('Error fetching all project names:', error);
      }
    };

    fetchAllProjectNames();
  }, []);


  const handleFetchProjectsForTeam = async (team) => {
    try {
      const response = await axios.get(`${apiUrl}/projectNames?team=${team}`);
      console.log(`Projects for ${team} Team Response:`, response.data);
      setTeamProjects(response.data);
    } catch (error) {
      console.error(`Error fetching projects for ${team} team:`, error);
    }
  };

  const handleTeamChange = async (event, newTeam) => {
    setSelectedTeam(newTeam);
    try {
      handleFetchProjectsForTeam(newTeam);
    } catch (error) {
      console.error('Error fetching projects for the team:', error);
    }
  };


  // useEffect(() => {
  //   const fetchProjectNames = async () => {
  //     try {
  //       const response = await axios.get(`${apiUrl}/projectNames`);
  //       const projectNames = response.data;
  //       setProjectNames(projectNames);
  //     } catch (error) {
  //       console.error('Error fetching project names:', error);
  //     }
  //   };

  //   fetchProjectNames();
  // }, []);

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
            backgroundColor: ['#7b69bc', '#435671', '#90C1F2' ],
            hoverBackgroundColor: ['#7b69bc', '#435671', '#90C1F2' ],
          },
        ],
      }));
    };

    fetchPieChartData();
  }, [idleNonBillableCount, idleBillableCount, productionCount]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!startDate || !endDate) {
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

        if (selectedProject && selectedTeam) {
          // Fetch data for a specific project and team
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split('T')[0],
              eDate: endDate.toISOString().split('T')[0],
              projectName: selectedProject,
              team: selectedTeam,
            },
          });
        } else if (selectedTeam) {
          // Fetch data for all projects for a specific team
          response = await axios.get(`${apiUrl}/fetch/taskwise`, {
            params: {
              sDate: startDate.toISOString().split('T')[0],
              eDate: endDate.toISOString().split('T')[0],
              team: selectedTeam,
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
  }, [startDate, endDate, selectedProject, selectedTeam]);

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

  const [pieChartData1, setPieChartData1] = useState({
    labels: [],
    datasets: [
      {
        data: [],
            backgroundColor: ['#435671', '#90C1F2' ],
            hoverBackgroundColor: ['#435671', '#90C1F2' ],
      },
    ],
  });

  useEffect(() => {
    const fetchProjectStatusData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/projectStatus`);
        const projectStatusData = response.data;

        // Aggregate counts for the same status1 values
        const aggregatedData = aggregateStatus1Data(projectStatusData);

        // Calculate the total count
        const totalCount = aggregatedData.reduce((sum, item) => sum + item.count, 0);

        // Update pie chart data with percentages
        const percentages = aggregatedData.map((item) => (item.count / totalCount) * 100);
        setPieChartData1((prevData) => ({
          ...prevData,
          labels: aggregatedData.map((item) => item.status1),
          datasets: [
            {
              data: percentages,
              
            backgroundColor: ['#435671', '#90C1F2' ],
            hoverBackgroundColor: ['#435671', '#90C1F2' ],
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching project status data:', error);
      }
    };

    fetchProjectStatusData();
  }, [apiUrl]);

  // Function to aggregate counts for the same status1 values
  const aggregateStatus1Data = (data) => {
    const status1Map = new Map();

    data.forEach((item) => {
      const { status1, count } = item;
      if (status1Map.has(status1)) {
        status1Map.set(status1, status1Map.get(status1) + count);
      } else {
        status1Map.set(status1, count);
      }
    });

    return Array.from(status1Map.entries()).map(([status1, count]) => ({ status1, count }));
  };


  const [status1CountByProject, setStatus1CountByProject] = useState([]);

  useEffect(() => {
    const fetchStatus1CountByProject = async () => {
      try {
        const response = await axios.get('/api/status1CountByProject');
        setStatus1CountByProject(response.data);
      } catch (error) {
        console.error('Error fetching status1 count by project:', error);
      }
    };

    fetchStatus1CountByProject();
  }, []);

  const aggregateStatus1Counts = (projects) => {
    const status1Map = new Map();

    projects.forEach((project) => {
      project.status1Counts.forEach((status1Count) => {
        const { status1, count } = status1Count;

        if (status1Map.has(status1)) {
          status1Map.set(status1, status1Map.get(status1) + count);
        } else {
          status1Map.set(status1, count);
        }
      });
    });

    return Array.from(status1Map.entries()).map(([status1, count]) => ({
      status1,
      count,
    }));
  };

  const columns = [
    { field: 'status1', headerName: 'Status1', flex: 1 },
    { field: 'count', headerName: 'Count', flex: 1 },
  ];

  const rows = aggregateStatus1Counts(status1CountByProject).map((row, index) => ({
    id: index, // Use the index as the id (you may need a better strategy depending on your data)
    ...row,
  }));
  const [comparisonData, setComparisonData] = useState({
    totalEmployees: 0,
    presentEmployees: 0,
    absentEmployees: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/compareData');
        setComparisonData(response.data);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      }
    };

    fetchData();
  }, []);

  const { totalEmployees, presentEmployees, absentEmployees } = comparisonData;

  // Calculate percentage for the doughnut chart
  const total = presentEmployees + absentEmployees;
  const presentPercentage = ((idleBillableCount + idleNonBillableCount + productionCount) / totalEmployees) * 100;
  const absentPercentage = ((totalEmployees - (idleBillableCount + idleNonBillableCount + productionCount)) / totalEmployees) * 100;
  
  // Prepare data for the Doughnut chart
  const doughnutChartData = {
    labels: ['Present Employees', 'Absent Employees'],
    datasets: [
      {
        data: [presentPercentage, absentPercentage],
        backgroundColor: ['#1A345B', '#AFD0F0'],
        hoverBackgroundColor: ['#1A345B', '#AFD0F0'],
      },
    ],
  };
  const [data, setData] = useState([]);
  const [dataTwo, setInitialData] = useState([]);
  useEffect(() => {
    axios.get(`${apiUrl}/admin`).then((response) => {
      // Update initial data
      setInitialData(response.data);
      setData(response.data);
    });
  }, []);
  const formattedData = useMemo(() => {
    const reversedData = data.map((row) => ({
      ...row,
      id: row._id,
    }));
    reversedData.reverse();
    return reversedData;
  }, [data]);

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
    const columnsTwo = [
    { field: "projectname", headerName: "Projectname", flex: 1 },
    { field: "team", headerName: "Department", flex: 1 },
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
  ];
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <MDButton
            variant="outlined"
            color="success"
            sx={{
              width: "fit-content",
              display: "flex",
              alignItems: "center",
              padding: "7px 7px", // Adjust top and bottom padding
              marginLeft: "auto",
              minHeight: "0px", // Adjust the height as needed
            }}
            onClick={exportChartDataToExcel}
          >
            Export Analytics
          </MDButton>
          {/* Filters Container */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
            mb={2}
            p={0}
          >
            {/* Start Date Filter */}
            <Grid item xs={12} md={3}>
              <TextField
                label="Start Date"
                sx={{ backgroundColor: "#fff", borderRadius: "8px" }}
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(event) => setStartDate(new Date(event.target.value))}
                fullWidth
                variant="outlined"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="End Date"
                type="date"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  marginLeft: "5px",
                }}
                value={endDate.toISOString().split("T")[0]}
                onChange={(event) => setEndDate(new Date(event.target.value))}
                fullWidth
                variant="outlined"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ padding: "8px" }}>
              <Autocomplete
                value={selectedProject}
                onChange={(event, newProject) => setSelectedProject(newProject)}
                options={selectedTeam ? teamProjects : allProjectNames}
                getOptionLabel={(option) => option}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Project Name"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{
                      backgroundColor: "white",
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} sx={{ padding: "8px" }}>
              <Autocomplete
                value={selectedTeam}
                onChange={handleTeamChange}
                options={teams}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team"
                    fullWidth
                    variant="outlined"
                    color="secondary"
                  />
                )}
              />
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ width: "100%", height: "100%" }}>
            <CardActionArea>
              <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 1,
                  }}
                >
                  {/* Material-UI icon for Idle - Non Billable */}
                  <GroupIcon fontSize="large" style={{ color: "#7b69bc" }} />
                </IconButton>
                <h3>Employees</h3>
                <p sx={{ fontSize: "2px", color: "#333" }}>
                  {idleBillableCount + idleNonBillableCount + productionCount}
                </p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ width: "100%", height: "100%" }}>
            <CardActionArea>
              <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 1,
                  }}
                >
                  {/* Material-UI icon for Idle - Non Billable */}
                  <WorkOutlineIcon
                    fontSize="large"
                    style={{ color: "#42a883" }}
                  />
                </IconButton>
                <h3>Projects</h3>
                {selectedTeam ? (
                  <p>{teamProjects.length}</p>
                ) : (
                  <p>{allProjectNames.length}</p>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* ... (rest of your code) */}
        <Grid item xs={12} md={3}>
          <Card sx={{ width: "100%", height: "100%" }}>
            <CardActionArea>
              <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 1,
                  }}
                >
                  {/* Material-UI icon for Idle - Non Billable */}
                  <AccessTimeIcon
                    fontSize="large"
                    style={{ color: "#36a2eb" }}
                  />
                </IconButton>
                <h3>Production</h3>
                <p>{productionCount}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ width: "100%", height: "100%" }}>
            <CardActionArea>
              <CardContent sx={{ paddingTop: 3, paddingBottom: 3 }}>
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 1,
                  }}
                >
                  {/* Material-UI icon for Idle - Non Billable */}
                  <AssessmentIcon
                    fontSize="large"
                    style={{ color: "#FF6384" }}
                  />
                </IconButton>
                <h3>Idle</h3>
                <p>{idleBillableCount + idleNonBillableCount}</p>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{ width: "100%", margin: "0 auto" }}>
            <CardHeader
              title={
                <h3 style={{ fontSize: "17px" }}>
                  Billing & Non-Billing Status
                </h3>
              }
            />
            <CardContent>
              <Doughnut
                data={pieChartData}
                // width={200} // Adjust the width as needed
                // height={200} // Adjust the height as needed
                options={{
                  plugins: {
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.formattedValue || "";
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

         {/* Doughnut Chart */}
         <Grid item xs={12} md={4}>
          <Card style={{ width: "100%", margin: "0 auto" }}>
            <CardHeader
              title={
                <h3 style={{ fontSize: "17px" }}>Employee Attendance Status</h3>
              }
            />
            <CardContent>
              <Doughnut
                data={doughnutChartData}
                width={30} 
                height={30}
                options={{
                  plugins: {
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || "";
                          const value = context.formattedValue || "";
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

        <Grid item xs={12} md={4}>
          <Card style={{ width: "100%", margin: "0 auto" }}>
            <CardHeader
              title={<h3 style={{ fontSize: "17px" }}>Project Status</h3>}
            />
            <CardContent>
              {pieChartData1.labels.length > 0 && (
                <Doughnut
                  data={pieChartData1}
                  options={{
                    plugins: {
                      tooltip: {
                        enabled: true,
                        callbacks: {
                          label: (context) => {
                            const label = context.label || "";
                            const value = context.formattedValue || "";
                            const index = context.dataIndex;
                            const count = pieChartData1.datasets[0].data[index];

                            return `${label}: ${value}%`;
                          },
                        },
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* DataGrid table */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={<h3 style={{ fontSize: "17px" }}>Latest task report</h3>}
            />
            <CardContent>
              <div
                style={{
                  height: 330,
                  width: "100%",
                  // marginTop: '20px',
                  backgroundColor: "#fff",
                }}
              >
                <DataGrid
                  rows={tableData}
                  columns={[
                    { field: "id", headerName: "ID", width: 30 },
                    { field: "task", headerName: "Task", width: 200, flex: 1 },
                    {
                      field: "count",
                      headerName: "Employee Count",
                      width: 150,
                      flex: 1,
                      backgroundColor:
                        "#eff1f4" /* Set your desired background color */,
                    },
                    // Include a new column for the count
                  ]}
                  pageSize={4}
                  rowsPerPageOptions={[4, 8, 16]}
                  pagination
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title={<h3 style={{ fontSize: "17px" }}>Latest project report</h3>}/>
            <CardContent>
              <div
                style={{
                  height: 330,
                  width: "100%",
                  // marginTop: "20px",
                  backgroundColor: "#fff",
                }}
              >
                <DataGrid
                  rows={formattedData}
                  getRowId={(row) => row._id}
                  columns={columnsTwo}
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card>
            <CardHeader
              title={<h3 style={{ fontSize: "17px" }}>Task Report Status</h3>}
            />
            <CardContent>
              {chartData.labels.length > 0 && (
                <div style={{ height: "333px", overflowY: "auto" }}>
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
                          position: "top",
                        },
                      },
                      barThickness: 30, // Adjust the value to your desired thickness
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </Grid>
        

        
      </Grid>
    </DashboardLayout>
  );
};

export default TaskWiseBarChart;