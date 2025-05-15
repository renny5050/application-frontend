import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CListGroup,
  CListGroupItem,
} from '@coreui/react';
import AppSidebar from 'src/components/AppSidebar';
import AppHeader from 'src/components/AppHeader';
import AppFooter from 'src/components/AppFooter';

const TeacherDashboard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // Simulated data for the teacher's schedule
  const schedule = [
    { id: 1, day: 'Monday', time: '10:00 AM', subject: 'Guitar', room: 'A101', students: [
      { id: 101, firstName: 'John', lastName: 'Doe' },
      { id: 102, firstName: 'Jane', lastName: 'Smith' },
    ]},
    { id: 2, day: 'Tuesday', time: '11:00 AM', subject: 'Piano', room: 'B202', students: [
      { id: 103, firstName: 'Alice', lastName: 'Johnson' },
      { id: 104, firstName: 'Bob', lastName: 'Williams' },
    ]},
    { id: 3, day: 'Wednesday', time: '09:00 AM', subject: 'Violin', room: 'C303', students: [
      { id: 105, firstName: 'Eve', lastName: 'Brown' },
      { id: 106, firstName: 'Charlie', lastName: 'Davis' },
    ]},
  ];

  // Function to open the modal and select a class
  const openModal = (classData) => {
    setSelectedClass(classData);
    setModalVisible(true);
  };

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <CRow>
            {/* Schedule */}
            <CCol xs={12}>
              <CCard>
                <CCardHeader>Teacher's Schedule</CCardHeader>
                <CCardBody>
                  <CListGroup>
                    {schedule.map((activity) => (
                      <CListGroupItem key={activity.id}>
                        <div>
                          <strong>{activity.day}</strong> - {activity.time}: {activity.subject}
                          <CButton
                            color="primary"
                            size="sm"
                            className="ms-3"
                            onClick={() => openModal(activity)}
                          >
                            View More
                          </CButton>
                        </div>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCardBody>
              </CCard>
            </CCol>

            {/* Modal to Show Students in the Class */}
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
              <CModalHeader>
                <CModalTitle>Students in {selectedClass?.subject}</CModalTitle>
              </CModalHeader>
              <CModalBody>
                {selectedClass && (
                  <CListGroup>
                    {selectedClass.students.map((student) => (
                      <CListGroupItem key={student.id}>
                        <strong>{student.firstName} {student.lastName}</strong> - ID: {student.id}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                )}
              </CModalBody>
            </CModal>

            {/* List of All Classes with Attendance Management Button */}
            <CCol xs={12}>
              <CCard>
                <CCardHeader>All Classes</CCardHeader>
                <CCardBody>
                  <CListGroup>
                    {schedule.map((activity) => (
                      <CListGroupItem key={activity.id}>
                        <div>
                          <strong>{activity.subject}</strong> - {activity.room}
                          <CButton
                            color="info"
                            size="sm"
                            className="ms-3"
                            onClick={() => window.location.href = `/attendance/${activity.id}`}
                          >
                            Manage Attendance
                          </CButton>
                        </div>
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default TeacherDashboard;