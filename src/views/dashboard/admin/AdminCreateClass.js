import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CFormSelect,
  CFormCheck,
  CButton,
  CAlert,
  CRow,
  CCol
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCalendar, cilPlus, cilWarning } from '@coreui/icons'

const AdminCreateClass = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    professor: '',
    schedule: {
      days: [],
      startTime: '',
      endTime: ''
    }
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Generar opciones de horario cada 30 minutos
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push({ label: time, value: time })
      }
    }
    return times
  }

  const timeOptions = generateTimeOptions()

  const daysOfWeek = [
    { label: 'Lunes', value: 'Lunes' },
    { label: 'Martes', value: 'Martes' },
    { label: 'Miércoles', value: 'Miércoles' },
    { label: 'Jueves', value: 'Jueves' },
    { label: 'Viernes', value: 'Viernes' },
    { label: 'Sábado', value: 'Sábado' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la clase es requerido'
    }
    
    if (!formData.professor.trim()) {
      newErrors.professor = 'Seleccione un profesor'
    }
    
    if (formData.schedule.days.length === 0) {
      newErrors.days = 'Seleccione al menos un día'
    }
    
    if (!formData.schedule.startTime || !formData.schedule.endTime) {
      newErrors.time = 'Seleccione el horario completo'
    } else if (formData.schedule.startTime >= formData.schedule.endTime) {
      newErrors.time = 'La hora de fin debe ser posterior a la de inicio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccessMessage('¡Clase creada exitosamente!')
      onSuccess?.()
      
      // Resetear formulario
      setFormData({
        name: '',
        professor: '',
        schedule: {
          days: [],
          startTime: '',
          endTime: ''
        }
      })
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: 'Error al crear la clase. Intente nuevamente.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: prev.schedule.days.includes(day)
          ? prev.schedule.days.filter(d => d !== day)
          : [...prev.schedule.days, day]
      }
    }))
  }

  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex align-items-center">
        <CIcon icon={cilCalendar} className="me-2" />
        Crear Nueva Clase
      </CCardHeader>
      
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            {/* Nombre de la clase */}
            <CCol md={6}>
              <CFormInput
                label="Nombre de la Clase"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                invalid={!!errors.name}
                feedback={errors.name}
                required
              />
            </CCol>

            {/* Profesor */}
            <CCol md={6}>
              <CFormSelect
                label="Profesor"
                value={formData.professor}
                onChange={(e) => setFormData({...formData, professor: e.target.value})}
                invalid={!!errors.professor}
                feedback={errors.professor}
                required
              >
                <option value="">Seleccionar profesor</option>
                <option value="Profesor 1">Juan Pérez</option>
                <option value="Profesor 2">María Gómez</option>
                <option value="Profesor 3">Carlos Rodríguez</option>
              </CFormSelect>
            </CCol>

            {/* Días de la semana */}
            <CCol md={12}>
              <div className="mb-3">
                <label className="form-label">Días de clase</label>
                <div className="d-flex flex-wrap gap-3">
                  {daysOfWeek.map(day => (
                    <CFormCheck
                      key={day.value}
                      type="checkbox"
                      id={`day-${day.value}`}
                      label={day.label}
                      checked={formData.schedule.days.includes(day.value)}
                      onChange={() => handleDayChange(day.value)}
                    />
                  ))}
                </div>
                {errors.days && <div className="invalid-feedback d-block">{errors.days}</div>}
              </div>
            </CCol>

            {/* Horario */}
            <CCol md={4}>
              <CFormSelect
                label="Hora de inicio"
                value={formData.schedule.startTime}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: {...formData.schedule, startTime: e.target.value}
                })}
                invalid={!!errors.time}
                required
              >
                <option value="">Seleccione hora</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            
            <CCol md={4}>
              <CFormSelect
                label="Hora de fin"
                value={formData.schedule.endTime}
                onChange={(e) => setFormData({
                  ...formData,
                  schedule: {...formData.schedule, endTime: e.target.value}
                })}
                invalid={!!errors.time}
                required
              >
                <option value="">Seleccione hora</option>
                {timeOptions.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            {errors.time && <div className="invalid-feedback d-block">{errors.time}</div>}

            {/* Mensajes de estado */}
            <CCol xs={12}>
              {errors.submit && (
                <CAlert color="danger">
                  <CIcon icon={cilWarning} className="me-2" />
                  {errors.submit}
                </CAlert>
              )}
              
              {successMessage && (
                <CAlert color="success">
                  <CIcon icon={cilPlus} className="me-2" />
                  {successMessage}
                </CAlert>
              )}
            </CCol>

            {/* Botón de envío */}
            <CCol xs={12} className="text-end">
              <CButton 
                type="submit" 
                color="primary" 
                disabled={submitting}
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