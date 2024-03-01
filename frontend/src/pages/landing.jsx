// landing.jsx

import { Outlet } from 'react-router-dom';
import Sidebar from '../cmpnt/navbar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem('token');
       // console.log('Token before removal:', token);

        if (!token) {
          console.log('Token is missing, navigating to login');
          navigate('/login');
          return;
        }

        // Additional check to verify token validity
        const isTokenValid = await verifyTokenValidity(token);

        if (!isTokenValid) {
          console.log('Token is invalid or expired. Logging out.');
          // Token removal logic on the client side
          localStorage.removeItem('token');
          // Redirect to the login page
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:5000/landing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          // Continue with the data fetching logic...
        } else {
          // Handle other error scenarios
          console.error('Unexpected error:', response.statusText);
        }
      } catch (error) {
       // console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const verifyTokenValidity = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  if (loading) {
    // You can customize the loading state (e.g., a spinner)
    return <div>Loading...</div>;
  }

  return (
    <div className="landing-container">
      <Sidebar />
      <div className="landing-content">
        
        <Outlet />
      </div>
    </div>
  );
};

export default Landing;
