import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  emp_id: String,
  emp_name: String,

  // department: String,
  email_id: String,
  designation: String,
  report_to: String,
  // doj: String, // Assuming DOJ is a date field
  // gender: String,
  // dob: String, // Assuming DOB is a date field
  // status: String,
  // confirmation_date: String, // Assuming Confirmation Date is a date field
  // age_range: String,
  // manager_id: String,
  // phone_no: String,
  // blood_group: String,
  // employment_status: String,
  // pan_no: String,
  // uan_no: String,
  // marital_status: String,
  // bank_ac_no: String,
  // nationality: String,
  // age: String,
  // current_access_card_no: String,
  // residential_status: String,
  // location: String,
  // grade: String,
  // shift: String,
    });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
