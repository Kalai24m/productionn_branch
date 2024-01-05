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

                  }} onClick={exportChartDataToExcel}>
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
            <Grid item xs={12} md={4} >
              <TextField
                label="Start Date"
                sx={{ backgroundColor: '#fff', borderRadius: '8px', }}
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
                sx={{ backgroundColor: '#fff', borderRadius: '8px', marginLeft: '5px' }}
                value={endDate.toISOString().split('T')[0]}
                onChange={(event) => setEndDate(new Date(event.target.value))}
                fullWidth
                variant="outlined"
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={4} sx={{ padding: '8px' }}>
              <Autocomplete
                value={selectedProject}
                sx={{ backgroundColor: '#fff', borderRadius: '8px', marginLeft: '3px' }}
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
                  justifyContent: 'start',
                  fontSize: '0.7rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  minWidth: '120px',
                  marginLeft: '10px',
                  marginRight: '20px',
                  marginTop: '15px',
                }}
              >
                {/* <MDButton variant="contained" color="primary" onClick={handleViewTable}>
                {showTable ? 'Hide Table' : 'View in Table'}
              </MDButton> */}
           <CardHeader title="Task-wise Bar Chart" />
        
              </Grid>
            
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
  <Card>
  <CardHeader title="Percentage Distribution" />
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


          {/* DataGrid table */}
          <Grid item xs={12} md={12} >
            <div style={{ height: 400, width: '100%', marginTop: '20px', backgroundColor: "#fff" }} >
              <DataGrid
                rows={tableData}
                columns={[
                  { field: 'id', headerName: 'ID', width: 30 },
                  { field: 'task', headerName: 'Task', width: 200, flex: 1 },
                  { field: 'count', headerName: 'Employee Count', width: 150, flex: 1 },
                  // Include a new column for the count
                ]}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
              />
            </div>
          </Grid>
        </Grid>

      </Grid>
    </DashboardLayout>
  );
};

export default TaskWiseBarChart;
