import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "@mui/material/Icon";
import MDBox from "./components/MDBox";
import Sidenav from "./examples/Sidenav";
import Configurator from "./examples/Configurator";
// import logo from "./assets/images/logo (1).jpg";
import logo from "./assets/images/logo-ball.png";
import logo1 from "./assets/images/logo-text.png";
import routes from "./routes";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "./context";
import { useSelector } from "react-redux";

export default function Auth() {
  const [controller, dispatch] = useMaterialUIController();
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
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const roles = useSelector(state=>state.auth.user.role)
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <>
    {layout === 'dashboard' && (
      <>
        <Sidenav
          color={sidenavColor}
          brand={(transparentSidenav && !darkMode) || whiteSidenav ? logo : logo }
          brandName={(transparentSidenav && !darkMode) || whiteSidenav ? logo1 : logo1 }
          routes={routes}
          roles={roles}
          // onMouseEnter={handleOnMouseEnter}
          // onMouseLeave={handleOnMouseLeave}
        />

        {/* <Configurator />
        {configsButton} */}
      </>
    )}
      
       {layout === "vr" && <Configurator />} 
    </>
  );
}
