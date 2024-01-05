import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
// import SignIn from "layouts/authentication/sign-in/SignIn";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import Resetpwd from "./layouts/authentication/resetpwd";
import Forgotpwd from "./layouts/authentication/forgotpwd";
import Protected from "./layouts/authentication/Producted";
import { useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import { setCurrentUser, logoutUser } from "./actions/authAction";
import routes from "./routes";
import { useMaterialUIController } from "./context";
import theme from "./assets/theme";
// Images
import themeDark from "./assets/theme-dark";
import brandWhite from "./assets/images/logo-ct.png";
import brandDark from "./assets/images/logo-ct-dark.png";
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import Auth from "./Auth";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import AdminReport from "./layouts/AdminReport";
import BillingReport from "./layouts/Billing-report";
import Edit from "./layouts/Billing-report/Edit";
import BillingTable from "./layouts/Billing-Table";
import CreateTeam from "./layouts/create-team";
import Profile from "./layouts/profile";
import UserReport from "./layouts/UserReport";
import Employee from "./layouts/employeeReport";
import Attendance from "layouts/Attendance";
import EmployeeAtt from "layouts/Emp-Attendance";
import TaskCreation from "layouts/Task-creation";
import AdminProjects from "layouts/adminProjects"
// import LastLogin from "layouts/Last-Login";
import AllEmployee from "layouts/All-Employees";
import AllReport from "./layouts/IdleReport"
import ProjectEdit from "layouts/ProjectEditAdmin"
import 'layouts/Attendance/calendar.css';
import { from } from "stylis";

function App() {
  const [controller] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector(state=>state.auth.user.role);
  // console.log(role);
  useEffect(() => {
    if (localStorage.jwtToken) {
      // Set auth token header auth
      const token = localStorage.jwtToken;
      setAuthToken(token);
      // Decode token and get user info and exp
      const decoded = jwt_decode(token);
      // Set user and isAuthenticated
      store.dispatch(setCurrentUser(decoded));
      // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds
      if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());

        // Redirect to login
        // window.location.href = "/sign-in";
        window.location.href = "/authentication/sign-in"
      }
    }
  }, []);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }
      if (route.route) {
        return (
          <Route
            key={route.route}
            exact
            path={route.route}
            element={<Protected isValid={(isLoggedIn&&role==='admin')}>{route.component}</Protected>}
          />
        );
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {isLoggedIn ? <Auth /> : ""}
      <Routes>
        <Route exact path={"/auth"} element={<Auth/>}/>
        <Route exact path="/authentication/sign-in" element={<SignIn />} />
        <Route exact path="/authentication/sign-up" element={<SignUp />} />
        <Route exact path="/authentication/reset/:token" element={<Resetpwd />} />
        <Route exact path="/authentication/forgotpwd" element={<Forgotpwd />} />
        {/* {getRoutes(routes)} */}
        <Route element={<Protected isValid={isLoggedIn}/>}>
          <Route exact path="/dashboard" element={<Dashboard/>}/>
          <Route exact path="/profile" element={<Profile/>}/>
          {/* <Route exact path="/attendance" element={<Attendance/>}/> */}
        </Route>
        <Route element={<Protected isValid={(isLoggedIn&&(role === 'superadmin' || role === 'admin'))}/>}>
          <Route exact path="/task-report" element={<AdminReport/>} />
        </Route>
        <Route element={<Protected isValid={(isLoggedIn&&role==='superadmin')}/>}>
          <Route exact path="/employees" element={<AllEmployee/>} />
        </Route>
        <Route element={<Protected isValid={(isLoggedIn&&role==='admin')}/>}>
          <Route exact path="/employee" element={<Employee/>} />
        </Route>
        <Route element={<Protected isValid={(isLoggedIn&&(role === 'superadmin' || role === 'admin'))}/>}>
          <Route exact path="/employee-attendance" element={<EmployeeAtt/>} />
        </Route>  
        <Route element={<Protected isValid={(isLoggedIn&&(role === 'superadmin'))}/>}>
          <Route exact path="/allreport" element={<AllReport/>} />
        </Route> 
        <Route element={<Protected isValid={(isLoggedIn&&(role === 'superadmin'))}/>}>
          <Route exact path="/projects-admin" element={<AdminProjects/>} />
        </Route>    
        <Route element={<Protected isValid={(isLoggedIn&&role==='analyst')}/>}>
          <Route exact path="/attendance" element={<Attendance/>} />
        </Route>
        <Route element={<Protected isValid={(isLoggedIn&&role==='superadmin')}/>}>
          <Route exact path="/Settings" element={<TaskCreation/>} />
        </Route>
        {/* <Route element={<Protected isValid={(isLoggedIn&&role==='superadmin')}/>}>
          <Route exact path="/LastLogin" element={<LastLogin/>} />
        </Route> */}

        .
        
        <Route element={<Protected isValid={(isLoggedIn&&role==='analyst')}/>}>
          <Route exact path="/user-task" element={<UserReport/>} />
        </Route> <Route element={<Protected isValid={(isLoggedIn&&(role === 'superadmin' || role === 'admin'))}/>}>
          <Route exact path="/project-entry" element={<BillingReport />} />
          <Route exact path="/project-entry/edit/:id" element={<Edit/>} />
          <Route exact path="/projects" element={<BillingTable />} />
          <Route exact path="/create-team" element={<CreateTeam />} />
        </Route>
        {isLoggedIn ? (
        <Route
        exact
        path="*"
        element={
          isLoggedIn && (role === 'analyst' || role === 'admin' || role === 'superadmin') ? (
            <Dashboard/>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      
        ) : (
          <Route exact path="/" element={<Navigate to="/authentication/sign-in" />} />
        )}
     <Route exact path="/" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
    </ThemeProvider>
  );
}
export default App;
