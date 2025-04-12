import React, { useState, useEffect } from 'react';
import { CContainer, CHeader, CBadge, CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = [
                { id: 1, role: 'Admin', username: 'admin1', firstName: 'John', lastName: 'Doe', 
                  idCard: '12345678', email: 'john.doe@example.com', status: 'Active', 
                  registrationDate: '2022-01-15', lastLogin: '2023-08-01' },
                { id: 2, role: 'User', username: 'user1', firstName: 'Jane', lastName: 'Smith', 
                  idCard: '87654321', email: 'jane.smith@example.com', status: 'Inactive', 
                  registrationDate: '2022-03-22', lastLogin: '2023-07-15' },
                { id: 3, role: 'Moderator', username: 'mod1', firstName: 'Bob', lastName: 'Johnson', 
                  idCard: '11223344', email: 'bob.johnson@example.com', status: 'Active', 
                  registrationDate: '2023-01-10', lastLogin: '2023-08-05' },
                { id: 4, role: 'Guest', username: 'guest1', firstName: 'Alice', lastName: 'Williams', 
                  idCard: '44332211', email: 'alice.williams@example.com', status: 'Pending', 
                  registrationDate: '2023-05-01', lastLogin: '2023-08-02' },
            ];
            setUsers(data);
        };
        fetchData();
    }, []);

    const getBadge = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'secondary';
            case 'Pending': return 'warning';
            default: return 'primary';
        }
    };

    const showDetails = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <CHeader className="bg-body w-100 px-4" style={{ borderBottom: '1px solid #d8dbe0' }}>
                <h4 className="my-2">Users Management</h4>
            </CHeader>

            <CContainer className="flex-grow-1 py-4">
                <div style={{ width: '90%', margin: '20px auto' }}>
                    <table className="table table-hover table-striped table-bordered table-sm">
                        <thead>
                            <tr>
                                <th>Role</th>
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>ID Card</th>
                                <th>Status</th>
                                <th style={{ width: '120px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.role}</td>
                                    <td>{user.username}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.idCard}</td>
                                    <td>
                                        <CBadge color={getBadge(user.status)}>
                                            {user.status}
                                        </CBadge>
                                    </td>
                                    <td className="text-center">
                                        <CButton 
                                            color="info" 
                                            size="sm"
                                            onClick={() => showDetails(user)}
                                        >
                                            Details
                                        </CButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CContainer>

            {/* Modal de detalles */}
            <CModal 
                visible={modalVisible} 
                onClose={() => setModalVisible(false)}
                size="lg"
            >
                <CModalHeader onClose={() => setModalVisible(false)}>
                    <CModalTitle>User Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedUser && (
                        <div className="row">
                            <div className="col-md-6">
                                <dl>
                                    <dt>Username:</dt>
                                    <dd>{selectedUser.username}</dd>
                                    
                                    <dt>Full Name:</dt>
                                    <dd>{selectedUser.firstName} {selectedUser.lastName}</dd>
                                    
                                    <dt>ID Card:</dt>
                                    <dd>{selectedUser.idCard}</dd>
                                </dl>
                            </div>
                            <div className="col-md-6">
                                <dl>
                                    <dt>Email:</dt>
                                    <dd>{selectedUser.email}</dd>
                                    
                                    <dt>Registration Date:</dt>
                                    <dd>{selectedUser.registrationDate}</dd>
                                    
                                    <dt>Last Login:</dt>
                                    <dd>{selectedUser.lastLogin}</dd>
                                </dl>
                            </div>
                            <div className="col-12">
                                <dt>Status:</dt>
                                <dd>
                                    <CBadge color={getBadge(selectedUser.status)}>
                                        {selectedUser.status}
                                    </CBadge>
                                </dd>
                            </div>
                        </div>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton 
                        color="secondary" 
                        onClick={() => setModalVisible(false)}
                    >
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Users;