import React, { useEffect, useMemo, useState } from 'react';
import { API_URL, PHOTO_URL } from './Variables';

const defaultForm = {
  EmployeeName: '',
  Department: '',
  DateOfJoining: '',
  PhotoFileName: '',
};

export default function Employee() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchEmployees = async () => {
    const response = await fetch(`${API_URL}employees`);
    const data = await response.json();
    setEmployees(Array.isArray(data) ? data : []);
  };

  const fetchDepartments = async () => {
    const response = await fetch(`${API_URL}department`);
    const data = await response.json();
    setDepartments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchName = emp.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDepartment = emp.Department.toLowerCase().includes(searchTerm.toLowerCase());
      return matchName || matchDepartment;
    });
  }, [employees, searchTerm]);

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData(defaultForm);
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      EmployeeName: employee.EmployeeName,
      Department: employee.Department,
      DateOfJoining: employee.DateOfJoining,
      PhotoFileName: employee.PhotoFileName,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      return formData.PhotoFileName;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', selectedFile);

    const response = await fetch(`${API_URL}employee/savefile`, {
      method: 'POST',
      body: formDataUpload,
    });

    const result = await response.json();
    return result.filename || '';
  };

  const handleSave = async () => {
    const photoName = await uploadFile();
    const payload = {
      EmployeeName: formData.EmployeeName,
      Department: formData.Department,
      DateOfJoining: formData.DateOfJoining,
      PhotoFileName: photoName || formData.PhotoFileName,
    };

    const method = editingEmployee ? 'PUT' : 'POST';
    const url = editingEmployee
      ? `${API_URL}employee/${editingEmployee.EmployeeId}`
      : `${API_URL}employees`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setShowModal(false);
      fetchEmployees();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) {
      return;
    }

    const response = await fetch(`${API_URL}employee/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchEmployees();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Employees</h2>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>Add Employee</button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or department"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <tr key={emp.EmployeeId}>
                  <td>{emp.EmployeeId}</td>
                  <td>
                    {emp.PhotoFileName ? (
                      <img
                        src={`${PHOTO_URL}${emp.PhotoFileName}`}
                        alt={emp.EmployeeName}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ) : (
                      <div className="bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, borderRadius: 8 }}>
                        N/A
                      </div>
                    )}
                  </td>
                  <td>{emp.EmployeeName}</td>
                  <td>{emp.Department}</td>
                  <td>{emp.DateOfJoining}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(emp)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.EmployeeId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body row g-3">
                <div className="col-md-6">
                  <label className="form-label">Employee Name</label>
                  <input
                    className="form-control"
                    value={formData.EmployeeName}
                    onChange={(e) => setFormData({ ...formData, EmployeeName: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={formData.Department}
                    onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.DepartmentId} value={dept.DepartmentName}>
                        {dept.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date of Joining</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.DateOfJoining}
                    onChange={(e) => setFormData({ ...formData, DateOfJoining: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Upload Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
