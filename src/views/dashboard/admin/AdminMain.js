import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CWidgetStatsB,
  CProgress,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilMusicNote,
  cilEducation,
  cilLibrary,
  cilChartLine
} from '@coreui/icons'

const AdminMain = () => {
  // Estados para métricas
  const [totalStudents, setTotalStudents] = useState(0)
  const [activeTeachers, setActiveTeachers] = useState(0)
  const [ongoingCourses, setOngoingCourses] = useState(0)
  const [availableInstruments, setAvailableInstruments] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtener token desde localStorage
  const getToken = () => localStorage.getItem('authToken') || ''

  // Encabezados con token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  })

  // Cargar datos desde APIs
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [classesRes, teachersRes, studentsRes, itemsRes] = await Promise.all([
        fetch('http://localhost:3002/api/classes', { headers: getAuthHeaders() }),
        fetch('http://localhost:3002/api/teachers', { headers: getAuthHeaders() }),
        fetch('http://localhost:3002/api/students', { headers: getAuthHeaders() }),
        fetch('http://localhost:3002/api/item', { headers: getAuthHeaders() })
      ])

      const [classes, teachers, students, items] = await Promise.all([
        classesRes.json(),
        teachersRes.json(),
        studentsRes.json(),
        itemsRes.json()
      ])

      setOngoingCourses(classes.length)
      setActiveTeachers(teachers.length)
      setTotalStudents(students.length)
      setAvailableInstruments(items.length)
    } catch (err) {
      setError('No se pudieron cargar las métricas. Recarga la página.')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return <CAlert color="danger">{error}</CAlert>
  }

  return (
    <div className="admin-main-music">
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Escuela de Música Harmonia</h4>
            <small className="text-medium-emphasis">
              Panel de Administración - {new Date().toLocaleDateString()}
            </small>
          </div>
        </CCardHeader>

        <CCardBody>
          {/* Métricas */}
          <CRow className="g-4 mb-4">
            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="primary"
                icon={<CIcon icon={cilUser} height={36} />}
                title="Estudiantes"
                value={loading ? 'Cargando...' : totalStudents.toString()}
                progress={
                  <CProgress height={4} value={75} color="primary" className="mt-2" />
                }
              />
            </CCol>

            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="warning"
                icon={<CIcon icon={cilEducation} height={36} />}
                title="Profesores"
                value={loading ? 'Cargando...' : activeTeachers.toString()}
                progress={
                  <CProgress height={4} value={90} color="warning" className="mt-2" />
                }
              />
            </CCol>

            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="success"
                icon={<CIcon icon={cilLibrary} height={36} />}
                title="Cursos Activos"
                value={loading ? 'Cargando...' : ongoingCourses.toString()}
                progress={
                  <CProgress height={4} value={60} color="success" className="mt-2" />
                }
              />
            </CCol>

            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="info"
                icon={<CIcon icon={cilMusicNote} height={36} />}
                title="Instrumentos"
                value={loading ? 'Cargando...' : availableInstruments.toString()}
                progress={
                  <CProgress height={4} value={45} color="info" className="mt-2" />
                }
              />
            </CCol>
          </CRow>

          {/* Mensaje informativo */}
          <CRow>
            <CCol md={12}>
              <CAlert color="info" className="mb-0">
                <CIcon icon={cilChartLine} className="me-2" />
                Bienvenido al panel de administración de la escuela de música. Puedes ver tus estadísticas principales arriba.
              </CAlert>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default AdminMain