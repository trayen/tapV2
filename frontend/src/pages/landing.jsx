import { Outlet } from 'react-router-dom';
import Sidebar from '../cmpnt/navbar';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/root'; 

const Landing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem('token');

        if (!token) {
          console.log('Token is missing, navigating to login');
          navigate('/login');
          return;
        }

        const isTokenValid = await verifyTokenValidity(token);

        if (!isTokenValid) {
          console.log('Token is invalid or expired. Logging out.');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/landing`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
        } else {
          console.error('Unexpected error:', response.statusText);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const verifyTokenValidity = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-token`, {
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
