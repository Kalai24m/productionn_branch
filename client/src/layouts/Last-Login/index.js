

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const LastLogin = () => {
  const [allLogins, setAllLogins] = useState([]);

  useEffect(() => {
    const fetchAllLogins = async () => {
      try {
        const response = await axios.get('user/login');
        setAllLogins(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllLogins();
  }, []);

  return (
    <DashboardLayout>
    <DashboardNavbar />
    <div>
        <h2>All Users Last Login Details</h2>
        <ul>
          {Array.isArray(allLogins) && allLogins.length > 0 ? (
            allLogins.map((login) => (
              <li key={login._id}>
                User: {login.name}, Email: {login.email}, Login Time:{' '}
                {new Date(login.loginTime).toLocaleString()}
              </li>
            ))
          ) : (
            <li>No last login details available</li>
          )}
        </ul>
      </div>
   </DashboardLayout>
  );
};

export default LastLogin;
