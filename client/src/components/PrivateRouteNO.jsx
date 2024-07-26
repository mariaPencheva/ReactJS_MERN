// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import axios from 'axios';

// import { UserContext } from '../UserContext';

// const PrivateRoute = ({ children }) => {
//     const { loggedinUser, loading } = useContext(UserContext);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return loggedinUser ? children : <Navigate to="/signin" />;
// };

// export default PrivateRoute;
//====
// const PrivateRoute = ({ children }) => {
//     const [loggedinUser, setLoggedinUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (token) {
//                     const response = await axios.get('/api/auth/profile', {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     });
//                     setLoggedinUser(response.data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching user profile:', error);
//                 localStorage.removeItem('token');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUser();
//     }, []);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return loggedinUser ? children : <Navigate to="/signin" />;
// };

// export default PrivateRoute;
//====

// const PrivateRoute = ({ children, loggedinUser }) => {
//     if (!loggedinUser) {
//         return <Navigate to="/signin" />;
//     }

//     return children;
// };

// export default PrivateRoute;

// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const PrivateRoute = ({ children }) => {
//   const user = useSelector((state) => state.user);

//   return user.token ? children : <Navigate to="/signin" />;
// };

// export default PrivateRoute;

// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const PrivateRoute = ({ children }) => {
//   const user = useSelector((state) => state.user);

//   return user.token ? children : <Navigate to="/signin" />;
// };

// export default PrivateRoute;
