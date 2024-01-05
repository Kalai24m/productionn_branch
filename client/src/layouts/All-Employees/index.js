// src/pages/Employees.js
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  Button,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  Divider,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { read, utils } from 'xlsx';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import MDButton from "components/MDButton";

const excelRowSchema = {
  emp_id: '',
  emp_name: '',
  email_id: '',
  // status: '',
  // confirmation_date: Date,
  // age_range: '',
  // manager_id: '',
  report_to: '',
  // phone_no: '',
  // blood_group: '',
  // employment_status: '',
  // pan_no: '',
  // uan_no: '',
  // marital_status: '',
  // bank_ac_no: '',
  // nationality: '',
  // age: '',
  // current_access_card_no: '',
  // residential_status: '',
  // location: '',
  designation: '',
  // department: '',
  // grade: '',
  // shift: '',
};

function Employees() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [newEmployeeData, setNewEmployeeData] = useState({
    emp_id: '',
    emp_name: '',
    email_id: '',
    // status: '',
    // confirmation_date: Date,
    // age_range: '',
    // manager_id: '',
    report_to: '',
    // phone_no: '',
    // blood_group: '',
    // employment_status: '',
    // pan_no: '',
    // uan_no: '',
    // marital_status: '',
    // bank_ac_no: '',
    // nationality: '',
    // age: '',
    // current_access_card_no: '',
    // residential_status: '',
    // location: '',
    designation: '',
    // department: '',
    // grade: '',
    // shift: '',
  });
  const handleSelectColumns = (selectedColumns) => {
    setSelectedColumns(selectedColumns);
  };
  
  const [columns, setColumns] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

// ... const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedViewEmployee, setSelectedViewEmployee] = useState(null);

  const handleViewEmployee = (id) => {
    // Find the selected employee from the data
    const selectedEmployee = data.find((emp) => emp.id === id);

    // Set the selected employee data
    setSelectedViewEmployee(selectedEmployee);

    // Open the View dialog
    setIsViewDialogOpen(true);
  };

  // ... (existing code)

  // JSX for the "View" icon in the DataGrid
  const ViewButton = ({ onClick, id }) => (
    <IconButton color="info" onClick={() => handleViewEmployee(id)}>
      <VisibilityIcon />
    </IconButton>
  );

const capitalizeHeader = (header) => header.toUpperCase();

// ...

useEffect(() => {
  // Fetch initial data from MongoDB
  const fetchDataFromMongoDB = async () => {
    try {
      const response = await fetch(`${apiUrl}/fetchData`);
      const fetchData = await response.json();
  
      // Filter out "__v" field from columns
      const filteredColumns = fetchData.columns
        .filter((col) => col !== '__v')
        .map((col) => ({ field: col, headerName: capitalizeHeader(col), width: 230 }));
  
      // Set initial selected columns (you can customize this based on your requirement)
      const initialSelectedColumns = filteredColumns.slice(0, 5).map((col) => col.field);
  
      setColumns(filteredColumns);
      setData(fetchData.rows);
      setSelectedColumns(initialSelectedColumns);
    } catch (error) {
      console.error('Error fetching data from MongoDB', error);
    }
  };
  

  fetchDataFromMongoDB();
}, []);

// ...

// Use capitalizeHeader in other places where you define or update columns

