import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormFeedback,
  CSpinner,
  CAlert
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email) => {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => password.length >= 6

  const validateConfirmPassword = (password, confirm) => password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Dado que que CForm tiene la propiedad noValidate, 
    // es necesario realizar una validación en el submit.

    const emailValid = validateEmail(email)
    const passwordValid = validatePassword(password)
    const confirmPasswordValid = validateConfirmPassword(password, confirmPassword)

    // Cambio de estado en la validación de los campos.

    setIsEmailValid(emailValid)
    setIsPasswordValid(passwordValid)
    setIsConfirmPasswordValid(confirmPasswordValid)

    // Verifica el estado antes de hacer el fetch.

    if (emailValid && passwordValid && confirmPasswordValid) {

      // Establece el estado de carga para usarse en el 
      // mensaje de carga y botón de registro.

      setLoading(true)
      setError(null)
      setSuccess(false)

      try {
        // Recuerda cambiar este  fetch en la versión final de programa.
        const response = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error en el registro')
        }

        const data = await response.json()
        setSuccess(true)
        console.log('Registro exitoso:', data)

        // Reiniciar campos
        setEmail('')
        setPassword('')
        setConfirmPassword('')

      } catch (err) {
        setError(err.message || 'Hubo un problema al registrar')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {/*La propiedad noValidate está activa en el CForm para
                 tener mensajes personalizados de validación. Ver el handleSubmit*/}
                <CForm onSubmit={handleSubmit} noValidate>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

                  {/* Mensaje de carga */}
                  {loading && (
                    <div className="text-center my-3">
                      <CSpinner color="primary" />
                      <p className="mt-2">Enviando datos...</p>
                    </div>
                  )}

                  {/* Mensaje de éxito */}
                  {success && (
                    <CAlert color="success" onClose={() => setSuccess(false)} dismissible>
                      ¡Registro exitoso! Revisa tu correo para confirmar la cuenta.
                    </CAlert>
                  )}

                  {/* Mensaje de error */}
                  {error && (
                    <CAlert color="danger" onClose={() => setError(null)} dismissible>
                      {error}
                    </CAlert>
                  )}

                    {/* Cada campo tiene en su método onChange una validación para
                     llamar el CFormFeedback personalizado.*/}
                    
                    {/* Campo de email */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setIsEmailValid(validateEmail(e.target.value))
                      }}
                      invalid={!isEmailValid}
                    />
                    <CFormFeedback invalid>
                      Por favor ingrese un correo electrónico válido
                    </CFormFeedback>
                  </CInputGroup>
                  
                  {/* Campo de contraseña */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setIsPasswordValid(validatePassword(e.target.value))
                      }}
                      invalid={!isPasswordValid}
                    />
                    <CFormFeedback invalid>
                      La contraseña debe tener al menos 6 caracteres
                    </CFormFeedback>
                  </CInputGroup>
                  
                  {/* Campo de confirmar contraseña */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        setIsConfirmPasswordValid(validateConfirmPassword(password, e.target.value))
                      }}
                      invalid={!isConfirmPasswordValid}
                    />
                    <CFormFeedback invalid>
                      Las contraseñas no coinciden
                    </CFormFeedback>
                  </CInputGroup>
                  
                  {/* Botón de registro */}
                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <CSpinner size="sm" /> Registrando...
                        </>
                      ) : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register