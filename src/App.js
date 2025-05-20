import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProtectedRoute from './components/ProtectedRoute'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'


// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Home = React.lazy(() => import('./views/pages/home/Home'))
const ForgotPassword = React.lazy(() => import('./views/pages/login/Forgotpasswod'))
const DashboardAdmin = React.lazy(() => import('./views/dashboard/admin/DashboardAdmin'))
const DashboardStudent = React.lazy(() => import('./views/dashboard/student/DashboardStudent'))
const DashboardTeacher = React.lazy(() => import('./views/dashboard/teacher/DashboardTeacher'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route path="/forgot-password" name="Forgot Password" element={<ForgotPassword />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="*" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="/" name="Home" element={<Home />} />
          <Route
            path="/dashboard/admin/*"
            name="Admin Dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            name="Student Dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <DashboardStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teacher"
            name="Teacher Dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <DashboardTeacher />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
