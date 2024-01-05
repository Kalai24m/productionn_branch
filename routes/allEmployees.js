import express from 'express';
const router = express.Router();
import Employee from '../models/excelUpload.js';

// POST route for uploading data
router.post('/uploadData', async (req, res) => {
  try {
    const data = req.body;

    // Extract email IDs from the incoming data
    const emailIds = data.map(employeeData => employeeData.email_id);

    // Find existing employees with the extracted email IDs
    const existingEmployees = await Employee.find({ email_id: { $in: emailIds } });

    // Create a map of existing employees for quick access
    const existingEmployeeMap = new Map(existingEmployees.map(emp => [emp.email_id, emp]));

    // Prepare an array for bulk insertion
    const bulkInsertData = [];

    for (const employeeData of data) {
      const existingEmployee = existingEmployeeMap.get(employeeData.email_id);

      if (existingEmployee) {
        // Merge existing employee data with the new data
        const mergedData = { ...existingEmployee.toObject(), ...employeeData };
        bulkInsertData.push({ updateOne: { filter: { _id: existingEmployee._id }, update: mergedData } });
      } else {
        // If no existing employee, create a new one
        bulkInsertData.push({ insertOne: { document: employeeData } });
      }
    }

    // Use insertMany for bulk insertion and updating
    await Employee.bulkWrite(bulkInsertData);

    res.status(200).json({ message: 'Data saved to MongoDB' });
  } catch (error) {
    console.error('Error saving data to MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route for fetching data
router.get('/fetchData', async (req, res) => {
  try {
    const employees = await Employee.find({});
    const columns = Object.keys(Employee.schema.paths).filter((col) => col !== '_id');
    const rows = employees.map((emp) => ({ ...emp.toObject(), id: emp._id }));

    res.status(200).json({ columns, rows });
  } catch (error) {
    console.error('Error fetching data from MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST route for adding an employee
router.post('/addEmployee', async (req, res) => {
  try {
    const newEmployeeData = req.body;
    const newEmployee = new Employee(newEmployeeData);
    await newEmployee.save();

    res.status(200).json({ message: 'Employee added successfully' });
  } catch (error) {
    console.error('Error adding employee to MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE route for deleting an employee
router.delete('/deleteEmployee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee from MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT route for updating an employee
router.put('/updateEmployee/:id', async (req, res) => {
  const { id } = req.params;
  const updatedEmployeeData = req.body;

  try {
    await Employee.findByIdAndUpdate(id, updatedEmployeeData);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee in MongoDB', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
