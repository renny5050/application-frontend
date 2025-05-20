import React, { useState } from 'react';
import {
    CCard,
    CCardHeader,
    CCardBody,
    CFormSelect,
    CButton,
    CAlert,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell
} from '@coreui/react';


import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash } from '@coreui/icons';

const AdminUserClass = () => {
  // Estados unificados (eliminamos initialSpecialties ya que no es necesario)
  const [classesData] = useState([
    { id: 1, name: 'Matemáticas Avanzadas', professor: 'Dr. Pérez', schedule: 'Lun 10:00 - 12:00' },
    { id: 2, name: 'Física Cuántica', professor: 'Dra. Gómez', schedule: 'Mar 14:00 - 16:00' },
    { id: 3, name: 'Literatura Contemporánea', professor: 'Prof. Martínez', schedule: 'Vie 09:00 - 13:00' },
    { id: 4, name: 'Programación Web', professor: 'Ing. Rodríguez', schedule: 'Lun 16:00 - 18:00' },
    { id: 5, name: 'Historia del Arte', professor: 'Mtro. Sánchez', schedule: 'Mié 08:00 - 10:00' },
  ]);

  const [specialties, setSpecialties] = useState([
    { id: '1', name: 'Música Clásica' },
    { id: '2', name: 'Jazz Moderno' }
  ]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [error, setError] = useState('');

  const handleAddClass = () => {
    if (!selectedClassId) {
      setError('Por favor selecciona una clase');
      return;
    }
    
    // Buscar la clase seleccionada en classesData
    const selectedClass = classesData.find(cls => cls.id === Number(selectedClassId));
    
    if (selectedClass) {
      // Verificar si ya existe
      const exists = specialties.some(specialty => specialty.id === selectedClass.id.toString());
      
      if (!exists) {
        setSpecialties(prev => [
          ...prev,
          {
            id: selectedClass.id.toString(),
            name: selectedClass.name
          }
        ]);
        setError('');
        setSelectedClassId('');
      } else {
        setError('Esta clase ya está agregada');
      }
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta especialidad?')) {
      setSpecialties(prev => prev.filter(spec => spec.id !== id));
    }
  };

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Clases</h5>
        <div className="d-flex gap-2">
          <CFormSelect
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">Seleccionar Clase</option>
            {classesData.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </CFormSelect>
          <CButton color="primary" onClick={handleAddClass}>
            <CIcon icon={cilPlus} /> Agregar
          </CButton>
        </div>
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
      </CCardBody>
    </CCard>
  );
};

export default AdminUserClass;