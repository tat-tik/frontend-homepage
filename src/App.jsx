import './App.css';
import { Routes, Route, Navigate} from 'react-router-dom';
import { useSelector } from "react-redux";
import HomePage from './components/HomePage/HomePage';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginLogoutButtons from './components/LoginLogoutButtons/LoginLogoutButtons';
import ProtectedRoute from './components/CustomHooks/ProtectedRoute';


import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faDownload, faEarth } from '@fortawesome/free-solid-svg-icons'

library.add(faEye, faEyeSlash, faDownload, faEarth);

function App() {
  const { isLoggedIn } = useSelector((state) => state.user)

  return (
    <div className="App">
      
        <div className="mainpage">
          <LoginLogoutButtons />
          <div className="content">
            <Routes>
              <Route 
                path="/" 
                element={<HomePage />} 
              />
                            
              <Route
                path="/login"
                element={
                  <ProtectedRoute 
                    isAllowed={!isLoggedIn} 
                    redirectPath="/panel"
                  >
                    <LoginForm />
                  </ProtectedRoute>
                }
              />
                            
              <Route
                path="/reg"
                element={
                  <ProtectedRoute 
                    isAllowed={!isLoggedIn} 
                    redirectPath="/panel"
                  >
                    <RegistrationForm />
                  </ProtectedRoute>
                }
              />
                            
              <Route
                path="/panel/*"
                element={
                  <ProtectedRoute 
                    isAllowed={isLoggedIn}
                    redirectPath="/login"
                  >
                  </ProtectedRoute>
                }
              />
                            
              <Route
              path="/panel/*"
              element={
              <ProtectedRoute 
              isAllowed={isLoggedIn}
              redirectPath="/login"
              />
              }
               />
               
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
              
            </Routes>
          </div>
        </div>
    </div>
  )
}

export default App;