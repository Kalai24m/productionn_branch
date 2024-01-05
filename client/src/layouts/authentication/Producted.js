import { Navigate,Outlet } from "react-router-dom";

function Protected({ isValid, children }) {
  if (!isValid) {
    return <Navigate to="/authentication/sign-in" replace />;
  }
  return children ? children: <Outlet/>;
}

export default Protected;
