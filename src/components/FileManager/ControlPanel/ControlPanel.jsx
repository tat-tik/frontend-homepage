// ControlPanel.jsx
import './ControlPanel.css';
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";
import useRequest from "../../CustomHooks/useRequest";
import useDispatching from "../../CustomHooks/useDispatching";
import getCookie from "../../CustomHooks/getCookie";

function ControlPanel() {
  const isAdmin = useSelector((state) => state?.user?.isAdmin ?? false);
  const user_id = useSelector((state) => state?.user?.user_id ?? '');
  const storage_id = useSelector((state) => state?.user?.storage_id ?? '');
  const { request } = useRequest();
  const { dispatching } = useDispatching();
  const navigate = useNavigate();

  const logout = async() => {
    try {
      const result = await request(
        'GET', 
        '/api/users/logout/', 
        null, 
        getCookie('csrftoken')
      );
      
      if (result) {
        dispatching(false, false, null, null, null);
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  return ( 
    <div className="sidebar">
      <nav>
        <ul className="sidebar-ul">
          {isAdmin ? 
            <NavLink 
              to="/panel/users" 
              className={({ isActive }) => (isActive ? 'li-nav li-nav-active' : 'li-nav')}
            >
              <li>Пользователи</li>
            </NavLink>
          : ''}
          
          <NavLink 
            to={`/panel/user/${user_id}`} 
            className={({ isActive }) => (isActive ? 'li-nav li-nav-active' : 'li-nav')}
          >
            <li>Профиль</li>
          </NavLink>
          
          <NavLink 
            to={`/panel/storage/${storage_id}`} 
            className={({ isActive }) => (isActive ? 'li-nav li-nav-active' : 'li-nav')}
          >
            <li>Хранилище</li>
          </NavLink>
          
          <li onClick={logout} style={{ cursor: 'pointer' }}>Выйти</li>
        </ul>
      </nav>
    </div>
  )
}

export default ControlPanel;