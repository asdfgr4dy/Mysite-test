import React, { useEffect, useMemo, useState } from 'react';
import { API_URL } from './Variables';

const defaultForm = { DepartmentName: '' };

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('DepartmentId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const fetchDepartments = async () => {
    const response = await fetch(`${API_URL}department`);
    const data = await response.json();
    setDepartments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    const filtered = departments.filter((dept) =>
      dept.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const left = a[sortField];
      const right = b[sortField];
      const factor = sortDirection === 'asc' ? 1 : -1;

      if (typeof left === 'string' && typeof right === 'string') {
        return left.localeCompare(right) * factor;
      }

      return (Number(left) - Number(right)) * factor;
    });
  }, [departments, searchTerm, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const openCreateModal = () => {
    setEditingDepartment(null);
    setFormData(defaultForm);
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setFormData({ DepartmentName: department.DepartmentName });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = { DepartmentName: formData.DepartmentName };

    const method = editingDepartment ? 'PUT' : 'POST';
    const url = editingDepartment
      ? `${API_URL}department/${editingDepartment.DepartmentId}`
      : `${API_URL}department`;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setShowModal(false);
      fetchDepartments();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) {
      return;
    }

    const response = await fetch(`${API_URL}department/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchDepartments();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Departments</h2>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>Add Department</button>
      </div>

      <div className="row mb-3 g-2">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <span className="me-2 text-muted">Sort by:</span>
          <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleSort('DepartmentId')}>
            ID {sortField === 'DepartmentId' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </button>
          <button className="btn btn-sm btn-outline-dark" onClick={() => handleSort('DepartmentName')}>
            Name {sortField === 'DepartmentName' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Department Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <tr key={dept.DepartmentId}>
                  <td>{dept.DepartmentId}</td>
                  <td>{dept.DepartmentName}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-warning me-2" onClick={() => openEditModal(dept)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.DepartmentId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">No departments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingDepartment ? 'Edit Department' : 'Add Department'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.DepartmentName}
                    onChange={(e) => setFormData({ ...formData, DepartmentName: e.target.value })}
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
