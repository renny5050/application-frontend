import React, { useState } from 'react';
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
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilTrash, cilPlus } from '@coreui/icons';

const ModalSpecialty = ({ 
  show, 
  onClose, 
  onSave, 
  isEditing, 
  currentSpecialty 
}) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  const [error, setError] = useState('');

  useState(() => {
    if (isEditing && currentSpecialty) {
      setFormData({
        name: currentSpecialty.name
      });
    }
  }, [currentSpecialty, isEditing]);

  const handleSubmit = () => {
    if (!formData.name) {
      setError('El nombre es requerido');
      return;
    }
    
    const specialtyData = {
      ...formData,
      id: isEditing ? currentSpecialty.id : Math.random().toString(36).substr(2, 9)
    };
    
    onSave(specialtyData);
    onClose();
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
        <CButton color="secondary" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleSubmit}>
          Guardar
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

const AdminSpecialties = () => {
  // Datos de prueba iniciales
  const initialSpecialties = [
    { id: '1', name: 'Música Clásica' },
    { id: '2', name: 'Jazz Moderno' }
  ];

  const [specialties, setSpecialties] = useState(initialSpecialties);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [error, setError] = useState('');

  const handleCreate = (specialtyData) => {
    setSpecialties([...specialties, specialtyData]);
  };

  const handleUpdate = (updatedSpecialty) => {
    setSpecialties(specialties.map(spec => 
      spec.id === updatedSpecialty.id ? updatedSpecialty : spec
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta especialidad?')) {
      setSpecialties(specialties.filter(spec => spec.id !== id));
    }
  };

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Especialidades Musicales</h5>
        <CButton 
          color="primary" 
          onClick={() => setModalOpen(true)}
        >
          <CIcon icon={cilPlus} className="me-2" />
          Nueva Especialidad
        </CButton>
      </CCardHeader>
      
      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {specialties.map((specialty) => (
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
            ))}
          </CTableBody>
        </CTable>

        <ModalSpecialty
          show={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingSpecialty(null);
          }}
          onSave={editingSpecialty ? handleUpdate : handleCreate}
          isEditing={!!editingSpecialty}
          currentSpecialty={editingSpecialty}
        />
      </CCardBody>
    </CCard>
  );
};

export default AdminSpecialties;