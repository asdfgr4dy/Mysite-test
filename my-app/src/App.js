import React from 'react';
import { BrowserRouter as Router, Link, NavLink, Route, Switch } from 'react-router-dom';
import Department from './Department';
import Employee from './Employee';

function Home() {
  return (
    <div className="container py-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-5">
          <h1 className="display-6 fw-bold mb-3">Employee Management Dashboard</h1>
          <p className="lead text-muted mb-4">
            Manage departments and employee records with sorting, filters, modals, and photo uploads.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link className="btn btn-primary" to="/department">Manage Departments</Link>
            <Link className="btn btn-outline-primary" to="/employee">Manage Employees</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">EMS</span>
          <div className="navbar-nav d-flex flex-row gap-3">
            <NavLink to="/" exact className="nav-link" activeClassName="active">Home</NavLink>
            <NavLink to="/department" className="nav-link" activeClassName="active">Department</NavLink>
            <NavLink to="/employee" className="nav-link" activeClassName="active">Employee</NavLink>
          </div>
        </div>
      </nav>

      <Switch>
        <Route path="/department" component={Department} />
        <Route path="/employee" component={Employee} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
  );
}
