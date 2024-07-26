// import React, { createContext, useState, useEffect } from 'react';
// import api from './api';
// import { useNavigate } from 'react-router-dom';

// const UserContext = createContext();

// const UserProvider = ({ children }) => {
//     const [loggedinUser, setLoggedinUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const userData = await api.getUserProfile();
//                 setLoggedinUser(userData);
//             } catch (error) {
//                 setLoggedinUser(null);
//                 console.error('Error fetching user data:', error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUserData();
//     }, []);

//     const logout = () => {
//         localStorage.removeItem('token');
//         setLoggedinUser(null);
//         navigate('/'); 
//     };

//     return (
//         <UserContext.Provider value={{ loggedinUser, loading, logout }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export { UserProvider, UserContext };
