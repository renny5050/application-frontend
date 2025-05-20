import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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
  CFormFeedback
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false) // Inicializado como false si vacío

  const validateEmail = (email) => {
    if (!email) return false // Validación explícita para campos vacíos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateEmail(email)) {
      console.log('Email válido:', email)
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              {/* Formulario principal */}
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit} noValidate>
                    <h1>Recuperar Contraseña</h1>
                    <p className="text-body-secondary mb-4">
                      Ingresa tu correo electrónico para recibir instrucciones de recuperación
                    </p>

                    {/* Campo de correo electrónico */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Correo Electrónico"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setIsValid(validateEmail(e.target.value))
                        }}
                        invalid={!isValid}
                        feedbackInvalid="Por favor ingrese un correo electrónico válido"
                      />
                    </CInputGroup>

                    {/* Botones de acción */}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Enviar Instrucciones
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/login">
                          <CButton color="link" className="px-0">
                            Volver al Login
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

              {/* Tarjeta lateral con información */}
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Recuperación Segura</h2>
                    <p>
                      Recibirás un correo con instrucciones detalladas para restablecer tu contraseña.
                      Asegúrate de revisar tu bandeja de entrada y carpeta de spam.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        ¿Necesitas cuenta?
                      </CButton>
                    </Link>
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

export default ForgotPassword