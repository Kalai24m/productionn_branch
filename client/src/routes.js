// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Resetpwd from "layouts/authentication/resetpwd";
import Forgotpwd from "layouts/authentication/forgotpwd";
import UserReport from "layouts/UserReport";
import AdminReport from "layouts/AdminReport";
import BillingReport from "layouts/Billing-report";
import BillingTable from "layouts/Billing-Table";
 import EmployeeAtt from "./layouts/Emp-Attendance";
// import CreateTeam from "layouts/create-team";
// import Edit from 'layouts/Billing-report/Edit'
import Attendance from "layouts/Attendance";
import TaskCreation from "layouts/employeeReport"
import LastLogin from "layouts/Last-Login";
import AllEmployee from "layouts/All-Employees"
import AdminProjects from "layouts/adminProjects"
import ProjectEdit from "layouts/ProjectEditAdmin"
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import AllReport from "./layouts/IdleReport"
// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    role: "analyst",
  },
  {
    type: "collapse",
    name: "AllReport",
    key: "allreport",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/allreport",
    component: <AllReport />,
    role: "superadmin",
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    role: "admin",
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    role: "superadmin",
  },
  {
    type: "collapse",
    name: "Employee Attendance",
    key: "employee-attendance",
    icon: <Icon fontSize="small">create_new_folder</Icon>,
    route: "/employee-attendance",
    component: <EmployeeAtt/>,
    role: "admin",
  },
  {
    type: "collapse",
    name: "Employee Attendance",
    key: "employee-attendance",
    icon: <Icon fontSize="small">create_new_folder</Icon>,
    route: "/employee-attendance",
    component: <EmployeeAtt/>,
    role: "superadmin",
  },
  {
    type: "collapse",
    name: "Employees",
    key: "employees",
    icon: <Icon fontSize="small">peopleIcon</Icon>,
    route: "/employees",
    component: <AllEmployee />,
    role: "superadmin",
  },
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "attendance",
    component: <Attendance />,
    role: "analyst",
  },
  {
    type: "collapse",
    name: "UserTask",
    key: "user-task",
    icon: <Icon fontSize="small">leaderboard</Icon>,
    route: "/user-task",
    component: <UserReport />,
    role: "analyst",
  },
  {
    type: "collapse",
    name: "Task Report",
    key: "task-report",
    icon: <Icon fontSize="small">switch_account</Icon>,
    route: "/task-report",
    component: <AdminReport />,
    role: "admin",
  },
  {
    type: "collapse",
    name: "Task Report",
    key: "task-report",
    icon: <Icon fontSize="small">switch_account</Icon>,
    route: "/task-report",
    component: <AdminReport />,
    role: "superadmin",
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects-admin",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/projects-admin",
    component: <AdminProjects />,
    role: "superadmin",
  },

  // {
  //   type: "collapse",
  //   name: "Employee",
  //   key: "employee",
  //   icon: <Icon fontSize="small">switch_account</Icon>,
  //   route: "/employee",
  //   component: <Employee />,
  //   role: "admin",
  // },

  // {
  //   type: "collapse",
  //   name: "BillingReport",
  //   key: "billing-report",
  //   icon: <Icon fontSize="small">trending_up</Icon>,
  //   route: "/billing-report",
  //   component: <BillingReport />,
  //   role: "admin",
  // },
  // {
  //   key:"editReport",
  //   route: "/billing-report/edit",
  //   component: <Edit />,
  //   role: "admin",
  // },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <Icon fontSize="small">trending_up</Icon>,
    route: "/projects",
    component: <BillingTable />,
    role: "admin",
  },
  // {
  //   type: "collapse",
  //   name: "Projects",
  //   key: "projects",
  //   icon: <Icon fontSize="small">trending_up</Icon>,
  //   route: "/projects",
  //   component: <BillingTable />,
  //   role: "superadmin",
  // },
  {
    type: "collapse",
    name: "Settings",
    key: "Settings",
    icon: <Icon fontSize="small">settingsIcon</Icon>,
    route: "/Settings",
    component: <TaskCreation />,
    role: "superadmin",
  },
  // {
  //   type: "collapse",
  //   name: "LastLogin",
  //   key: "LastLogin",
  //   icon: <Icon fontSize="small">settingsIcon</Icon>,
  //   route: "/LastLogin",
  //   component: <LastLogin />,
  //   role: "superadmin",
  // },
  // {
  //   type: "collapse",
  //   name: "Create Team",
  //   key: "create-team",
  //   icon: <Icon fontSize="small">groups</Icon>,
  //   route: "/create-team",
  //   component: <CreateTeam />,
  //   role: "admin",
  // },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Resetpwd",
    key: "resetpwd",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/reset/:token",
    component: <Resetpwd />,
  },
  {
    type: "collapse",
    name: "Forgotpwd",
    key: "forgotpwd",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/forget",
    component: <Forgotpwd />,
  },
];

export default routes;
