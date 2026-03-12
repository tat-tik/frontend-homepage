import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux"; // РАСКОММЕНТИРУЙТЕ
import HomePage from './components/HomePage/HomePage';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import ProtectedRoute from './components/CustomHooks/ProtectedRoute';
import FileManager from './components/FileManager/FileManager'; 
import LoginLogoutButtons from './components/LoginLogoutButtons/LoginLogoutButtons';
import Admin from './components/FileManager/Admin/Admin';

function App() {
  // РАСКОММЕНТИРУЙТЕ эти строки
  const { isLoggedIn, isAdmin } = useSelector((state) => state.user);
  
  // УДАЛИТЕ эти строки
  // const isLoggedIn = true;
  // const isAdmin = true;

  console.log('App: isLoggedIn =', isLoggedIn, 'isAdmin =', isAdmin); // Для отладки

  return (
    <div className="App">
      <div className="mainpage">
        <LoginLogoutButtons />
        
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Логин доступен только НЕавторизованным */}
            <Route path="/login" element={
              <ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/panel">
                <LoginForm />
              </ProtectedRoute>
            } />
            
            {/* Регистрация доступна только НЕавторизованным */}
            <Route path="/reg" element={
              <ProtectedRoute isAllowed={!isLoggedIn} redirectPath="/panel">
                <RegistrationForm />
              </ProtectedRoute>
            } />
            
            {/* Панель доступна только авторизованным */}
            <Route path="/panel/*" element={
              <ProtectedRoute isAllowed={isLoggedIn} redirectPath="/login">
                <FileManager /> 
              </ProtectedRoute>
            } />
            
            {/* Админка доступна только авторизованным админам */}
            <Route path="/admin" element={
              <ProtectedRoute isAllowed={isLoggedIn && isAdmin} redirectPath="/panel">
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* Все остальные пути ведут на главную */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;