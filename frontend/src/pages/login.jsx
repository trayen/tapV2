// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      // Set loading to true when starting the login process
      setLoading(true);

      const response = await login(formData);
      //console.log(response);

      // Store the token in local storage
      localStorage.setItem('token', response.token);

      // After successful login, handle token and navigate to the landing page
      // For now, just log a message and navigate to a dummy landing page
      console.log('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle the error (e.g., show an error message to the user)
    } finally {
      // Set loading back to false when the login process is complete
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>Connexion</h2>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleLogin} disabled={loading}>
              {loading ? 'Connexion en cours...' : 'Connexion'}
            </button>
          </form>
          <div className="mt-3">
            <Link to="/register" className="btn btn-link">Créer un compte</Link>
          </div>
        </div>
        <div className="col-md-6">
          {/* Add your image here */}
          <img
            src="https://www.businessnews.com.tn/images/album/IMGBN46134tunisair.jpg" // Replace with the actual image link
            alt="Sample"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
