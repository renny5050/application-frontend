import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const ModalSpecialty = ({ 
  show, 
  onClose, 
  onSave, 
  isEditing, 
  currentSpecialty,
  loading
}) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && currentSpecialty) {
      setFormData({
        name: currentSpecialty.name
      });
    } else {
      setFormData({ name: '' });
    }
  }, [currentSpecialty, isEditing]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    
    setError('');
    onSave(formData);
  };

  return (
    <CModal visible={show} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>
          {isEditing ? 'Editar Especialidad' : 'Nueva Especialidad'}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        <div className="mb-3">
          <CFormInput
            label="Nombre de la especialidad"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose} disabled={loading}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <CSpinner size="sm" />
          ) : 'Guardar'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const AdminSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Obtener token de autenticación
  const token = localStorage.getItem('authToken');

  // Función para obtener especialidades
  const fetchSpecialties = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3002/api/specialties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las especialidades');
      }

      const data = await response.json();
      setSpecialties(data);
    } catch (err) {
      setError(err.message || 'Error al obtener las especialidades');
    } finally {
      setLoading(false);
    }
  };

  // Cargar especialidades al montar el componente
  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Crear nueva especialidad
  const handleCreate = async (specialtyData) => {
    setActionLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3002/api/specialties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(specialtyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la especialidad');
      }

      // Recargar la lista de especialidades
      fetchSpecialties();
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Actualizar especialidad existente
  const handleUpdate = async (specialtyData) => {
    if (!editingSpecialty) return;

    setActionLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:3002/api/specialties/${editingSpecialty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(specialtyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la especialidad');
      }

      // Recargar la lista de especialidades
      fetchSpecialties();
      setModalOpen(false);
      setEditingSpecialty(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Eliminar especialidad
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta especialidad?')) {
      try {
        const response = await fetch(`http://localhost:3002/api/specialties/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar la especialidad');
        }

        // Recargar la lista de especialidades
        fetchSpecialties();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Especialidades Musicales</h5>
        <CButton 
          color="primary" 
          onClick={() => setModalOpen(true)}
          disabled={loading}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Nueva Especialidad
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        {error && <CAlert color="danger" onClose={() => setError('')} dismissible>{error}</CAlert>}
        
        {loading ? (
          <div className="text-center py-4">
            <CSpinner />
            <p>Cargando especialidades...</p>
          </div>
        ) : (
          <>
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {specialties.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="3" className="text-center py-4">
                      No hay especialidades registradas
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  specialties.map((specialty) => (
                    <CTableRow key={specialty.id}>
                      <CTableDataCell>{specialty.id}</CTableDataCell>
                      <CTableDataCell>{specialty.name}</CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          color="info" 
                          size="sm" 
                          className="me-2"
                          onClick={() => {
                            setEditingSpecialty(specialty);
                            setModalOpen(true);
                          }}
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton 
                          color="danger" 
                          size="sm"
                          onClick={() => handleDelete(specialty.id)}
                        >
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </>
        )}

        <ModalSpecialty
          show={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingSpecialty(null);
          }}
          onSave={editingSpecialty ? handleUpdate : handleCreate}
          isEditing={!!editingSpecialty}
          currentSpecialty={editingSpecialty}
          loading={actionLoading}
        />
      </CCardBody>
    </CCard>
  );
};

export default AdminSpecialties;