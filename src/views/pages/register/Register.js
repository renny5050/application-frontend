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
  const [dni, setDni] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isDniValid, setIsDniValid] = useState(true)
  const [isFirstNameValid, setIsFirstNameValid] = useState(true)
  const [isLastNameValid, setIsLastNameValid] = useState(true)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const [isPasswordValid, setIsPasswordValid] = useState(true)
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const validateDni = (dni) => dni.length >= 8
  const validateName = (name) => name.trim() !== ''
  const validateEmail = (email) => {
    if (!email) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  const validatePassword = (password) => password.length >= 6
  const validateConfirmPassword = (password, confirm) => password === confirm

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dniValid = validateDni(dni)
    const firstNameValid = validateName(firstName)
    const lastNameValid = validateName(lastName)
    const emailValid = validateEmail(email)
    const passwordValid = validatePassword(password)
    const confirmPasswordValid = validateConfirmPassword(password, confirmPassword)

    setIsDniValid(dniValid)
    setIsFirstNameValid(firstNameValid)
    setIsLastNameValid(lastNameValid)
    setIsEmailValid(emailValid)
    setIsPasswordValid(passwordValid)
    setIsConfirmPasswordValid(confirmPasswordValid)

    if (dniValid && firstNameValid && lastNameValid && emailValid && passwordValid && confirmPasswordValid) {
      setLoading(true)
      setError(null)
      setSuccess(false)

      try {
        const response = await fetch('https://application-backend-4anj.onrender.com/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dni,
            firstName,
            lastName,
            email,
            password,
            role_id: 3,  // Establecer como estudiante por defecto
            status: 'active'  // Establecer como activo por defecto
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
        setDni('')
        setFirstName('')
        setLastName('')
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
                <CForm onSubmit={handleSubmit} noValidate>
                  <h1>Registro</h1>
                  <p className="text-body-secondary">Crea tu cuenta</p>

                  {loading && (
                    <div className="text-center my-3">
                      <CSpinner color="primary" />
                      <p className="mt-2">Enviando datos...</p>
                    </div>
                  )}

                  {success && (
                    <CAlert color="success" onClose={() => setSuccess(false)} dismissible>
                      ¡Registro exitoso! Revisa tu correo para confirmar la cuenta.
                    </CAlert>
                  )}

                  {error && (
                    <CAlert color="danger" onClose={() => setError(null)} dismissible>
                      {error}
                    </CAlert>
                  )}

                  {/* Campo DNI */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="DNI"
                      autoComplete="dni"
                      value={dni}
                      onChange={(e) => {
                        setDni(e.target.value)
                        setIsDniValid(validateDni(e.target.value))
                      }}
                      invalid={!isDniValid}
                    />
                    <CFormFeedback invalid>
                      El DNI debe tener al menos 8 caracteres
                    </CFormFeedback>
                  </CInputGroup>

                  {/* Campo Primer Nombre */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Primer Nombre"
                      autoComplete="given-name"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value)
                        setIsFirstNameValid(validateName(e.target.value))
                      }}
                      invalid={!isFirstNameValid}
                    />
                    <CFormFeedback invalid>
                      Por favor ingrese su primer nombre
                    </CFormFeedback>
                  </CInputGroup>

                  {/* Campo Apellido */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="Apellido"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value)
                        setIsLastNameValid(validateName(e.target.value))
                      }}
                      invalid={!isLastNameValid}
                    />
                    <CFormFeedback invalid>
                      Por favor ingrese su apellido
                    </CFormFeedback>
                  </CInputGroup>

                  {/* Campo Email */}
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

                  {/* Campo Contraseña */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Contraseña"
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

                  {/* Campo Confirmar Contraseña */}
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repetir Contraseña"
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

                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <CSpinner size="sm" /> Registrando...
                        </>
                      ) : 'Crear Cuenta'}
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