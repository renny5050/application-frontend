import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilCalendar,
  cilSchool,
  cilNotes
} from '@coreui/icons'

const TeacherMain = () => {
  const [teacherClasses, setTeacherClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [teacherName, setTeacherName] = useState('Profesor/a')

  // Obtener token desde localStorage
  const getToken = () => localStorage.getItem('authToken') || ''

  // Decodificar token JWT
  const decodeToken = () => {
    const token = getToken()
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (err) {
      console.error('Error decodificando token:', err)
      return null
    }
  }

  // Encabezado con token Bearer
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  })

  // Formatear hora (ej: 16:00 → 4:00 PM)
  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const date = new Date()
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
    return date.toLocaleTimeString('es-VE', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  // Obtener número de estudiantes por clase
  const fetchStudentCountForClass = async (classId) => {
    try {
      const response = await fetch(`https://application-backend-4anj.onrender.com/api/studentclass/class/${classId}`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        console.warn(`Error obteniendo estudiantes para clase ${classId}`)
        return 0
      }

      const students = await response.json()
      return students.length
    } catch (err) {
      console.error(`Error fetching student count for class ${classId}:`, err)
      return 0
    }
  }

  // Cargar clases del profesor y sus estudiantes
  const fetchClasses = async () => {
    try {
      const decoded = decodeToken()
      if (!decoded?.id) throw new Error('No se pudo obtener el ID del profesor')

      setLoading(true)
      setError(null)

      // 1. Obtener clases del profesor
      const classesResponse = await fetch(`https://application-backend-4anj.onrender.com/api/classes/teacher/${decoded.id}`, {
        headers: getAuthHeaders()
      })

      if (!classesResponse.ok) {
        throw new Error('Error al cargar tus clases')
      }

      const classesData = await classesResponse.json()

      // 2. Para cada clase, obtener número real de estudiantes
      const classesWithCounts = await Promise.all(
        classesData.map(async (cls) => {
          const studentCount = await fetchStudentCountForClass(cls.id)
          return {
            ...cls,
            student_count: studentCount
          }
        })
      )

      setTeacherClasses(classesWithCounts)

      if (classesWithCounts.length > 0 && classesWithCounts[0].teacher_name) {
        setTeacherName(classesWithCounts[0].teacher_name)
      }

    } catch (err) {
      setError(err.message || 'Error al cargar clases')
    } finally {
      setLoading(false)
    }
  }

  // Cargar clases y estudiantes al montar
  useEffect(() => {
    fetchClasses()
  }, [])

  // Renderizado
  if (loading) {
    return <CAlert color="info">Cargando información del profesor...</CAlert>
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>
  }

  return (
    <div className="teacher-main-dashboard">
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Panel del Profesor</h4>
            <small className="text-medium-emphasis">
              Bienvenida, {teacherName} - {new Date().toLocaleDateString('es-VE')}
            </small>
          </div>
          <CIcon icon={cilSchool} height={36} className="text-primary" />
        </CCardHeader>

        <CCardBody>
          <h5 className="mb-4">Mis Clases Asignadas</h5>
          
          <CRow>
            {teacherClasses.length > 0 ? (
              teacherClasses.map((cls) => (
                <CCol key={cls.id} xs={12} md={6} xl={4} className="mb-4">
                  <CCard className="h-100 shadow-sm border-start border-primary border-4">
                    <CCardHeader component="h6">
                      <CIcon icon={cilNotes} className="me-2" />
                      {cls.specialty_name}
                    </CCardHeader>
                    <CCardBody>
                      <p className="d-flex align-items-center mb-3">
                        <CIcon icon={cilCalendar} className="me-2 text-info" />
                        <strong>Horario:</strong>&nbsp;
                        {cls.day}, {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                      </p>
                      <p className="d-flex align-items-center mb-0">
                        <CIcon icon={cilUser} className="me-2 text-success" />
                        <strong>Estudiantes:</strong>&nbsp;
                        {cls.student_count ?? 0}
                      </p>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))
            ) : (
              <CCol>
                <CAlert color="secondary" className="text-center">
                  Actualmente no tienes clases asignadas.
                </CAlert>
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default TeacherMain