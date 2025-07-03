import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormFeedback,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validateEmail = (email) => {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const isValid = validateEmail(email)
    setIsEmailValid(isValid)

    if (!isValid) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('https://application-backend-4anj.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación')
      }

      localStorage.setItem('authToken', data.token)

      const roleMap = {
        1: 'admin',
        2: 'teacher',
        3: 'student',
      }

      const decoded = jwtDecode(data.token)
      const roleId = roleMap[decoded.role_id]

      console.log('Decoded token:', decoded)
      navigate(`/dashboard/${roleId}`)
    } catch (error) {
      setError(error.message || 'Error de inicio de sesión. Verifica tus credenciales.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit} noValidate>
                    <h1>Iniciar Sesión</h1>
                    <p className="text-body-secondary">Ingresa con tu cuenta para continuar</p>

                    {/* Mensaje de error */}
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}

                    {/* Campo de email con validación */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Correo Electrónico"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setIsEmailValid(validateEmail(e.target.value))
                          setError('')
                        }}
                        invalid={!isEmailValid}
                      />
                      <CFormFeedback invalid>Por favor ingrese un correo electrónico válido</CFormFeedback>
                    </CInputGroup>

                    {/* Campo de contraseña */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Contraseña"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError('')
                        }}
                      />
                    </CInputGroup>

                    {/* Botones */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <CSpinner component="span" size="sm" aria-hidden="true" />
                              <span className="ms-2">Ingresando...</span>
                            </>
                          ) : (
                            'Ingresar'
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          as={Link}
                          to="/forgot-password"
                        >
                          ¿Olvidaste tu contraseña?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Tarjeta lateral */}
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>¿Aún sin cuenta?</h2>
                    <p>
                      Únete a nuestra plataforma hoy mismo. El proceso de registro es rápido, sencillo y abre
                      un mundo de posibilidades.
                    </p>

                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      tabIndex={-1}
                      as={Link}
                      to="/register"
                    >
                      ¡Regístrate Ahora!
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login