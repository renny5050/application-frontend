import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormSelect,
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilCalendar, cilPencil, cilTrash, cilWarning } from '@coreui/icons'

const AdminClasses = () => {
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2)
    const minutes = i % 2 === 0 ? '00' : '30'
    return `${String(hours).padStart(2, '0')}:${minutes}`
  })

  // Estados
  const [classesData, setClassesData] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentClass, setCurrentClass] = useState({
    id: null,
    teacher_id: '',
    specialty_id: '',
    day: 'Lunes',
    startTime: '09:00',
    endTime: '10:00',
    teacher_name: '',
    specialty_name: ''
  })

  // Token
  const getToken = () => localStorage.getItem('authToken') || ''
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  })

  // Fetch desde API
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [classesResponse, teachersResponse] = await Promise.all([
        fetch('https://application-backend-4anj.onrender.com/api/classes/', {
          headers: getAuthHeaders()
        }),
        fetch('https://application-backend-4anj.onrender.com/api/teachers/', {
          headers: getAuthHeaders()
        })
      ])

      if (!classesResponse.ok || !teachersResponse.ok) {
        throw new Error('Error al cargar datos')
      }

      const classesData = await classesResponse.json()
      const teachersData = await teachersResponse.json()

      setClassesData(classesData)
      setTeachers(teachersData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Manejadores
  const handleEdit = (cls) => {
    setCurrentClass({
      id: cls.id,
      teacher_id: cls.teacher_id.toString(),
      specialty_id: cls.specialty_id.toString(),
      day: cls.day.charAt(0).toUpperCase() + cls.day.slice(1).toLowerCase(),
      startTime: cls.start_time.slice(0, 5),
      endTime: cls.end_time.slice(0, 5),
      teacher_name: cls.teacher_name,
      specialty_name: cls.specialty_name
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`https://application-backend-4anj.onrender.com/api/classes/${currentClass.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          specialty_id: parseInt(currentClass.specialty_id),
          teacher_id: parseInt(currentClass.teacher_id),
          day: currentClass.day.toLowerCase(),
          start_time: currentClass.startTime,
          end_time: currentClass.endTime
        })
      })

      if (response.ok) {
        fetchData()
        setShowModal(false)
      } else if (response.status === 401) {
        setError('No autorizado. Inicia sesión nuevamente.')
      } else {
        setError('Error al guardar los cambios.')
      }
    } catch (error) {
      console.error('Error actualizando clase:', error)
      setError('Hubo un problema al actualizar la clase.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta clase?')) {
      try {
        const response = await fetch(`https://application-backend-4anj.onrender.com/api/classes/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        })

        if (response.ok) {
          fetchData()
        } else if (response.status === 401) {
          setError('No autorizado. Inicia sesión nuevamente.')
        } else {
          setError('Error al eliminar la clase.')
        }
      } catch (error) {
        console.error('Error eliminando clase:', error)
        setError('Hubo un problema al eliminar la clase.')
      }
    }
  }

  // Renderizado
  if (loading) {
    return <CAlert color="info">Cargando datos...</CAlert>
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <h5 className="mb-0">Gestión de Clases</h5>
      </CCardHeader>

      <CCardBody>
        <CTable hover responsive>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>ID</CTableHeaderCell>
              <CTableHeaderCell>Profesor</CTableHeaderCell>
              <CTableHeaderCell>Especialidad</CTableHeaderCell>
              <CTableHeaderCell>Horario</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {classesData.map((cls) => (
              <CTableRow key={cls.id}>
                <CTableDataCell>{cls.id}</CTableDataCell>
                <CTableDataCell>
                  <CIcon icon={cilPeople} className="me-2" />
                  {cls.teacher_name}
                </CTableDataCell>
                <CTableDataCell>
                  {cls.specialty_name}
                </CTableDataCell>
                <CTableDataCell>
                  <CIcon icon={cilCalendar} className="me-2" />
                  {`${cls.day} ${cls.start_time.slice(0, 5)} - ${cls.end_time.slice(0, 5)}`}
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(cls)}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    onClick={() => handleDelete(cls.id)}
                  >
                    <CIcon icon={cilTrash} />
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Modal de edición */}
        <CModal visible={showModal} onClose={() => setShowModal(false)}>
          <CModalHeader>
            <CModalTitle>Editar Clase</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="gap-3">
              <div className="mb-3">
                <CFormSelect
                  label="Profesor"
                  value={currentClass.teacher_id}
                  onChange={(e) =>
                    setCurrentClass((prev) => ({
                      ...prev,
                      teacher_id: e.target.value
                    }))
                  }
                >
                  <option value="">Seleccionar profesor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              <div className="row g-3">
                <div className="col-4">
                  <CFormSelect
                    label="Día"
                    value={currentClass.day}
                    onChange={(e) =>
                      setCurrentClass((prev) => ({
                        ...prev,
                        day: e.target.value
                      }))
                    }
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                <div className="col-4">
                  <CFormSelect
                    label="Hora inicio"
                    value={currentClass.startTime}
                    onChange={(e) =>
                      setCurrentClass((prev) => ({
                        ...prev,
                        startTime: e.target.value
                      }))
                    }
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </CFormSelect>
                </div>

                <div className="col-4">
                  <CFormSelect
                    label="Hora fin"
                    value={currentClass.endTime}
                    onChange={(e) =>
                      setCurrentClass((prev) => ({
                        ...prev,
                        endTime: e.target.value
                      }))
                    }
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={handleSave}>
              Guardar Cambios
            </CButton>
          </CModalFooter>
        </CModal>

        <CAlert color="info" className="mt-3">
          <CIcon icon={cilWarning} className="me-2" />
          Total de clases registradas: {classesData.length}
        </CAlert>
      </CCardBody>
    </CCard>
  )
}

export default AdminClasses