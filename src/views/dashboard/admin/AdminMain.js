import React from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CWidgetStatsB,
  CProgress,
  CListGroup,
  CListGroupItem,
  CAlert,
  CBadge
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
  // Datos de ejemplo para la escuela de música
  const musicStats = {
    totalStudents: 142,
    activeTeachers: 18,
    ongoingCourses: 23,
    availableInstruments: 56
  }

  const recentActivities = [
    { type: 'student', text: 'Nuevo estudiante registrado: María Gómez (Piano)', time: 'Hace 15 min' },
    { type: 'teacher', text: 'Clase cancelada: Guitarra Clásica - Prof. Rodríguez', time: 'Hace 2 horas' },
    { type: 'instrument', text: 'Nuevo piano Yamaha agregado al inventario', time: 'Ayer' }
  ]

  return (
    <div className="admin-main-music">
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Escuela de Música Harmonia</h4>
            <small className="text-medium-emphasis">Panel de Administración - {new Date().toLocaleDateString()}</small>
          </div>
        </CCardHeader>
        
        <CCardBody>
          {/* Sección de Métricas */}
          <CRow className="g-4 mb-4">
            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="primary"
                icon={<CIcon icon={cilUser} height={36} />}
                title="Estudiantes"
                value={musicStats.totalStudents.toString()}
                progress={<CProgress height={4} value={75} color="primary" className="mt-2" />}
              />
            </CCol>

            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="warning"
                icon={<CIcon icon={cilEducation} height={36} />}
                title="Profesores"
                value={musicStats.activeTeachers.toString()}
                progress={<CProgress height={4} value={90} color="warning" className="mt-2" />}
              />
            </CCol>

            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="success"
                icon={<CIcon icon={cilLibrary} height={36} />}
                title="Cursos Activos"
                value={musicStats.ongoingCourses.toString()}
                progress={<CProgress height={4} value={60} color="success" className="mt-2" />}
              />
            </CCol>

            <CCol xs={12} sm={6} xl={3}>
              <CWidgetStatsB
                color="info"
                icon={<CIcon icon={cilMusicNote} height={36} />}
                title="Instrumentos"
                value={musicStats.availableInstruments.toString()}
                progress={<CProgress height={4} value={45} color="info" className="mt-2" />}
              />
            </CCol>
          </CRow>

          {/* Contenido Principal */}
          <CRow>
            <CCol md={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <CIcon icon={cilChartLine} className="me-2" />
                  Actividad Reciente
                </CCardHeader>
                <CCardBody>
                  <CListGroup>
                    {recentActivities.map((activity, index) => (
                      <CListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <CBadge color="primary" className="me-2">
                            {activity.type === 'student' && 'Estudiante'}
                            {activity.type === 'teacher' && 'Profesor'}
                            {activity.type === 'instrument' && 'Instrumento'}
                          </CBadge>
                          {activity.text}
                        </div>
                        <small className="text-medium-emphasis">{activity.time}</small>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CAlert color="info">
        <CIcon icon={cilMusicNote} className="me-2" />
        Bienvenido al panel de administración de la escuela de música. Recuerda actualizar los horarios de práctica regularmente.
      </CAlert>
    </div>
  )
}

export default AdminMain