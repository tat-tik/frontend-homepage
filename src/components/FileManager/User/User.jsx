import './User.css';
import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router';
import { useNavigate } from "react-router";
import FieldInput from "../FieldInputEditor/FieldInputEditor"
import fileSize from "../../CustomHooks/formatFileSize"
import moment from 'moment';
import 'moment/locale/ru';
import useRequest from "../../CustomHooks/useRequest";
import getCookie from "../../CustomHooks/getCookie";

function User() {
  const { isAdmin, user_id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [statusField, setStatusField] = useState({status_edit: false, field_edit: ''});
  const [statusBooleanField, setStatusBooleanField] = useState({is_superuser: '', is_staff: '', is_active: ''});
  const { id_user } = useParams();
  const { request } = useRequest();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Проверка прав доступа
  useEffect(() => {
    if (id_user && user_id && !isAdmin && user_id !== Number(id_user)) {
      navigate(`/panel/user/${user_id}`);
    }
  }, [id_user, user_id, isAdmin, navigate]);

  // Загрузка данных пользователя - ТОЛЬКО ОДИН РАЗ
  useEffect(() => {
    if (!id_user) {
      return;
    }

    // Флаг для отмены запроса при размонтировании
    let isMounted = true;

    const loadUserData = async () => {
      // Не загружаем, если уже загружено и это не первый раз
      if (user && !isInitialLoad) {
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Loading user data for id: ${id_user}`);
        
        const response = await request(
          'GET', 
          `/api/users/${id_user}/`,
          null,
          getCookie('csrftoken')
        );
        
        console.log('User data received:', response);
        
        if (isMounted) {
          if (response) {
            setUser(response);
            setIsInitialLoad(false);
          } else {
            setError('Пользователь не найден');
          }
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки пользователя:', err);
        if (isMounted) {
          setError(err.message || 'Ошибка загрузки данных');
          
          if (err.status === 404) {
            setTimeout(() => {
              navigate('/panel/users');
            }, 2000);
          } else if (err.status === 403) {
            setTimeout(() => {
              navigate('/panel');
            }, 2000);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [id_user]); // Убираем request из зависимостей

  // Обновление отображения булевых полей
  useEffect(() => {
    if (user) {
      setStatusBooleanField({
        is_superuser: user.is_superuser ? '✓' : '-',
        is_staff: user.is_staff ? '✓' : '-',
        is_active: user.is_active ? '✓' : '-',
      });
    }
  }, [user]);

  const changeBool = async (e) => {
    if (user?.id !== 1 && isAdmin) {
      const name = e.target.getAttribute('name');
      const newValue = !user[name];
      const oldValue = user[name];
      
      setUser({...user, [name]: newValue});
      
      try {
        const response = await request(
          'PATCH',
          `/api/users/${id_user}/`,
          { [name]: newValue },
          getCookie('csrftoken')
        );
        
        console.log('User update response:', response);
        
        if (!response || response['status update user'] !== true) {
          setUser({...user, [name]: oldValue});
          alert('Ошибка при обновлении статуса');
        }
      } catch (error) {
        console.error('❌ Ошибка обновления статуса:', error);
        setUser({...user, [name]: oldValue});
        alert('Ошибка при обновлении статуса');
      }
    }
  };

  const changeField = (e) => {
    const field_edit = e.target.getAttribute('name');
    if (field_edit !== 'email' || isAdmin) {
      setStatusField({...statusField, status_edit: true, field_edit});
    }
  };

  const saveUser = async () => {
    if (!statusField.field_edit) {
      setStatusField({status_edit: false, field_edit: ''});
      return;
    }
    
    const fieldName = statusField.field_edit;
    const newValue = user[fieldName];
    const oldValue = user[fieldName];
    
    try {
      const response = await request(
        'PATCH',
        `/api/users/${id_user}/`,
        { [fieldName]: newValue },
        getCookie('csrftoken')
      );
      
      console.log('Save response:', response);
      
      if (response && response['status update user'] === true) {
        alert('Изменения сохранены');
        setStatusField({status_edit: false, field_edit: ''});
      } else {
        setUser({...user, [fieldName]: oldValue});
        alert('Ошибка при сохранении');
      }
      
    } catch (error) {
      console.error('❌ Ошибка сохранения:', error);
      setUser({...user, [fieldName]: oldValue});
      alert(`Ошибка сохранения: ${error.message}`);
    }
  };

  if (!id_user) {
    return <div className="user">Загрузка...</div>;
  }

  if (isLoading) {
    return (
      <div className="user loading">
        <div className="loading-spinner">Загрузка пользователя...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user error">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/panel/users')}>
          Вернуться к списку пользователей
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="user">Пользователь не найден</div>;
  }

  return (
    <div className="user">
      <table className="table table-user">
        <tbody>
          <tr><th>id</th><td>{user.id}</td></tr>
          <tr><th>Логин</th><td>{user.username}</td></tr>
          <tr>
            <th>Имя</th>
            <td className='td-pointer' name="first_name" onClick={changeField}>
              {statusField.field_edit === "first_name" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : user.first_name}
            </td>
          </tr>
          <tr>
            <th>Фамилия</th>
            <td className='td-pointer' name="last_name" onClick={changeField}>
              {statusField.field_edit === "last_name" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : user.last_name || '-'}
            </td>
          </tr>
          <tr>
            <th>E-mail</th>
            <td className={isAdmin ? 'td-pointer' : ''} name="email" onClick={changeField}>
              {statusField.field_edit === "email" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : user.email}
            </td>
          </tr>
          <tr>
            <th>Пароль</th>
            <td className='td-pointer' name="password" onClick={changeField}>
              {statusField.field_edit === "password" && statusField.status_edit 
                ? <FieldInput statusField={statusField} setStatusField={setStatusField} object={user} setObject={setUser} />
                : 'Изменить'}
            </td>
          </tr>
          <tr>
            <th>Администратор</th>
            <td className={isAdmin && user.id !== 1 ? 'td-pointer' : ''} name="is_superuser" onClick={changeBool}>
              {statusBooleanField.is_superuser}
            </td>
          </tr>
          <tr>
            <th>Активный</th>
            <td className={isAdmin && user.id !== 1 ? 'td-pointer' : ''} name="is_active" onClick={changeBool}>
              {statusBooleanField.is_active}
            </td>
          </tr>
          <tr>
            <th>Последний вход</th>
            <td>
              {user.last_login 
                ? moment(user.last_login).format("YYYY-MM-DD HH:mm:ss") 
                : 'никогда'}
            </td>
          </tr>
          <tr>
            <th>Добавлен</th>
            <td>{moment(user.date_joined).format("YYYY-MM-DD HH:mm:ss")}</td>
          </tr>
          <tr>
            <th>Количество файлов</th>
            <td>{user.storage?.count_files || 0}</td>
          </tr>
          <tr>
            <th>Общий размер файлов</th>
            <td>{fileSize(Number(user.storage?.total_files_size || 0))}</td>
          </tr>
          <tr>
            <th>Дата обновления хранилища</th>
            <td>
              {user.storage?.last_update 
                ? moment(user.storage.last_update).format("YYYY-MM-DD HH:mm:ss") 
                : 'нет данных'}
            </td>
          </tr>
          <tr>
            <th>Ссылка на хранилище</th>
           <td>
            {user.storage?.id 
              ? <span className="span-pointer" onClick={() => {
                  navigate(`/panel/storage/${user.storage.id}`);
                }}>
                  Перейти в хранилище
                </span>
              : 'нет хранилища'}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="user-save">
        <input type='button' className="user-btn-save" value="Сохранить" onClick={saveUser} />
      </div>
    </div>
  );
}

export default User;