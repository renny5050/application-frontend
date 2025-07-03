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
  CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
// src/components/ProtectedRoute.jsx
import { jwtDecode } from 'jwt-decode'; // Cambiado de import jwtDecode a { jwtDecode }

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
      // Realizar petición al endpoint de login
      const response = await fetch('http://localhost:3002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error de autenticación')
      }

      // Guardar token en localStorage
      localStorage.setItem('authToken', data.token)
      
      const roleMap = {
      1: 'admin',
      2: 'teacher',
      3: 'student'
    };

      // Decodificar token para obtener el rol
      const decoded = jwtDecode(data.token)
      const roleId = roleMap[decoded.role_id]

      console.log('Decoded token:', decoded)

      // Redirigir al dashboard con el role_id en la ruta
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
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    
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
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setIsEmailValid(validateEmail(e.target.value))
                          setError('')
                        }}
                        invalid={!isEmailValid}
                      />
                      <CFormFeedback invalid>
                        Por favor ingrese un correo electrónico válido
                      </CFormFeedback>
                    </CInputGroup>
                    
                    {/* Campo de contraseña */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
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
                        <CButton 
                          color="primary" 
                          className="px-4" 
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <CSpinner component="span" size="sm" aria-hidden="true" />
                              <span className="ms-2">Cargando...</span>
                            </>
                          ) : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton 
                          color="link" 
                          className="px-0" 
                          as={Link} 
                          to="/forgot-password"
                        >
                          Forgot password?
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
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, 
                      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    
                    <CButton 
                      color="primary" 
                      className="mt-3" 
                      active 
                      tabIndex={-1} 
                      as={Link} 
                      to="/register"
                    >
                      Register Now!
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