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
  CButton,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCalendar,
  cilPencil,
  cilTrash,
  cilPlus,
  cilWarning,
  cilInfo
} from '@coreui/icons'

const TeacherMessages = () => {
  // Estados
  const [messages, setMessages] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentMessage, setCurrentMessage] = useState({
    id: null,
    class_id: '',
    title: '',
    content: '',
    created_at: null
  })
  const [filters, setFilters] = useState({
    class_id: ''
  })

  // Obtener token desde localStorage
  const getToken = () => localStorage.getItem('authToken') || ''

  // Decodificar token para obtener ID del profesor
  const decodeToken = () => {
    const token = getToken()
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      console.error('Error decodificando token:', e)
      return null
    }
  }

  // Encabezados comunes con token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  })

  // Cargar clases del profesor actual
  const fetchClasses = async () => {
    try {
      const decoded = decodeToken()
      if (!decoded?.id) throw new Error('No se pudo obtener el ID del profesor')

      const response = await fetch(`https://application-backend-4anj.onrender.com/api/classes/teacher/${decoded.id}`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Error al cargar clases')
      }

      const data = await response.json()
      setClasses(data)
    } catch (err) {
      setError(err.message)
    }
  }

  // Cargar mensajes por clase
  const fetchMessagesByClass = async (classId) => {
    if (!classId) {
      setMessages([])
      return
    }

    try {
      const response = await fetch(`https://application-backend-4anj.onrender.com/api/classmessage/class/${classId}`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 404) {
          setMessages([])
          return
        }
        throw new Error('Error al cargar mensajes')
      }

      const data = await response.json()
      setMessages(data)
    } catch (err) {
      setError(err.message)
      setMessages([])
    }
  }

  // Cargar clases y mensajes al montar
  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    if (filters.class_id) {
      fetchMessagesByClass(filters.class_id)
    }
  }, [filters.class_id])

  // Manejadores de eventos
  const handleCreate = () => {
    setCurrentMessage({
      id: null,
      class_id: filters.class_id || '',
      title: '',
      content: '',
      created_at: null
    })
    setIsEditing(false)
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleEdit = (message) => {
    setCurrentMessage({
      id: message.id,
      class_id: message.class_id,
      title: message.title,
      content: message.content,
      created_at: message.created_at ? new Date(message.created_at) : null
    })
    setIsEditing(true)
    setShowModal(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este mensaje?')) return

    try {
      const response = await fetch(`https://application-backend-4anj.onrender.com/api/classmessage/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Mensaje no encontrado')
        }
        throw new Error('Error al eliminar el mensaje')
      }

      setSuccess('Mensaje eliminado exitosamente')
      fetchMessagesByClass(filters.class_id)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleSave = async () => {
    // Validación básica
    if (!currentMessage.title?.trim() || !currentMessage.content?.trim()) {
      setError('Título y contenido son requeridos')
      return
    }

    try {
      const url = isEditing 
        ? `https://application-backend-4anj.onrender.com/api/classmessage/${currentMessage.id}` 
        : 'https://application-backend-4anj.onrender.com/api/classmessage'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          class_id: parseInt(currentMessage.class_id),
          title: currentMessage.title.trim(),
          content: currentMessage.content.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al guardar el mensaje')
      }

      setSuccess(isEditing ? 'Mensaje actualizado' : 'Mensaje creado')
      fetchMessagesByClass(currentMessage.class_id)
      setShowModal(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Renderizado
  return (
    <CCard className="mb-4">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Mensajes de Clase</h5>
        <div>
          <CButton 
            color="primary" 
            onClick={handleCreate}
            disabled={!filters.class_id}
          >
            <CIcon icon={cilPlus} className="me-2" />
            Nuevo Mensaje
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}
        {success && <CAlert color="success">{success}</CAlert>}

        {/* Filtro por clase */}
        <div className="mb-4 p-3 border rounded bg-light">
          <h6>Filtrar por Clase</h6>
          <CForm>
            <CFormSelect
              name="class_id"
              value={filters.class_id}
              onChange={handleFilterChange}
              label="Clase"
              required
            >
              <option value="">Seleccionar clase</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.specialty_name} - {cls.day}
                </option>
              ))}
            </CFormSelect>
          </CForm>
        </div>

        {/* Tabla de mensajes */}
        {!filters.class_id ? (
          <>
            <CAlert color="info" className="text-center">
              <CIcon icon={cilInfo} className="me-2" />
              Selecciona una clase para ver sus mensajes
            </CAlert>
            <CAlert color="secondary" className="text-center">
              <CIcon icon={cilWarning} className="me-2" />
              No hay mensajes para esta clase
            </CAlert>
          </>
        ) : (
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Título</CTableHeaderCell>
                <CTableHeaderCell>Contenido</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {messages.map(msg => (
                <CTableRow key={msg.id}>
                  <CTableDataCell>{msg.title}</CTableDataCell>
                  <CTableDataCell>{msg.content}</CTableDataCell>
                  <CTableDataCell>
                    <CIcon icon={cilCalendar} className="me-2" />
                    {formatDate(msg.created_at)}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(msg)}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(msg.id)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {/* Modal de creación/edición */}
        <CModal visible={showModal} onClose={() => setShowModal(false)}>
          <CModalHeader>
            <CModalTitle>{isEditing ? 'Editar Mensaje' : 'Nuevo Mensaje'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <div className="mb-3">
                <CFormInput
                  label="Título"
                  value={currentMessage.title}
                  onChange={(e) => setCurrentMessage({
                    ...currentMessage,
                    title: e.target.value
                  })}
                  required
                />
              </div>

              <div className="mb-3">
                <CFormInput
                  label="Contenido"
                  value={currentMessage.content}
                  onChange={(e) => setCurrentMessage({
                    ...currentMessage,
                    content: e.target.value
                  })}
                  required
                  as="textarea"
                  rows={5}
                />
              </div>

              {error && <CAlert color="danger" className="mt-3">{error}</CAlert>}
              {success && <CAlert color="success" className="mt-3">{success}</CAlert>}
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </CButton>
            <CButton color="primary" onClick={handleSave}>
              {isEditing ? 'Actualizar' : 'Crear'}
            </CButton>
          </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  )
}

export default TeacherMessages