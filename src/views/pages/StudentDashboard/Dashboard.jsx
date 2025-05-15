import React from 'react';
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CCardTitle,
    CCardText,
    CButton,
    CProgress,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
} from '@coreui/react';
import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CIcon } from '@coreui/icons-react';
import { cilUser, cilEnvelopeClosed, cilPhone} from '@coreui/icons';

const WelcomeCard = (props) => {

    return(
    <CCard className='border-dark'>
        <CCardBody>
        <CRow>
            <CCol>
                <CCardTitle>Welcome {props.name} {props.lastname}!</CCardTitle>
                <CCardText>Welcome Back! Let’s make today productive. Track your progress, manage tasks, and stay ahead. 🚀</CCardText>
            </CCol>
            
        </CRow>
        </CCardBody>
    </CCard>
    );
}

const PerformanceCard = (props) => {

    const [visible, setVisible] = React.useState(false);

    return(
    <CCard className='border-dark'>
        <CCardBody>
        <CCardTitle>Attendance</CCardTitle>
        {props.e ? (
            <>
                <CCardText>{props.e.clases[0].nombre}:</CCardText>
                <CProgress value={props.e.clases[0].porcentaje_asistencia}>{props.e.clases[0].porcentaje_asistencia}%</CProgress>
                <CCardText>{props.e.clases[1].nombre}:</CCardText>
                <CProgress value={props.e.clases[1].porcentaje_asistencia}>{props.e.clases[1].porcentaje_asistencia}%</CProgress>
            </>
        ) : (
            <CCardText>No student data available</CCardText>
        )}
        <CRow className='d-flex justify-content-center p-2'>
            <CButton color='primary' style={{width: '30%'}} onClick={() => setVisible(true)}>
                See More
            </CButton>
        </CRow>

        <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
                    <CModalHeader>
                        <CModalTitle>All Class Attendance</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {props.e.clases.map((clase) => (
                            <div className="mb-3">
                                <CCardText>{clase.nombre}:</CCardText>
                                <CProgress value={clase.porcentaje_asistencia}>{clase.porcentaje_asistencia}%</CProgress>
                            </div>
                        ))}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal>

        </CCardBody>
    </CCard>
    );
}

const TeacherCard = (props) => {

    const [visible, setVisible] = React.useState(false);

    return(
    <CCard className='border-dark'>
        <CCardBody>
        <CCardTitle className='mb-3'>Teachers</CCardTitle>
        
        <CRow>
            <CCol xs={1}>
                <CIcon icon={cilUser} size='lg'/>
            </CCol>
            <CCol>
                <CCardText>{props.e.clases[0].profesor}</CCardText>
            </CCol>
            <CCol xs={1}>
            <CIcon icon={cilEnvelopeClosed} size='lg'/>
            </CCol>
            <CCol xs={1}>
            <CIcon icon={cilPhone} size='lg'/>
            </CCol>
        </CRow>

        <CRow>
            <CCol xs={1}>
                <CIcon icon={cilUser} size='lg'/>
            </CCol>
            <CCol>
                <CCardText>{props.e.clases[1].profesor}</CCardText>
            </CCol>
            <CCol xs={1}>
            <CIcon icon={cilEnvelopeClosed} size='lg'/>
            </CCol>
            <CCol xs={1}>
            <CIcon icon={cilPhone} size='lg'/>
            </CCol>
        </CRow>

        <CRow className='d-flex justify-content-center  p-2'>
            <CButton color='primary' style={{width: '30%'}} onClick={() => setVisible(true)}>See More</CButton>
        </CRow>

        <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
                    <CModalHeader>
                        <CModalTitle>Teachers</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {props.e.clases.map((clase) => (
                            <div className="mb-3">
                                <CCardText>{clase.nombre}:</CCardText>
                                <CCardText>{clase.profesor}:</CCardText>
                            </div>
                        ))}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
        </CModal>
        
        </CCardBody>
    </CCard>
    );
}

const SubClassCard = (props) => {
    return(
        <CCard className='m-3'>
            <CCardBody>
                <CCardTitle>
                    {props.clase.nombre}
                </CCardTitle>
                <CCardText>
                    {props.clase.horario}
                </CCardText>
            </CCardBody>
        </CCard>
    );
}

