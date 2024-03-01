import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaList, FaBuilding, FaClipboardList, FaSignOutAlt, FaTasks, FaFileAlt,FaChartBar } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your logout logic here, remove token from localStorage
    localStorage.removeItem('token');
    // Navigate to login page or any other page after logout
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <h3>Navigation</h3>
      <ul>
        <li>
          <Link to="/create" className="sidebar-link">
            <button className="sidebar-button">
              <FaUser style={{ marginRight: '8px', fontSize: '20px' }} />
              Création d'employé
            </button>
          </Link>
        </li>
        <li>
          <Link to="/employeeList" className="sidebar-link">
            <button className="sidebar-button">
              <FaList style={{ marginRight: '8px', fontSize: '20px' }} />
              Liste d'employés
            </button>
          </Link>
        </li>
        <li>
          <Link to="/CreateBureau" className="sidebar-link">
            <button className="sidebar-button">
              <FaBuilding style={{ marginRight: '8px', fontSize: '20px' }} />
              Création d'un Bureau
            </button>
          </Link>
        </li>
        <li>
          <Link to="/BureauList" className="sidebar-link">
            <button className="sidebar-button">
              <FaClipboardList style={{ marginRight: '8px', fontSize: '20px' }} />
              Listes de Bureaux
            </button>
          </Link>
        </li>
        <li>
          <Link to="/CreateAffectation" className="sidebar-link">
            <button className="sidebar-button">
              <FaTasks style={{ marginRight: '8px', fontSize: '20px' }} />
              Création d'affectation
            </button>
          </Link>
        </li>
        <li>
          <Link to="/AffectationList" className="sidebar-link">
            <button className="sidebar-button">
              <FaFileAlt style={{ marginRight: '8px', fontSize: '20px' }} />
              Listes d'affectations
            </button>
          </Link>
        </li>
        <li>
          <Link to="/" className="sidebar-link">
            <button className="sidebar-button">
              <FaChartBar style={{ marginRight: '8px', fontSize: '20px' }} />
              Graph
            </button>
          </Link>
        </li>
        <li>
          <button className="sidebar-button danger" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '8px', fontSize: '20px', color: 'red' }} />
            Déconnexion
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
