import React, { useState, useEffect } from 'react';
import { CCard, CCardHeader, CCardBody, CBadge } from '@coreui/react';



const Users = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = [
                { id: 1, role: 'Admin', username: 'admin1', firstName: 'John', lastName: 'Doe', idCard: '12345678', email: 'john.doe@example.com', status: 'Active' },
                { id: 2, role: 'User', username: 'user1', firstName: 'Jane', lastName: 'Smith', idCard: '87654321', email: 'jane.smith@example.com', status: 'Inactive' },
            ];
            setUsers(data);
        };
        fetchData();
    }, []);

    const getBadge = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'secondary';
            default: return 'primary';
        }
    };

    return (
        <CCard>
            <CCardHeader>
                User List
            </CCardHeader>
            <CCardBody>
                <table className="table table-hover table-striped table-bordered table-sm">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>ID Card</th>
                            <th>Email</th>
                            <th>Status</th>
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
                                <td>{user.email}</td>
                                <td>
                                    <CBadge color={getBadge(user.status)}>
                                        {user.status}
                                    </CBadge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CCardBody>
        </CCard>
    );
};

export default Users;