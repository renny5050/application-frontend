import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Importa las rutas específicas para profesores
import teacherRoutes from '../views/dashboard/teacher/routes.js'

const TeacherContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<div className="text-center py-5"><CSpinner color="primary" /></div>}>
        <Routes>
          {teacherRoutes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="main" replace />} />
          
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(TeacherContent)