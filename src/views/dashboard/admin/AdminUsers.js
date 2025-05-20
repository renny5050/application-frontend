import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSelect,
  CAlert,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilPencil, cilSave, cilX, cilTrash } from '@coreui/icons'
import AdminUserClass from './AdminUserClass'

const UserManagement = () => {
  // Estado inicial con datos de ejemplo
  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'admin@universidad.com',
      password: 'admin123',
      dni: '12345678',
      role: 'admin',
      especialidad: ''
    },
    {
      id: 2,
      email: 'prof.matematicas@universidad.com',
      password: 'matematica2024',
      dni: '23456789',
      role: 'profesor',
      especialidad: 'Matemáticas Avanzadas'
    },
    {
      id: 3,
      email: 'estudiante1@universidad.com',
      password: 'estudiante123',
      dni: '34567890',
      role: 'estudiante',
      especialidad: ''
    }
  ])

  const [classesData, setClassesData] = useState([
      { id: 1, name: 'Matemáticas Avanzadas', professor: 'Dr. Pérez', schedule: 'Lun 10:00 - 12:00' },
      { id: 2, name: 'Física Cuántica', professor: 'Dra. Gómez', schedule: 'Mar 14:00 - 16:00' },
      { id: 3, name: 'Literatura Contemporánea', professor: 'Prof. Martínez', schedule: 'Vie 09:00 - 13:00' },
      { id: 4, name: 'Programación Web', professor: 'Ing. Rodríguez', schedule: 'Lun 16:00 - 18:00' },
      { id: 5, name: 'Historia del Arte', professor: 'Mtro. Sánchez', schedule: 'Mié 08:00 - 10:00' },
    ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    dni: '',
    role: '',
    especialidad: ''
  })

  const roles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Profesor', value: 'profesor' },
    { label: 'Estudiante', value: 'estudiante' }
  ]

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const validateForm = (userData, isEdit = false) => {
    const newErrors = {}
    
    // Validación de email para ambos formularios
    if (!userData.email) {
      newErrors.email = 'Email es requerido'
    } else if (!validateEmail(userData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!userData.role) newErrors.role = 'Rol es requerido'
    
    if (userData.role === 'profesor' && !userData.especialidad) {
      newErrors.especialidad = 'Especialidad es requerida para profesores'
    }

    // Validaciones específicas de creación
    if (!isEdit) {
      if (!userData.password) {
        newErrors.password = 'Contraseña es requerida'
      } else if (userData.password !== userData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
      if (!userData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña'
      if (!userData.dni) newErrors.dni = 'DNI es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateUser = async () => {
    if (!validateForm(newUser)) return

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers([...users, { ...newUser, id: Date.now() }])
      setSuccessMessage('Usuario creado exitosamente!')
      setShowCreateModal(false)
      setNewUser({
        email: '',
        password: '',
        confirmPassword: '',
        dni: '',
        role: '',
        especialidad: ''
      })
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: 'Error al crear usuario' })
    }
  }

  const handleUpdateUser = async () => {
    if (!validateForm(selectedUser, true)) return

    try {
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, ...selectedUser } : user
      ))
      setSuccessMessage('Usuario actualizado exitosamente!')
      setShowEditModal(false)
      
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: 'Error al actualizar usuario' })
    }
  }

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
    setSuccessMessage('Usuario eliminado exitosamente!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleEditClass = () => {
    console.log(selectedClass);
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Gestión de Usuarios</h5>
          <CButton 
            color="primary" 
            onClick={() => setShowCreateModal(true)}
          >
            <CIcon icon={cilUserPlus} className="me-2" />
            Nuevo Usuario
          </CButton>
        </CCardHeader>
        
        <CCardBody>
          {successMessage && (
            <CAlert color="success" className="mb-4">
              {successMessage}
            </CAlert>
          )}

          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Rol</CTableHeaderCell>
                <CTableHeaderCell>DNI</CTableHeaderCell>
                <CTableHeaderCell>Especialidad</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map(user => (
                <CTableRow key={user.id}>
                  <CTableDataCell>{user.email}</CTableDataCell>
                  <CTableDataCell>
                    {roles.find(r => r.value === user.role)?.label}
                  </CTableDataCell>
                  <CTableDataCell>{user.dni}</CTableDataCell>
                  <CTableDataCell>
                    {user.role === 'profesor' ? user.especialidad : '-'}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CButton 
                        color="primary" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                      >
                        <CIcon icon={cilPencil} />
                      </CButton>
                      <CButton 
                        color="danger" 
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <CIcon icon={cilTrash} />
                      </CButton>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Modal Crear Usuario */}
      <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <CModalHeader>
          <CModalTitle>Crear Nuevo Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="email"
                label="Email"
                placeholder="ejemplo@dominio.com"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                invalid={!!errors.email}
                feedback={errors.email}
                required
              />
            </div>
            
            <div className="mb-3">
              <CFormInput
                type="password"
                label="Contraseña"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                invalid={!!errors.password}
                feedback={errors.password}
                required
              />
            </div>

            <div className="mb-3">
              <CFormInput
                type="password"
                label="Confirmar Contraseña"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                invalid={!!errors.confirmPassword}
                feedback={errors.confirmPassword}
                required
              />
            </div>
            
            <div className="mb-3">
              <CFormInput
                label="DNI"
                placeholder="12345678"
                value={newUser.dni}
                onChange={(e) => setNewUser({...newUser, dni: e.target.value})}
                invalid={!!errors.dni}
                feedback={errors.dni}
                required
              />
            </div>
            
            <div className="mb-3">
              <CFormSelect
                label="Rol"
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                invalid={!!errors.role}
                feedback={errors.role}
                required
              >
                <option value="">Seleccionar rol</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </CFormSelect>
            </div>
            
            {newUser.role === 'profesor' && (
              <div className="mb-3">
                <CFormInput
                  label="Especialidad"
                  value={newUser.especialidad}
                  onChange={(e) => setNewUser({...newUser, especialidad: e.target.value})}
                  invalid={!!errors.especialidad}
                  feedback={errors.especialidad}
                  required={newUser.role === 'profesor'}
                />
              </div>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowCreateModal(false)}>
            <CIcon icon={cilX} className="me-2" />
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleCreateUser}>
            <CIcon icon={cilSave} className="me-2" />
            Crear Usuario
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Modal Editar Usuario */}
      <CModal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <div className="mb-3">
              <CFormInput
                type="email"
                label="Email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                invalid={!!errors.email}
                feedback={errors.email}
                required
              />
            </div>
            
            <div className="mb-3">
              <CFormInput
                label="DNI"
                value={selectedUser?.dni || ''}
                readOnly
              />
            </div>
            
            <div className="mb-3">
              <CFormSelect
                label="Rol"
                value={selectedUser?.role || ''}
                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                invalid={!!errors.role}
                feedback={errors.role}
                required
              >
                <option value="">Seleccionar rol</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </CFormSelect>
            </div>

           
            
            {selectedUser?.role === 'profesor' && (
              <div className="mb-3">
                <CFormInput
                  label="Especialidad"
                  value={selectedUser?.especialidad || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, especialidad: e.target.value})}
                  invalid={!!errors.especialidad}
                  feedback={errors.especialidad}
                  required={selectedUser?.role === 'profesor'}
                />
              </div>
            )}
          </CForm>

          <AdminUserClass/>

        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            <CIcon icon={cilX} className="me-2" />
            Cancelar
          </CButton>
          <CButton color="primary" onClick={handleUpdateUser}>
            <CIcon icon={cilSave} className="me-2" />
            Guardar Cambios
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserManagement