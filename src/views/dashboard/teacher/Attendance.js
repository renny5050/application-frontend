import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CSpinner,
  CBadge,
  CInputGroup,
  CInputGroupText
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilPencil, cilTrash, cilCalendar } from '@coreui/icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AttendanceCRUD = () => {
  // Estados
  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentsByClass, setStudentsByClass] = useState([]);
  const [loading, setLoading] = useState(false); // Inicia en false
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAttendance, setCurrentAttendance] = useState({
    id: '',
    student_id: '',
    class_id: '',
    date: new Date(),
    present: true
  });
  const [filters, setFilters] = useState({
    student_id: '',
    class_id: '',
    date: ''
  });

  // Obtener token de autenticación
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Decodificar token JWT
  const decodeToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  };

  // Cargar clases del profesor al montar el componente
  useEffect(() => {
    fetchClasses();
  }, []);

  // Cargar asistencias cuando el filtro de clase cambia
  useEffect(() => {
    if (filters.class_id) {
      fetchAttendancesByClass(filters.class_id);
    } else {
      setAttendances([]); // Limpia la tabla si no hay clase seleccionada
      setStudentsByClass([]); // Limpia la lista de estudiantes del filtro
    }
  }, [filters.class_id]);

  // Aplicar filtros de estudiante y fecha del lado del cliente
  useEffect(() => {
    let result = [...attendances];

    if (filters.student_id) {
      result = result.filter(a => a.student_id === parseInt(filters.student_id));
    }

    if (filters.date) {
      // Compara solo la parte de la fecha (YYYY-MM-DD)
      result = result.filter(a => a.date.startsWith(filters.date));
    }

    setFilteredAttendances(result);
  }, [attendances, filters.student_id, filters.date]);

  // Obtener asistencias por clase usando el nuevo endpoint
  const fetchAttendancesByClass = async (classId) => {
    try {
      setLoading(true);
      setError('');
      // Primero, obtenemos la lista de estudiantes de esa clase para poder mostrar sus nombres
      await fetchStudentsByClass(classId);

      const response = await fetch(`http://localhost:3002/api/attendance/class/${classId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener las asistencias para la clase seleccionada');
      }

      const data = await response.json();
      setAttendances(data);
    } catch (err) {
      setError(err.message || 'Error al cargar asistencias');
      setAttendances([]); // Limpiar en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Obtener clases del profesor actual
  const fetchClasses = async () => {
    try {
      const decoded = decodeToken();
      if (!decoded?.id) {
        throw new Error('No se pudo obtener el ID del profesor');
      }

      const response = await fetch(`http://localhost:3002/api/classes/teacher/${decoded.id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener clases');
      }

      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err.message || 'Error al cargar clases');
    }
  };

  // Obtener estudiantes por clase
  const fetchStudentsByClass = async (classId) => {
    if (!classId) {
      setStudentsByClass([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/api/studentclass/class/${classId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al obtener estudiantes');
      }

      const data = await response.json();
      // Asumimos que la data es [{ student_id, first_name, last_name, ... }]
      setStudentsByClass(data);
    } catch (err) {
      setError(err.message || 'Error al cargar estudiantes');
      setStudentsByClass([]);
    }
  };

  // Manejador de cambios en formulario del modal
  const handleModalFormChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia la clase en el modal, resetea el estudiante y carga la nueva lista
    if (name === 'class_id') {
      setCurrentAttendance({
        ...currentAttendance,
        class_id: value,
        student_id: '' // Resetea el estudiante
      });
      fetchStudentsByClass(value);
    } else {
      setCurrentAttendance({
        ...currentAttendance,
        [name]: value
      });
    }
  };

  // Manejador de cambio de fecha en el modal
  const handleDateChange = (date) => {
    setCurrentAttendance({ ...currentAttendance, date });
  };

  // Manejador de cambio de estado (presente/ausente) en el modal
  const handlePresentChange = (e) => {
    setCurrentAttendance({ ...currentAttendance, present: e.target.value === 'true' });
  };

  // Manejador de submit para crear/editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentAttendance.class_id || !currentAttendance.student_id || !currentAttendance.date) {
      setError('Todos los campos (Clase, Estudiante, Fecha) son requeridos');
      return;
    }

    try {
      const formattedDate = currentAttendance.date.toISOString().split('T')[0];
      const attendanceData = { ...currentAttendance, date: formattedDate };

      const url = isEditing
        ? `http://localhost:3002/api/attendance/${currentAttendance.id}`
        : 'http://localhost:3002/api/attendance';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(attendanceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la asistencia');
      }

      setSuccess(isEditing ? 'Asistencia actualizada correctamente' : 'Asistencia creada correctamente');
      // Refresca la tabla para la clase actualmente seleccionada
      if (filters.class_id) {
        fetchAttendancesByClass(filters.class_id);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar asistencia
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro de asistencia?')) return;

    try {
      const response = await fetch(`http://localhost:3002/api/attendance/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la asistencia');
      }

      setSuccess('Asistencia eliminada');
      // Refresca la tabla
      if (filters.class_id) {
        fetchAttendancesByClass(filters.class_id);
      }
    } catch (err) {
      setError(err.message || 'Error al eliminar la asistencia');
    }
  };

  // Manejador de cambios en los filtros principales
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({ student_id: '', class_id: '', date: '' });
  };
  
  // Obtener nombre del estudiante por ID
  const getStudentName = (studentId) => {
    // Busca en la lista de estudiantes cargada para la clase seleccionada
    const student = studentsByClass.find(s => s.student_id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : `ID: ${studentId}`;
  };

  // Obtener nombre de la clase por ID
  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? `${cls.specialty_name} - ${cls.day}` : 'Desconocida';
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Formatear hora para mostrar
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentAttendance({
      id: '', student_id: '', class_id: '', date: new Date(), present: true
    });
    setIsEditing(false);
    setShowModal(true);
    setError('');
    setSuccess('');
    // Si hay una clase seleccionada en el filtro, pre-cargarla en el modal
    if (filters.class_id) {
        setCurrentAttendance(prev => ({ ...prev, class_id: filters.class_id }));
        fetchStudentsByClass(filters.class_id);
    } else {
        setStudentsByClass([]);
    }
  };

  // Abrir modal para editar
  const handleEdit = (attendance) => {
    setIsEditing(true);
    setError('');
    setSuccess('');
    // La fecha de la API viene como string, la convertimos a objeto Date
    setCurrentAttendance({ ...attendance, date: new Date(attendance.date), present: Boolean(attendance.present) });
    // Cargamos los estudiantes de la clase de la asistencia a editar
    fetchStudentsByClass(attendance.class_id);
    setShowModal(true);
  };

  return (
    <div className="attendance-crud">
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Gestión de Asistencias</h5>
          <CButton color="primary" onClick={handleCreate}>
            <CIcon icon={cilPlus} className="me-2" />
            Nueva Asistencia
          </CButton>
        </CCardHeader>
        <CCardBody>
          {error && <CAlert color="danger">{error}</CAlert>}
          {success && <CAlert color="success">{success}</CAlert>}

          {/* Filtros */}
          <div className="mb-4 p-3 border rounded bg-light">
            <h6>Filtrar Asistencias</h6>
            <CRow className="g-3">
              <CCol md={4}>
                <CFormSelect name="class_id" value={filters.class_id} onChange={handleFilterChange} label="Clase (Obligatorio para ver tabla)">
                  <option value="">Seleccione una clase...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.specialty_name} - {cls.day}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect name="student_id" value={filters.student_id} onChange={handleFilterChange} label="Estudiante" disabled={!filters.class_id}>
                  <option value="">{filters.class_id ? 'Todos los estudiantes' : 'Seleccione una clase primero'}</option>
                  {studentsByClass.map(student => (
                    <option key={student.student_id} value={student.student_id}>
                      {student.first_name} {student.last_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormInput type="date" name="date" value={filters.date} onChange={handleFilterChange} label="Fecha" disabled={!filters.class_id}/>
              </CCol>
              <CCol md={12} className="text-end">
                <CButton color="secondary" onClick={clearFilters}>Limpiar Filtros</CButton>
              </CCol>
            </CRow>
          </div>

          {/* Tabla de asistencias */}
          {loading ? (
            <div className="text-center py-4">
              <CSpinner />
              <p>Cargando asistencias...</p>
            </div>
          ) : !filters.class_id ? (
            <div className="text-center py-4">
                <p>Por favor, seleccione una clase para ver los registros de asistencia.</p>
            </div>
          ) : filteredAttendances.length === 0 ? (
            <div className="text-center py-4">
              <p>No se encontraron registros de asistencia para los filtros seleccionados.</p>
            </div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Estudiante</CTableHeaderCell>
                  <CTableHeaderCell>Clase</CTableHeaderCell>
                  <CTableHeaderCell>Fecha</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                  <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filteredAttendances.map(attendance => (
                  <CTableRow key={attendance.id}>
                    <CTableDataCell>{getStudentName(attendance.student_id)}</CTableDataCell>
                    <CTableDataCell>{getClassName(attendance.class_id)}</CTableDataCell>
                    <CTableDataCell>{formatDate(attendance.date)}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={attendance.present ? 'success' : 'danger'}>
                        {attendance.present ? 'Presente' : 'Ausente'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="info" size="sm" className="me-2" onClick={() => handleEdit(attendance)}>
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton color="danger" size="sm" onClick={() => handleDelete(attendance.id)}>
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
        </CCardBody>
      </CCard>

      {/* Modal para crear/editar asistencia */}
      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>{isEditing ? 'Editar Asistencia' : 'Nueva Asistencia'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* El error del modal se muestra dentro del formulario */}
          <CForm onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormSelect name="class_id" value={currentAttendance.class_id} onChange={handleModalFormChange} label="Clase" required>
                <option value="">Seleccionar clase</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.specialty_name} - {cls.day} ({formatTime(cls.start_time)} - {formatTime(cls.end_time)})
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <CFormSelect name="student_id" value={currentAttendance.student_id} onChange={handleModalFormChange} label="Estudiante" required disabled={!currentAttendance.class_id}>
                <option value="">
                  {currentAttendance.class_id ? 'Seleccionar estudiante' : 'Primero seleccione una clase'}
                </option>
                {studentsByClass.map(student => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </CFormSelect>
            </div>
            <div className="mb-3">
              <label className="form-label d-block">Fecha</label>
              <DatePicker selected={currentAttendance.date} onChange={handleDateChange} className="form-control" dateFormat="yyyy-MM-dd" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Estado</label>
              <div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="present" id="presentTrue" value="true" checked={currentAttendance.present === true} onChange={handlePresentChange} />
                  <label className="form-check-label" htmlFor="presentTrue">Presente</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="present" id="presentFalse" value="false" checked={currentAttendance.present === false} onChange={handlePresentChange} />
                  <label className="form-check-label" htmlFor="presentFalse">Ausente</label>
                </div>
              </div>
            </div>
            {error && <CAlert color="danger" className="mt-3">{error}</CAlert>}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>Cancelar</CButton>
          <CButton color="primary" onClick={handleSubmit}>{isEditing ? 'Actualizar' : 'Crear'}</CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default AttendanceCRUD;