const ClassCard = (props) => {

    const [visible, setVisible] = React.useState(false);

    return(
    <CCard className='border-dark'>
        <CCardBody>
        <CCardTitle>Classes:</CCardTitle>
        <SubClassCard clase={props.e.clases[0]}/>
        <SubClassCard clase={props.e.clases[1]}/>
        <CRow className='d-flex justify-content-center p-2'>
            <CButton color='primary' style={{width: '50%'}} onClick={() => setVisible(true)}>See More</CButton>
        </CRow>

        <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
                    <CModalHeader>
                        <CModalTitle>Classes</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        {props.e.clases.map((clase) => (
                            <div className="mb-3">
                                <CCardText>{clase.nombre}:</CCardText>
                                <CCardText>{clase.horario}:</CCardText>
                            </div>
                        ))}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
        </CModal>

        </CCardBody>
    </CCard>
    );
}

const SubNotification = (props) => {
    return(
        <CCard className='m-3'>
            <CCardBody>
                <CCardTitle style={{ fontSize: '1rem' }}>
                    {props.not.mensaje}
                </CCardTitle>
                <CCardText style={{ fontSize: '0.875rem' }}>
                    {props.not.fecha}
                </CCardText>
            </CCardBody>
        </CCard>
    );
}


const NotificationsCard = (props) => {

    return(
    <CCard className='border-dark'>
        <CCardBody>
        <CCardTitle>Notifications</CCardTitle>
        {
            props.e.map((not) => {return <SubNotification not={not} />})
        }
        </CCardBody>
    </CCard>
    );
}

const Dashboard = () => {

    const [estudiantes, setEstudiantes] = React.useState([]);
    const [student, setStudent] = React.useState(null);
    const { id: eId } = useParams();

    useEffect(() => {

        const fetchEstudiantes = async () => {
            try {
            const response = await fetch('http://localhost:3000/estudiantes');
            const data = await response.json();
            setEstudiantes(data);
            const found = data.find( e => parseInt(e.id) === parseInt(eId));
            setStudent(found);
            } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            }
        };

        fetchEstudiantes();

    }, [eId]);

    return(
        <CContainer fluid>
            <CRow className="align-items-center p-2">
                <CCol>
                    <h5 className="m-0">Dashboard</h5>
                </CCol>
                <CCol xs="auto">
                    <CDropdown>
                        <CDropdownToggle color="secondary" className="px-3">
                            User Actions
                        </CDropdownToggle>
                        <CDropdownMenu placement="bottom-end">
                            <CDropdownItem>Account Info</CDropdownItem>
                            <CDropdownItem>Log Off</CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                </CCol>
            </CRow>
            <CRow style={{ minHeight: '120vh' }} className='bg-light'>
                <CCol xs={1} className='bg-dark text-light d-flex flex-column align-items-center p-3'>
                    <Link to="/Login" style={{ width: '100%' }}>
                        <CButton color='secondary' className='mb-3' style={{ width: '100%' }}>Login</CButton>
                    </Link>
                    <Link to="/Register" style={{ width: '100%' }}>
                        <CButton color='secondary' className='mb-3' style={{ width: '100%' }}>Register</CButton>
                    </Link>
                </CCol>
                <CCol xs={8}>
                    <CRow style={{ minHeight: '30%' }} className='p-3'>
                        {student && <WelcomeCard name={student.nombre} lastname={student.apellido}/>}
                    </CRow>
                    <CRow style={{ minHeight: '70%' }}>
                        <CCol xs={8} style={{minHeight: '100%'}}>
                            <CRow style={{minHeight: '50%'}} className='p-3'>
                                {student && <PerformanceCard e={student}/>}
                            </CRow>
                            <CRow style={{minHeight: '50%'}} className='p-3'>
                                {student && <TeacherCard e={student}/>}
                            </CRow>
                        </CCol>
                        <CCol xs={4}> 
                            <CRow style={{minHeight: '100%'}} className='p-3'>  
                                {student && <ClassCard e={student}/>}
                            </CRow>
                        </CCol>
                    </CRow>
                </CCol>
                <CCol xs={3}>
                    <CRow style={{minHeight: '100%'}} className='p-3'>
                        {student && <NotificationsCard e={student.notificaciones}/>}
                    </CRow>
                </CCol>
            </CRow>
        </CContainer>
    );

}

export default Dashboard;