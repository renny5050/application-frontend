import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormSelect,
  CButton,
  CAlert,
  CRow,
  CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilPlus, cilWarning } from '@coreui/icons'

const AdminCreateClass = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    specialty_id: '',
    teacher_id: '',
    schedule: {
      days: [],
      startTime: '',
      endTime: ''
    }
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const [specialties, setSpecialties] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loadingSpecialties, setLoadingSpecialties] = useState(true)
  const [loadingTeachers, setLoadingTeachers] = useState(true)

  // Opciones predefinidas
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
    const minutes = (i % 2) * 30
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  })

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

  // Obtener token desde localStorage
  const getToken = () => localStorage.getItem('authToken') || ''

  // Encabezados con token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  })

  // Fetch specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/specialties', {
          method: 'GET',
          headers: getAuthHeaders()
        })

        if (!response.ok) {
          throw new Error('Error al cargar las especialidades')
        }

        const data = await response.json()
        setSpecialties(data)
      } catch (error) {
        setApiError('No se pudieron cargar las especialidades. Intente más tarde.')
      } finally {
        setLoadingSpecialties(false)
      }
    }

    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/teachers', {
          method: 'GET',
          headers: getAuthHeaders()
        })

        if (!response.ok) {
          throw new Error('Error al cargar los profesores')
        }

        const data = await response.json()
        setTeachers(data)
      } catch (error) {
        setApiError('No se pudieron cargar los profesores. Intente más tarde.')
      } finally {
        setLoadingTeachers(false)
      }
    }

    fetchSpecialties()
    fetchTeachers()
  }, [])

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.specialty_id) {
      newErrors.specialty = 'Seleccione una especialidad'
    }

    if (!formData.teacher_id) {
      newErrors.teacher = 'Seleccione un profesor'
    }

    if (formData.schedule.days.length === 0) {
      newErrors.days = 'Seleccione al menos un día'
    }

    if (!formData.schedule.startTime || !formData.schedule.endTime) {
      newErrors.time = 'Seleccione el horario completo'
    } else {
      // Validación exactamente como en el schema del backend
      const [startHour, startMinute] = formData.schedule.startTime.split(':').map(Number)
      const [endHour, endMinute] = formData.schedule.endTime.split(':').map(Number)
      
      if (!(endHour > startHour || (endHour === startHour && endMinute > startMinute))) {
        newErrors.time = 'La hora de fin debe ser posterior a la hora de inicio'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejador de submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)
    setSuccessMessage('')
    setApiError('')

    try {
      const response = await fetch('http://localhost:3002/api/classes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          specialty_id: parseInt(formData.specialty_id),
          teacher_id: parseInt(formData.teacher_id),
          day: formData.schedule.days[0]?.toLowerCase(),
          start_time: formData.schedule.startTime,
          end_time: formData.schedule.endTime
        })
      })

      if (response.ok) {
        setSuccessMessage('¡Clase creada exitosamente!')
        onSuccess?.()

        // Resetear formulario
        setFormData({
          specialty_id: '',
          teacher_id: '',
          schedule: {
            days: [],
            startTime: '',
            endTime: ''
          }
        })

        setTimeout(() => setSuccessMessage(''), 3000)
      } else if (response.status === 401) {
        setApiError('No autorizado. Inicie sesión nuevamente.')
      } else {
        const data = await response.json()
        setApiError(data.message || 'Error al crear la clase. Intente nuevamente.')
      }
    } catch (error) {
      setApiError('Hubo un problema al conectar con el servidor.')
    } finally {
      setSubmitting(false)
    }
  }

  // Renderizado
  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <CIcon icon={cilCalendar} className="me-2" />
        Crear Nueva Clase
      </CCardHeader>

      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            {/* Especialidad */}
            <CCol md={6}>
              <CFormSelect
                label="Especialidad"
                value={formData.specialty_id}
                onChange={(e) =>
                  setFormData({ ...formData, specialty_id: e.target.value })
                }
                invalid={!!errors.specialty}
                feedback={errors.specialty}
                required
                disabled={loadingSpecialties || loadingTeachers}
              >
                <option value="">Seleccionar especialidad</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </CFormSelect>
              {loadingSpecialties && <small>Cargando especialidades...</small>}
            </CCol>

            {/* Profesor */}
            <CCol md={6}>
              <CFormSelect
                label="Profesor"
                value={formData.teacher_id}
                onChange={(e) =>
                  setFormData({ ...formData, teacher_id: e.target.value })
                }
                invalid={!!errors.teacher}
                feedback={errors.teacher}
                required
                disabled={loadingTeachers || loadingSpecialties}
              >
                <option value="">Seleccionar profesor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.first_name} {teacher.last_name}
                  </option>
                ))}
              </CFormSelect>
              {loadingTeachers && <small>Cargando profesores...</small>}
            </CCol>

            {/* Días de la semana */}
            <CCol md={6}>
              <CFormSelect
                label="Días de clase"
                value={formData.schedule.days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: {
                      ...formData.schedule,
                      days: Array.from(e.target.selectedOptions).map((o) => o.value)
                    }
                  })
                }
                invalid={!!errors.days}
                feedback={errors.days}
                required
                disabled={loadingTeachers || loadingSpecialties}
              >
                <option value="" disabled>
                  Seleccione los días
                </option>
                {daysOfWeek.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Horario */}
            <CCol md={4}>
              <CFormSelect
                label="Hora de inicio"
                value={formData.schedule.startTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, startTime: e.target.value }
                  })
                }
                invalid={!!errors.time}
                required
                disabled={loadingTeachers || loadingSpecialties}
              >
                <option value="">Seleccione hora</option>
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            <CCol md={4}>
              <CFormSelect
                label="Hora de fin"
                value={formData.schedule.endTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    schedule: { ...formData.schedule, endTime: e.target.value }
                  })
                }
                invalid={!!errors.time}
                required
                disabled={loadingTeachers || loadingSpecialties}
              >
                <option value="">Seleccione hora</option>
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </CFormSelect>
            </CCol>

            {/* Mensajes */}
            <CCol xs={12}>
              {apiError && (
                <CAlert color="danger">
                  <CIcon icon={cilWarning} className="me-2" />
                  {apiError}
                </CAlert>
              )}

              {successMessage && (
                <CAlert color="success">
                  <CIcon icon={cilPlus} className="me-2" />
                  {successMessage}
                </CAlert>
              )}
            </CCol>

            {/* Botón */}
            <CCol xs={12} className="text-end">
              <CButton 
                type="submit" 
                color="primary" 
                disabled={submitting || loadingTeachers || loadingSpecialties}
              >
                {submitting ? 'Creando...' : 'Crear Clase'}
                <CIcon icon={cilPlus} className="ms-2" />
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default AdminCreateClass