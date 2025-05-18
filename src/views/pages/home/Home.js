import React from 'react';
import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarToggler,
  CNavLink,
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
  CFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  useColorModes
} from '@coreui/react';
import {
  cilMusicNote,
  cilUser,
  cilLockLocked,
  cilMoon,
  cilSun,
  cilContrast
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { Link } from 'react-router-dom';

const HomePage = () => {

  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  return (
    <CContainer fluid className="p-0">
      {/* Navbar */}
      <CNavbar>
        <CContainer>
          <CNavbarBrand>
            <CIcon icon={cilMusicNote} className="me-2" />
            Academia Musical Harmony
          </CNavbarBrand>
          <div className="d-flex">
            <CDropdown  placement="bottom-end">
                        <CDropdownToggle caret={false}>
                          {colorMode === 'dark' ? (
                            <CIcon icon={cilMoon} size="lg" />
                          ) : colorMode === 'auto' ? (
                            <CIcon icon={cilContrast} size="lg" />
                          ) : (
                            <CIcon icon={cilSun} size="lg" />
                          )}
                        </CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem
                            active={colorMode === 'light'}
                            className="d-flex align-items-center"
                            as="button"
                            type="button"
                            onClick={() => setColorMode('light')}
                          >
                            <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                          </CDropdownItem>
                          <CDropdownItem
                            active={colorMode === 'dark'}
                            className="d-flex align-items-center"
                            as="button"
                            type="button"
                            onClick={() => setColorMode('dark')}
                          >
                            <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                          </CDropdownItem>
                          <CDropdownItem
                            active={colorMode === 'auto'}
                            className="d-flex align-items-center"
                            as="button"
                            type="button"
                            onClick={() => setColorMode('auto')}
                          >
                            <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
            <CNavLink to="/login" as={Link} className="me-3">
              <CIcon icon={cilUser} className="me-1" />
              Iniciar Sesión
            </CNavLink>
            <CNavLink to="/register" as={Link}>
              <CIcon icon={cilLockLocked} className="me-1" />
              Registro
            </CNavLink>
          </div>
        </CContainer>
      </CNavbar>

      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <CContainer className="text-center py-5">
          <h1 className="display-4 mb-4">Transforma tu Pasión en Arte</h1>
          <p className="lead mb-4">Clases profesionales de música para todos los niveles</p>
          <CButton color="light" size="lg" className="me-2" to="/register" as={Link}>
            Comienza Ahora
          </CButton>
        </CContainer>
      </section>

      {/* Features Section */}
      <CContainer className="my-5">
        <CRow>
          <CCol md={4}>
            <CCard className="h-100">
              <CCardBody className="text-center">
                <CIcon icon={cilMusicNote} height={36} className="mb-3 text-primary" />
                <CCardTitle>Instrumentos Variados</CCardTitle>
                <CCardText>
                  Aprende guitarra, piano, violín, batería y más con nuestros expertos
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="h-100">
              <CCardBody className="text-center">
                <CIcon icon={cilMusicNote} height={36} className="mb-3 text-primary" />
                <CCardTitle>Teoría Musical</CCardTitle>
                <CCardText>
                  Domina solfeo, armonía y composición con nuestro plan de estudios
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="h-100">
              <CCardBody className="text-center">
                <CIcon icon={cilUser} height={36} className="mb-3 text-primary" />
                <CCardTitle>Profesores Certificados</CCardTitle>
                <CCardText>
                  Clases personalizadas con músicos profesionales activos
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      {/* Footer */}
      <CFooter className="bg-dark text-white mt-5">
        <CContainer className="py-4 text-center">
          <p className="mb-2">© 2024 Academia Musical Harmony</p>
          <p className="mb-0">contacto@harmony.edu | Tel: +1 234 567 890</p>
        </CContainer>
      </CFooter>
    </CContainer>
  );
};

export default HomePage;