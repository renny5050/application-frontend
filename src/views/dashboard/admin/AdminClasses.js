import React, { useState } from 'react'
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
  // Datos de prueba
  const professors = ['Dr. Pérez', 'Dra. Gómez', 'Prof. Martínez', 'Ing. Rodríguez', 'Mtro. Sánchez']
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hours = Math.floor(i / 2)
    const minutes = i % 2 === 0 ? '00' : '30'
    return `${String(hours).padStart(2, '0')}:${minutes}`
  })

  const [classesData, setClassesData] = useState([
    { id: 1, name: 'Matemáticas Avanzadas', professor: 'Dr. Pérez', schedule: 'Lun 10:00 - 12:00' },
    { id: 2, name: 'Física Cuántica', professor: 'Dra. Gómez', schedule: 'Mar 14:00 - 16:00' },
    { id: 3, name: 'Literatura Contemporánea', professor: 'Prof. Martínez', schedule: 'Vie 09:00 - 13:00' },
    { id: 4, name: 'Programación Web', professor: 'Ing. Rodríguez', schedule: 'Lun 16:00 - 18:00' },
    { id: 5, name: 'Historia del Arte', professor: 'Mtro. Sánchez', schedule: 'Mié 08:00 - 10:00' },
  ])

  const [showModal, setShowModal] = useState(false)
  const [currentClass, setCurrentClass] = useState({
    id: null,
    name: '',
    professor: '',
    day: 'Lun',
    startTime: '09:00',
    endTime: '10:00'
  })

  const parseSchedule = (schedule) => {
    const [day, times] = schedule.split(' ')
    const [startTime, , endTime] = times.split(' ')
    return { day, startTime, endTime }
  }

  const handleEdit = (cls) => {
    const { day, startTime, endTime } = parseSchedule(cls.schedule)
    setCurrentClass({
      ...cls,
      day,
      startTime,
      endTime
    })
    setShowModal(true)
  }

  const handleSave = () => {
    const updatedClass = {
      ...currentClass,
      schedule: `${currentClass.day} ${currentClass.startTime} - ${currentClass.endTime}`
    }
    
    setClassesData(prev => 
      prev.map(cls => 
        cls.id === updatedClass.id ? updatedClass : cls
      )
    )
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta clase?')) {
      setClassesData(prev => prev.filter(cls => cls.id !== id))
    }
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
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>Profesor</CTableHeaderCell>
              <CTableHeaderCell>Horario</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          
          <CTableBody>
            {classesData.map((cls) => (
              <CTableRow key={cls.id}>
                <CTableDataCell>{cls.id}</CTableDataCell>
                <CTableDataCell>{cls.name}</CTableDataCell>
                <CTableDataCell>
                  <CIcon icon={cilPeople} className="me-2" />
                  {cls.professor}
                </CTableDataCell>
                <CTableDataCell>
                  <CIcon icon={cilCalendar} className="me-2" />
                  {cls.schedule}
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
                <CFormInput
                  label="Nombre de la clase"
                  value={currentClass.name}
                  onChange={(e) => setCurrentClass(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                />
              </div>
              
              <div className="mb-3">
                <CFormSelect
                  label="Profesor"
                  value={currentClass.professor}
                  onChange={(e) => setCurrentClass(prev => ({
                    ...prev,
                    professor: e.target.value
                  }))}
                >
                  <option value="">Seleccionar profesor</option>
                  {professors.map(prof => (
                    <option key={prof} value={prof}>{prof}</option>
                  ))}
                </CFormSelect>
              </div>

              <div className="row g-3">
                <div className="col-4">
                  <CFormSelect
                    label="Día"
                    value={currentClass.day}
                    onChange={(e) => setCurrentClass(prev => ({
                      ...prev,
                      day: e.target.value
                    }))}
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </CFormSelect>
                </div>
                
                <div className="col-4">
                  <CFormSelect
                    label="Hora inicio"
                    value={currentClass.startTime}
                    onChange={(e) => setCurrentClass(prev => ({
                      ...prev,
                      startTime: e.target.value
                    }))}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </CFormSelect>
                </div>
                
                <div className="col-4">
                  <CFormSelect
                    label="Hora fin"
                    value={currentClass.endTime}
                    onChange={(e) => setCurrentClass(prev => ({
                      ...prev,
                      endTime: e.target.value
                    }))}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
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