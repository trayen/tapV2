// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import backgroundGif from '../assets/275164-tunisair-tunisia-africa-planes-airline-transport.gif'

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
      setLoading(true);

      const response = await login(formData);
      localStorage.setItem('token', response.token);
      console.log('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="tunisair-service">Tunisair Service</div> 
      <div className="login-form">
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

      <img
        src={backgroundGif} // Use the imported GIF file
        alt="background-gif"
        className="login-gif"
      />
    </div>
  );
};

export default Login;
