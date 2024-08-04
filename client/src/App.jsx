import React from 'react';
import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { currProfile } from './redux/authSlice';
import Header from './components/Header';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/404';
import Catalog from './pages/Catalog';
import Footer from './components/Footer';
import TaskDetails from './pages/TaskDetails'
import PrivateRoute from './components/PrivateRoute';
import Notification from './components/Notification';

import './index.scss';

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const [notification, setNotification] = useState(null);

  const handleNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); 
  };


  React.useEffect(() => {
    if (token) {
      dispatch(currProfile());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Header />
            <Notification message={notification?.message} type={notification?.type} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup  onNotify={handleNotification} />} />
        <Route path="/signin" element={<Signin onNotify={handleNotification} />} />
        
        <Route path="/" element={<PrivateRoute />}>
          <Route path="profile" element={<ProfilePage onNotify={handleNotification} />} />
        </Route>

        <Route path="/catalog" element={<Catalog />} />
        <Route path="/tasks/:id" element={<TaskDetails onNotify={handleNotification} />} /> 

        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;