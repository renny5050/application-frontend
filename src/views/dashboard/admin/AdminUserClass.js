import React, { useState, useEffect } from 'react';
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
    CTableDataCell,
    CSpinner
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash } from '@coreui/icons';

const AdminUserClass = ({ user, classes, loading }) => {
  // Extraer propiedades del usuario
  const userId = user?.id;
  const userRole = user?.role;
  
  const [assignedClasses, setAssignedClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  // Función segura para formatear horas
  const formatTime = (timeString) => {
    if (!timeString) return '--:-- --';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const suffix = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${suffix}`;
    } catch (error) {
      console.error('Error formateando hora:', error);
      return '--:-- --';
    }
  }

  // Obtener clases asignadas al usuario
  const fetchAssignedClasses = async () => {
    // Solo cargar si es estudiante
    if (userRole !== 3) return;
    
    setLoadingAssigned(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const endpoint = `http://localhost:3002/api/studentclass/student/${userId}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener clases asignadas');
      }

      const data = await response.json();

      console.log('Clases asignadas obtenidas:', data);
      
      // Formatear las clases asignadas
      const formattedClasses = data.map(cls => ({
        id: cls.class_id,
        specialty_name: cls.specialty_name,
        day: cls.day,
        schedule: `${formatTime(cls.start_time)} - ${formatTime(cls.end_time)}`,
        teacher_name: cls.teacher_name
      }));
      
      setAssignedClasses(formattedClasses);
    } catch (error) {
      console.error('Error fetching assigned classes:', error);
      setFetchError(error.message || 'Error al cargar clases asignadas');
    } finally {
      setLoadingAssigned(false);
    }
  };

  // Cargar clases asignadas cuando cambia el usuario o rol
  useEffect(() => {
    fetchAssignedClasses();
  }, [userId, userRole]);

  const handleAddClass = async () => {
    if (!selectedClassId) {
      setError('Por favor selecciona una clase');
      return;
    }
    
    // Solo estudiantes pueden ser asignados a clases
    if (userRole !== 3) {
      setError('Solo estudiantes pueden ser asignados a clases');
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:3002/api/studentclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: userId,
          class_id: parseInt(selectedClassId)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al asignar clase');
      }

      // Actualizar lista de clases asignadas
      fetchAssignedClasses();
      setSelectedClassId('');
    } catch (error) {
      console.error('Error assigning class:', error);
      setError(error.message || 'Error al asignar clase');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta clase asignada?')) {
      return;
    }

    try {
      console.log('Eliminando clase asignada:', classId);
      setIsDeleting(classId);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch('http://localhost:3002/api/studentclass', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: userId,
          class_id: classId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar asignación');
      }

      // Actualizar lista local
      setAssignedClasses(prev => prev.filter(cls => cls.id !== classId));
    } catch (error) {
      console.error('Error deleting class assignment:', error);
      setError(error.message || 'Error al eliminar asignación');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading || loadingAssigned) {
    return (
      <CCard>
        <CCardHeader>
          <h5>Clases Asignadas</h5>
        </CCardHeader>
        <CCardBody className="text-center">
          <CSpinner />
          <p>Cargando clases asignadas...</p>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5>Clases Asignadas</h5>
        {userRole === 3 && (
          <div className="d-flex gap-2">
            <CFormSelect
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={isAdding}
            >
              <option value="">Seleccionar Clase</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.specialty_name} - {cls.day} ({formatTime(cls.start_time)} a {formatTime(cls.end_time)})
                </option>
              ))}
            </CFormSelect>
            <CButton 
              color="primary" 
              onClick={handleAddClass}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <CSpinner size="sm" /> Asignando...
                </>
              ) : (
                <>
                  <CIcon icon={cilPlus} /> Asignar
                </>
              )}
            </CButton>
          </div>
        )}
      </CCardHeader>

      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {fetchError && <CAlert color="danger">{fetchError}</CAlert>}

        {userRole !== 3 ? (
          <div className="text-center py-4">
            <p>Las clases solo se asignan a estudiantes</p>
          </div>
        ) : assignedClasses.length === 0 ? (
          <div className="text-center py-4">
            <p>No hay clases asignadas</p>
          </div>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>ID</CTableHeaderCell>
                <CTableHeaderCell>Especialidad</CTableHeaderCell>
                <CTableHeaderCell>Día</CTableHeaderCell>
                <CTableHeaderCell>Horario</CTableHeaderCell>
                <CTableHeaderCell>Profesor</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {assignedClasses.map((cls) => (
                <CTableRow key={cls.id}>
                  <CTableDataCell>{cls.id}</CTableDataCell>
                  <CTableDataCell>{cls.specialty_name}</CTableDataCell>
                  <CTableDataCell>{cls.day}</CTableDataCell>
                  <CTableDataCell>{cls.schedule}</CTableDataCell>
                  <CTableDataCell>{cls.teacher_name}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
                      disabled={isDeleting === cls.id}
                    >
                      {isDeleting === cls.id ? (
                        <CSpinner size="sm" />
                      ) : (
                        <CIcon icon={cilTrash} />
                      )}
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}
      </CCardBody>
    </CCard>
  );
};

export default AdminUserClass;