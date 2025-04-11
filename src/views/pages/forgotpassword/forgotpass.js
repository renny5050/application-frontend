import React from 'react';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormInput,
    CButton,
    CRow,
    CCol,
} from '@coreui/react';


const Forgotpass = () => {
    return (
        <>
            <CRow className="justify-content-center align-items-center min-vh-100">
                <CCol md={4}>
                    <CCard>
                        <CCardHeader>
                            <h4>Forgot Your Password?</h4>
                        </CCardHeader>
                        <CCardBody>
                            <CForm>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Enter your email address
                                    </label>
                                    <CFormInput
                                        type="email"
                                        id="email"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                                <CButton type="submit" color="primary">
                                    Reset Password
                                </CButton>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    );
}

export default Forgotpass;