// ...

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      setIsLoading(true);

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const binaryString = e.target.result;
          const workbook = read(binaryString, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const sheetData = utils.sheet_to_json(worksheet, { header: 1 });
          const sheetColumns = sheetData[0];

          // Validation function
          const validateSchema = (columns, schema) => {
            const schemaKeys = Object.keys(schema).map((key) => key.toLowerCase().replace(/\s+/g, '_'));
            console.log('Actual Schema Keys:', columns);
            console.log('Expected Schema Keys:', schemaKeys);

            // Check if all schema keys are present in columns
            return schemaKeys.every((key) => columns.some((col) => col.toLowerCase().replace(/\s+/g, '_') === key));
          };

          // Validate the schema
          if (!validateSchema(sheetColumns, excelRowSchema)) {
            console.error('Invalid Excel schema');
            setSnackbarMessage('Invalid Excel schema');
            setSnackbarOpen(true);
            setIsLoading(false);
            return;
          }

          const formattedData = sheetData.slice(1).map((row, index) => {
            const rowData = {};
            if (row.length > 0) {
              row.forEach((cell, i) => {
                const columnName = sheetColumns[i].toLowerCase().replace(/\s+/g, '_');
                rowData[columnName] = cell;
              });
              rowData.id = index + 1;
            }
            return rowData;
          });

          setColumns(sheetColumns.map((col) => ({ field: col, headerName: col, width: 150 })));
          setData(formattedData);

          // Save the data to MongoDB
          const response = await fetch(`${apiUrl}/uploadData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formattedData),
          });

          if (response.ok) {
            setSnackbarMessage('Data saved to MongoDB');

            // Fetch the data from MongoDB
            const fetchDataResponse = await fetch(`${apiUrl}/fetchData`);
            const fetchData = await fetchDataResponse.json();

            setColumns(fetchData.columns.map((col) => ({ field: col, headerName: col, width: 150 })));
            setData(fetchData.rows);

            setSnackbarOpen(true);
          } else {
            setSnackbarMessage('Failed to save data to MongoDB');
            setSnackbarOpen(true);
          }
        } catch (error) {
          console.error('Error processing Excel file or communicating with the server', error);
          setSnackbarMessage('Error processing Excel file or communicating with the server');
          setSnackbarOpen(true);
        } finally {
          setIsLoading(false);
        }
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    // Reset the new employee data when closing the form
    setNewEmployeeData({
      emp_id: '',
      emp_name: '',
      email_id: '',
      // status: '',
      // confirmation_date: Date,
      // age_range: '',
      // manager_id: '',
      report_to: '',
      // phone_no: '',
      // blood_group: '',
      // employment_status: '',
      // pan_no: '',
      // uan_no: '',
      // marital_status: '',
      // bank_ac_no: '',
      // nationality: '',
      // age: '',
      // current_access_card_no: '',
      // residential_status: '',
      // location: '',
      designation: '',
      // department: '',
      // grade: '',
      // shift: '',
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const handleApiRequest = async (url, method, body = null) => {
    try {
      setIsLoading(true);
  
      const requestOptions = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      };
  
      const response = await fetch(url, requestOptions);
  
      if (response.ok) {
        setSnackbarMessage(`Operation completed successfully`);
      } else {
        setSnackbarMessage(`Failed to ${capitalizeFirstLetter(method.toLowerCase())} employee`);
      }
  
      // Fetch the updated data from MongoDB
      const fetchDataResponse = await fetch(`${apiUrl}/fetchData`);
      const fetchData = await fetchDataResponse.json();
  
      setColumns(fetchData.columns.map((col) => ({ field: col, headerName: col, width: 150 })));
      setData(fetchData.rows);
  
      setSnackbarOpen(true);
  
      if (method === 'POST' || method === 'PUT') {
        setIsFormOpen(false); // Close the form after adding or updating an employee
      }
    } catch (error) {
      console.error(`Error ${capitalizeFirstLetter(method.toLowerCase())} employee or communicating with the server`, error);
      setSnackbarMessage(`Error ${capitalizeFirstLetter(method.toLowerCase())} employee or communicating with the server`);
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ...
  
  const handleAddEmployee = async () => {
    await handleApiRequest(`${apiUrl}/addEmployee`, 'POST', newEmployeeData);
  };
  
  const handleDeleteEmployee = async (id) => {
    await handleApiRequest(`${apiUrl}/deleteEmployee/${id}`, 'DELETE');
  };
  
  const handleUpdateEmployee = async () => {
    await handleApiRequest(`${apiUrl}/updateEmployee/${selectedEmployeeId}`, 'PUT', newEmployeeData);
  };
  

  const handleEditEmployee = (id) => {
    // Find the selected employee from the data
    const selectedEmployee = data.find((emp) => emp.id === id);

    // Open the form with the existing data for editing
    setNewEmployeeData({ ...selectedEmployee });
    setSelectedEmployeeId(id);
    setIsFormOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', padding: '16px' }}>
            <div>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <MDButton component="span" variant="contained" color="success" style={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  borderRadius: "10px",
                  textAlign: "center",
                  minHeight: "10px",
                  minWidth: "120px",

                }}>
                  Import
                </MDButton>
              </label>
            </div>&nbsp;&nbsp;
            <MDButton
              variant="outlined"
              color="info"
              onClick={handleOpenForm}
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
              Add Employee
            </MDButton>
          </div>
          <Card>

            {isLoading && <CircularProgress />}
            {!isLoading && (
              <div style={{ height: 770, width: '100%' }}>
      <DataGrid
  rows={data}
  rowsPerPageOptions={[5, 10, 25, 50, 100]}
  columns={[
    ...columns.filter((col) => selectedColumns.includes(col.field)), // Filter columns based on selection
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
               <IconButton color="info">
          <ViewButton  id={params.id} />
          </IconButton> |
     
          <IconButton color="secondary" onClick={() => handleEditEmployee(params.id)}>
            <EditIcon /> 
          </IconButton> |
          <IconButton color="error" onClick={() => handleDeleteEmployee(params.id)}>
            <DeleteIcon />
          </IconButton>
   
        </>
      ),
    },
  ]}
  checkboxSelection
  components={{
    Toolbar: () => (
      <GridToolbar
        selectedColumns={selectedColumns}
        onColumnsChange={handleSelectColumns}
        columns={columns}
      />
    ),
  }}
/>

              </div>
            )}
          </Card>
        </Grid>

        <Dialog open={isFormOpen} onClose={handleCloseForm}>
          <DialogTitle style={{ background: '#2196f3', color: 'white' }}>{selectedEmployeeId ? 'Update Employee' : 'Add Employee'}</DialogTitle>
          <DialogContent >
            <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Employee ID"
              value={newEmployeeData.emp_id}
              type='text'
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, emp_id: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              label="Employee Name"
              value={newEmployeeData.emp_name}
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, emp_name: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            </div>
            <div       
            style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            {/* <TextField
              label="Doj" 
              value={newEmployeeData.doj}
              type='text'
              onChange={(e) =>
                setNewEmployeeData({ ...newEmployeeData, doj: e.target.value })
              }
              fullWidth
              margin="normal"
            /> */}
            {/* <TextField
              label="Gender"
              value={newEmployeeData.gender}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, gender: e.target.value })}
              fullWidth
              margin="normal"
            /> */}
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            {/* <TextField
              label="Dob"
              type='text'
              value={newEmployeeData.dob}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, dob: e.target.value })}
              fullWidth
              margin="normal"
            /> */}
            <TextField
              label="Email Id"
              type='email'
              value={newEmployeeData.email_id}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email_id: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             {/* <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Status"
              value={newEmployeeData.status}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, status: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirmation Date"
              type='date'
              value={newEmployeeData.confirmation_date}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, confirmation_date: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Age Range"
              type='number'
              value={newEmployeeData.age_range}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, age_range: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Manager Id"
              type='number'
              value={newEmployeeData.manager_id}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, manager_id: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div> */}
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Manager Name"
              value={newEmployeeData.report_to}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, report_to: e.target.value })}
              fullWidth
              margin="normal"
            />
                      <TextField
              label="Designation"
              value={newEmployeeData.designation}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, designation: e.target.value })}
              fullWidth
              margin="normal"
            />
            {/* <TextField
              label="Phone No"
              type='phone'
              value={newEmployeeData.phone_no}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, phone_no: e.target.value })}
              fullWidth
              margin="normal"
            /> */}
             </div>
             {/* <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Blood Group"
              value={newEmployeeData.blood_group}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, blood_group: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Employment Status"
              value={newEmployeeData.employment_status}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, employment_status: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Pan No"
              type='number'
              value={newEmployeeData.pan_no}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, pan_no: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Uan No"
              type='number'
              value={newEmployeeData.uan_no}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, uan_no: e.target.value })}
              fullWidth
              margin="normal"
            />
 </div>
 <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Marital Status"
              value={newEmployeeData.marital_status}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, marital_status: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bank Ac No"
              type='number'
              value={newEmployeeData.bank_ac_no}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, bank_ac_no: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Nationality"
              value={newEmployeeData.nationality}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, nationality: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              type='number'
              value={newEmployeeData.age}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, age: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Current Access Card No"
              type='number'
              value={newEmployeeData.current_access_card_no}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, current_access_card_no: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Residential Status"
              value={newEmployeeData.residential_status}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, residential_status: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Location"
              value={newEmployeeData.location}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, location: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Designation"
              value={newEmployeeData.designation}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, designation: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
             <div        style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "0.7rem",
                borderRadius: "10px",
                textAlign: "center",
                minHeight: "10px",
                minWidth: "120px",
                gap: "10px"
              }}>
            <TextField
              label="Department"
              value={newEmployeeData.department}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, department: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Grade"
              value={newEmployeeData.grade}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, grade: e.target.value })}
              fullWidth
              margin="normal"
            />
             </div>
       
            <TextField
              label="Shift"
              value={newEmployeeData.shift}
              onChange={(e) => setNewEmployeeData({ ...newEmployeeData, shift: e.target.value })}
              fullWidth
              margin="normal"
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="primary">
              Cancel
            </Button>
            <Button
              onClick={selectedEmployeeId ? handleUpdateEmployee : handleAddEmployee}
              color="primary"
            >
              {selectedEmployeeId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)}>
        <DialogTitle style={{ background: '#2196f3', color: 'white' }}>View Employee</DialogTitle>
        <DialogContent>
          {selectedViewEmployee && (
            <Grid container spacing={2} mt={1}>
              {Object.entries(selectedViewEmployee).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                      {key}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">{value}</Typography>
                  </Grid>
                  <Divider variant="middle" />
                </React.Fragment>
              ))}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Grid>
    </DashboardLayout>
  );
}

export default Employees;
