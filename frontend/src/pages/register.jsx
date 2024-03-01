// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signup(formData);
      console.log(response);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <h2>Inscription</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
              <input type="text" className="form-control" id="username" name="username" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">S'inscrire</button>
          </form>
          <div className="mt-3">
            <Link to="/login" className="btn btn-link">Déjà inscrit? Connectez-vous ici</Link>
          </div>
        </div>
        <div className="col-md-6">
          {/* Add your image here */}
          <img
            src="https://www.businessnews.com.tn/images/album/IMGBN46134tunisair.jpg"
            alt="Tunisair"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
