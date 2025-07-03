import React, { useEffect, useState } from 'react'
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
  CTableDataCell,
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilPencil, cilSave, cilX, cilTrash, cilReload } from '@coreui/icons'
import AdminUserClass from './AdminUserClass'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingSpecialties, setLoadingSpecialties] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [fetchErrorSpecialties, setFetchErrorSpecialties] = useState('')
  const [classesData, setClassesData] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dni: '',
    role: '',
    specialty_id: ''
  })
  const [specialtyNames, setSpecialtyNames] = useState({})

  const roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Profesor', value: 2 },
    { label: 'Estudiante', value: 3 }
  ]

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const validateForm = (userData, isEdit = false) => {
    const newErrors = {}

    if (!userData.email) {
      newErrors.email = 'Email es requerido'
    } else if (!validateEmail(userData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!userData.role) newErrors.role = 'Rol es requerido'

    if (userData.role === 2 && !userData.specialty_id) {
      newErrors.especialidad = 'Especialidad es requerida para profesores'
    }

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

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.value === roleId)
    return role ? role.label : 'Desconocido'
  }

  const fetchSpecialtyName = async (specialtyId) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch(`http://localhost:3002/api/specialties/${specialtyId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error(`Error al obtener especialidad ${specialtyId}`)
      }

      const data = await response.json()
      return data.name
    } catch (error) {
      console.error(`Error fetching specialty ${specialtyId}:`, error)
      return 'Especialidad desconocida'
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setFetchError('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch('http://localhost:3002/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Error al obtener usuarios')
      }

      const data = await response.json()
      const formattedUsers = data.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        dni: user.dni,
        role: user.role_id,
        specialty_id: user.specialty_id
      }))
      setUsers(formattedUsers)

      // Obtener nombres de especialidades para profesores
      const specialtyIds = data
        .filter(user => user.role_id === 2 && user.specialty_id)
        .map(user => user.specialty_id)
      
      // Eliminar duplicados
      const uniqueSpecialtyIds = [...new Set(specialtyIds)]
      
      // Obtener nombres para cada especialidad única
      const names = {}
      for (const id of uniqueSpecialtyIds) {
        names[id] = await fetchSpecialtyName(id)
      }
      setSpecialtyNames(names)
      
    } catch (error) {
      console.error('Error fetching users:', error)
      setFetchError(error.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    setLoadingClasses(true)
    setFetchError('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch('http://localhost:3002/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Error al obtener clases')
      }

      const data = await response.json()
      setClassesData(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
      setFetchError(error.message || 'Error al cargar clases')
    } finally {
      setLoadingClasses(false)
    }
  }

  const fetchSpecialties = async () => {
    setLoadingSpecialties(true)
    setFetchErrorSpecialties('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch('http://localhost:3002/api/specialties', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Error al obtener especialidades')
      }

      const data = await response.json()
      setSpecialties(data)
    } catch (error) {
      console.error('Error fetching specialties:', error)
      setFetchErrorSpecialties(error.message || 'Error al cargar especialidades')
    } finally {
      setLoadingSpecialties(false)
    }
  }

  // Cargar todos los datos al montar
  useEffect(() => {
    fetchUsers()
    fetchClasses()
    fetchSpecialties()
  }, [])

  const handleCreateUser = async () => {
    if (!validateForm(newUser)) return

    setErrors({})
    setSuccessMessage('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch('http://localhost:3002/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          dni: newUser.dni,
          role_id: newUser.role,
          specialty_id: newUser.role === 2 ? parseInt(newUser.specialty_id) : null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear usuario')
      }

      const createdUser = await response.json()
      setUsers([...users, {
        ...createdUser,
        firstName: createdUser.first_name,
        lastName: createdUser.last_name,
        specialty_id: createdUser.specialty_id
      }])
      
      // Si es profesor, obtener nombre de especialidad
      if (createdUser.role_id === 2 && createdUser.specialty_id) {
        const name = await fetchSpecialtyName(createdUser.specialty_id)
        setSpecialtyNames(prev => ({
          ...prev,
          [createdUser.specialty_id]: name
        }))
      }
      
      setSuccessMessage('Usuario creado exitosamente!')
      setShowCreateModal(false)
      setNewUser({
        email: '',
        password: '',
        confirmPassword: '',
        dni: '',
        role: '',
        specialty_id: '',
        firstName: '',
        lastName: ''
      })

      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: error.message || 'Error al crear usuario' })
    }
  }

  const handleUpdateUser = async () => {
    if (!validateForm(selectedUser, true)) return

    setErrors({})
    setSuccessMessage('')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch(`http://localhost:3002/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: selectedUser.email,
          role_id: selectedUser.role,
          specialty_id: selectedUser.role === 2 ? parseInt(selectedUser.specialty_id) : null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al actualizar usuario')
      }

      const updatedUser = await response.json()
      const updatedUserData = {
        ...updatedUser,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        specialty_id: updatedUser.specialty_id
      }
      
      setUsers(users.map(user => user.id === selectedUser.id ? updatedUserData : user))
      
      // Actualizar nombre de especialidad si cambió
      if (selectedUser.role === 2 && selectedUser.specialty_id) {
        if (!specialtyNames[selectedUser.specialty_id]) {
          const name = await fetchSpecialtyName(selectedUser.specialty_id)
          setSpecialtyNames(prev => ({
            ...prev,
            [selectedUser.specialty_id]: name
          }))
        }
      }
      
      setSuccessMessage('Usuario actualizado exitosamente!')
      setShowEditModal(false)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: error.message || 'Error al actualizar usuario' })
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No se encontró token de autenticación')

      const response = await fetch(`http://localhost:3002/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al eliminar usuario')
      }

      setUsers(users.filter(user => user.id !== userId))
      setSuccessMessage('Usuario eliminado exitosamente!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ submit: error.message || 'Error al eliminar usuario' })
    }
  }

  const handleRefresh = () => {
    fetchUsers()
    fetchClasses()
    fetchSpecialties()
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h5>Gestión de Usuarios</h5>
          <div className="d-flex gap-2">
            <CButton 
              color="secondary" 
              onClick={handleRefresh}
              disabled={loading || loadingClasses || loadingSpecialties}
            >
              <CIcon icon={cilReload} className={loading || loadingClasses || loadingSpecialties ? "spin-icon" : ""} />
              {loading || loadingClasses || loadingSpecialties ? ' Cargando...' : ' Actualizar'}
            </CButton>
            <CButton 
              color="primary" 
              onClick={() => {
                setNewUser({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  dni: '',
                  role: '',
                  specialty_id: '',
                  firstName: '',
                  lastName: ''
                })
                setShowCreateModal(true)
                setFetchErrorSpecialties('')
                setErrors({})
                setSuccessMessage('')
              }}
            >
              <CIcon icon={cilUserPlus} className="me-2" />
              Nuevo Usuario
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {successMessage && (
            <CAlert color="success" className="mb-4">
              {successMessage}
            </CAlert>
          )}

          {fetchError && (
            <CAlert color="danger" className="mb-4">
              {fetchError}
            </CAlert>
          )}

          {loading ? (
            <div className="d-flex justify-content-center my-5">
              <CSpinner />
            </div>
          ) : (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Nombre</CTableHeaderCell>
                  <CTableHeaderCell>Apellido</CTableHeaderCell>
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
                    <CTableDataCell>{user.firstName}</CTableDataCell>
                    <CTableDataCell>{user.lastName}</CTableDataCell>
                    <CTableDataCell>{getRoleName(user.role)}</CTableDataCell>
                    <CTableDataCell>{user.dni}</CTableDataCell>
                    <CTableDataCell>
                      {user.role === 2 && user.specialty_id
                        ? specialtyNames[user.specialty_id] || 'Cargando...'
                        : user.role === 2 && !user.specialty_id
                          ? 'Sin especialidad'
                          : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="d-flex gap-2">
                        <CButton 
                          color="primary" 
                          size="sm"
                          onClick={() => {
                            setSelectedUser({
                              ...user,
                              specialty_id: user.specialty_id
                            })
                            setErrors({})
                            setSuccessMessage('')
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
          )}
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
                label="Nombre"
                placeholder="Juan"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                invalid={!!errors.firstName}
                feedback={errors.firstName}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput
                label="Apellido"
                placeholder="Pérez"
                value={newUser.lastName}
                onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                invalid={!!errors.lastName}
                feedback={errors.lastName}
                required
              />
            </div>
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
                required={!newUser.id}
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
                required={!newUser.id}
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
                onChange={(e) => setNewUser({...newUser, role: parseInt(e.target.value), specialty_id: ''})}
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
            {newUser.role === 2 && (
              <div className="mb-3">
                <CFormSelect
                  label="Especialidad"
                  value={newUser.specialty_id}
                  onChange={(e) => setNewUser({...newUser, specialty_id: e.target.value})}
                  invalid={!!errors.especialidad}
                  feedback={errors.especialidad}
                  required={newUser.role === 2}
                  disabled={loadingSpecialties}
                >
                  <option value="">Seleccionar especialidad</option>
                  {specialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </CFormSelect>
                {loadingSpecialties && <small className="text-muted">Cargando especialidades...</small>}
                {fetchErrorSpecialties && (
                  <CAlert color="danger" className="mt-2 mb-0">
                    {fetchErrorSpecialties}
                  </CAlert>
                )}
              </div>
            )}
            {errors.submit && (
              <CAlert color="danger" className="mt-3">{errors.submit}</CAlert>
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
      <CModal size="lg" visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <CModalHeader>
          <CModalTitle>Editar Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="row">
            <div className="col-md-6">
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
                    onChange={(e) => setSelectedUser({...selectedUser, role: parseInt(e.target.value), specialty_id: ''})}
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
                {selectedUser?.role === 2 && (
                  <div className="mb-3">
                    <CFormSelect
                      label="Especialidad"
                      value={selectedUser?.specialty_id || ''}
                      onChange={(e) => setSelectedUser({...selectedUser, specialty_id: e.target.value})}
                      invalid={!!errors.especialidad}
                      feedback={errors.especialidad}
                      required={selectedUser?.role === 2}
                      disabled={loadingSpecialties}
                    >
                      <option value="">Seleccionar especialidad</option>
                      {specialties.map(specialty => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </CFormSelect>
                    {loadingSpecialties && <small className="text-muted">Cargando especialidades...</small>}
                    {fetchErrorSpecialties && (
                      <CAlert color="danger" className="mt-2 mb-0">
                        {fetchErrorSpecialties}
                      </CAlert>
                    )}
                  </div>
                )}
                {errors.submit && (
                  <CAlert color="danger">{errors.submit}</CAlert>
                )}
              </CForm>
            </div>
            <div className="col-md-6">
              <h5>Clases asociadas</h5>
              {selectedUser && (
                <AdminUserClass 
                  user={selectedUser} 
                  classes={classesData} 
                  loading={loadingClasses}
                />
              )}
            </div>
          </div>
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

      <style jsx>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

export default UserManagement