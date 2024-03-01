// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Landing from './pages/landing';
import CreateEmployee from './cmpnt/employee/create';
import ShowEmployee from './cmpnt/employee/employeeList';
import CreateBureau from './cmpnt/bureau/CreateBureau';
import BureauList from './cmpnt/bureau/BureauList';
import CreateAffectation from './cmpnt/affectation/CreateAffectation';
import AffectationList from './cmpnt/affectation/AffectationList';
import Graph from './graph/graph';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Landing />}>
          <Route path="create" element={<CreateEmployee />} />
          <Route path="employeeList" element={<ShowEmployee />} />
          <Route path="CreateBureau" element={<CreateBureau />} />
          <Route path="BureauList" element={<BureauList />} />
          <Route path="CreateAffectation" element={<CreateAffectation />} />
          <Route path="AffectationList" element={<AffectationList />} />
          <Route path="" element={<Graph/>} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
