import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CAlert,
  CRow,
  CCol,
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked, cilCheckAlt } from '@coreui/icons'

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Administrador',
    registered: '15 de marzo de 2023'
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validatePassword = (password) => {
    return password.length >= 8
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es requerida'
    }

    if (!validatePassword(passwordForm.newPassword)) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      setErrors({ submit: 'Error al cambiar la contraseña. Verifique su contraseña actual.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={8}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex align-items-center">
            <CIcon icon={cilUser} className="me-2" />
            Perfil de Usuario
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <CCol>
                <h5>Información del Usuario</h5>
                <dl className="row">
                  <dt className="col-sm-3">Nombre:</dt>
                  <dd className="col-sm-9">{userData.name}</dd>

                  <dt className="col-sm-3">Email:</dt>
                  <dd className="col-sm-9">{userData.email}</dd>

                  <dt className="col-sm-3">Rol:</dt>
                  <dd className="col-sm-9">{userData.role}</dd>

                  <dt className="col-sm-3">Registrado:</dt>
                  <dd className="col-sm-9">{userData.registered}</dd>
                </dl>
              </CCol>
            </CRow>

            <CRow>
              <CCol>
                <h5>Cambiar Contraseña</h5>
                <CForm onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <CFormInput
                      type="password"
                      name="currentPassword"
                      label="Contraseña Actual"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      invalid={!!errors.currentPassword}
                      feedback={errors.currentPassword}
                    />
                  </div>

                  <div className="mb-3">
                    <CFormInput
                      type="password"
                      name="newPassword"
                      label="Nueva Contraseña"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      invalid={!!errors.newPassword}
                      feedback={errors.newPassword}
                    />
                  </div>

                  <div className="mb-4">
                    <CFormInput
                      type="password"
                      name="confirmPassword"
                      label="Confirmar Nueva Contraseña"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      invalid={!!errors.confirmPassword}
                      feedback={errors.confirmPassword}
                    />
                  </div>

                  {errors.submit && (
                    <CAlert color="danger" className="mb-3">
                      {errors.submit}
                    </CAlert>
                  )}

                  {success && (
                    <CAlert color="success" className="mb-3">
                      <CIcon icon={cilCheckAlt} className="me-2" />
                      ¡Contraseña actualizada exitosamente!
                    </CAlert>
                  )}

                  <div className="d-flex justify-content-end">
                    <CButton 
                      type="submit" 
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          <span className="ms-2">Procesando...</span>
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilLockLocked} className="me-2" />
                          Cambiar Contraseña
                        </>
                      )}
                    </CButton>
                  </div>
                </CForm>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile