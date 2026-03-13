import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux"; 
import HomePage from './components/HomePage/HomePage';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import ProtectedRoute from './components/CustomHooks/ProtectedRoute';
import FileManager from './components/FileManager/FileManager'; 
import LoginLogoutButtons from './components/LoginLogoutButtons/LoginLogoutButtons';
import Admin from './components/FileManager/Admin/Admin';

function App() {
  const { isLoggedIn, isAdmin } = useSelector((state) => state.user);

  return (
    <div className="App">
      <div className="mainpage">
        <LoginLogoutButtons />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
                        
            <Route path="/login" element={
              <ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/panel">
                <LoginForm />
              </ProtectedRoute>
            } />
            
            <Route path="/reg" element={
              <ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/panel">
                <RegistrationForm />
              </ProtectedRoute>
            } />
            
            <Route path="/panel/*" element={
              <ProtectedRoute isAllowed={isLoggedIn} redirectPath="/login">
                <FileManager /> 
              </ProtectedRoute>
            } />
            
            <Route path="/panel/users" element={
              <ProtectedRoute isAllowed={isLoggedIn && isAdmin} redirectPath="/panel">
                <Admin />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;