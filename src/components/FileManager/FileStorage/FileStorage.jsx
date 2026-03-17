import './FileStorage.css';
import { useState, useEffect, useRef } from 'react'; 
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import fileSize from "../../CustomHooks/formatFileSize";
import FilesUpload from "./FilesUpload/FilesUpload";
import FieldInputEditor from "../FieldInputEditor/FieldInputEditor";
import moment from 'moment';
import 'moment/locale/ru';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faEarth } from '@fortawesome/free-solid-svg-icons';
import useRequest from "../../CustomHooks/useRequest";
import getCookie from "../../CustomHooks/getCookie";
library.add(faDownload, faEarth);

function FileStorage() {
  const { isAdmin, storage_id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { storage } = useParams();
  const [statusField, setStatusField] = useState({status_edit: false, field_edit: ''});
  const [files, setFiles] = useState(null);
  const [user, setUser] = useState(null);
  const { request } = useRequest();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (storage && storage_id && !isAdmin && storage_id !== Number(storage)) {
      navigate(`/panel/storage/${storage_id}`);
    }
  }, [storage, storage_id, isAdmin, navigate]);

  useEffect(() => {
    if (!storage) {
      return;
    }

    if (hasFetched.current) {
      return;
    }

    let isMounted = true;

    const loadStorageData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await request(
          'GET', 
          `/api/storages/${storage}/files/`,
          null,
          getCookie('csrftoken')
        );
        
        if (isMounted) {
          if (response) {
            setFiles(response.files || []);
            setUser(response.user || null);
            hasFetched.current = true;
          } else {
            setFiles([]);
            setError('Хранилище не найдено');
          }
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки хранилища:', err);
        if (isMounted) {
          setError(err.message || 'Ошибка загрузки данных');
          setFiles([]);
          
          if (err.status === 404 || err.status === 403) {
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
    
    loadStorageData();
    
    return () => {
      isMounted = false;
    };
  }, [storage]); 

  const refreshData = async () => {
    hasFetched.current = false; 
    setIsLoading(true);
    
    try {
      const response = await request(
        'GET', 
        `/api/storages/${storage}/files/`,
        null,
        getCookie('csrftoken')
      );
      
      if (response) {
        setFiles(response.files || []);
        setUser(response.user || null);
        hasFetched.current = true;
      }
    } catch (err) {
      console.error('❌ Ошибка обновления:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fileEdit = (file_id) => {
    navigate(`/panel/storage/${storage}/${file_id}`);
  };

  const fileDownload = async (e, file_id) => {
  e.preventDefault();
  e.stopPropagation();
  
    try {

      const baseUrl = import.meta.env.VITE_SERVER_HOST;
      const fileToDownload = files.find(f => f.id === file_id);
      const fileName = fileToDownload ? decodeURIComponent(fileToDownload.file_name) : `file_${file_id}`;
      const response = await fetch(`${baseUrl}/api/files/${file_id}/download/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCookie('csrftoken')
        }
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    
      setTimeout(() => {
        refreshData();
      }, 1000);
    
    } catch (error) {
      console.error('❌ Ошибка скачивания:', error);
      alert('Ошибка при скачивании файла');
    }
  };

  const fileDelete = async (file_id) => {
  if (!window.confirm('Вы уверены, что хотите удалить этот файл?')) {
    return;
  }
  
  try {
    const response = await request(
      'DELETE',
      `/api/storages/${storage}/files/${file_id}/delete/`, 
      null,
      getCookie('csrftoken')
    );
    
    if (response && response.status === true) {
      setFiles(prevFiles => prevFiles.filter(f => f.id !== file_id));
      alert('Файл успешно удалён');

      const updatedResponse = await request(
        'GET', 
        `/api/storages/${storage}/files/`,
        null,
        getCookie('csrftoken')
      );
      
      if (updatedResponse && updatedResponse.files) {
        setFiles(updatedResponse.files);
      }
    } else {
      alert('Ошибка при удалении файла');
    }
    
  } catch (error) {
    console.error('❌ Ошибка удаления:', error);
    
    if (error.status === 404) {
      alert('Файл не найден на сервере. Возможно, он уже был удален.');

      const updatedResponse = await request(
        'GET', 
        `/api/storages/${storage}/files/`,
        null,
        getCookie('csrftoken')
      );
      
      if (updatedResponse && updatedResponse.files) {
        setFiles(updatedResponse.files);
      }
    } else {
      alert(`Ошибка при удалении файла: ${error.message}`);
    }
  }
};

  const changeField = (e) => {
    const fieldName = e.currentTarget.getAttribute('name');
    setStatusField({status_edit: true, field_edit: fieldName});
  };

  const updateFile = async (updatedFile) => {
    try {
      const fieldName = statusField.field_edit.includes('file_name_') ? 'file_name' : 'comment';
      const newValue = updatedFile[fieldName];
      
      const response = await request(
        'PATCH',
        `/api/storages/${storage}/files/${updatedFile.id}/update/`,
        { [fieldName]: newValue },
        getCookie('csrftoken')
      );
      
      if (response && response.status === true) {
        setFiles(prevFiles => 
          prevFiles.map(f => f.id === updatedFile.id ? updatedFile : f)
        );
        setStatusField({status_edit: false, field_edit: ''});
      }
      
    } catch (error) {
      console.error('❌ Ошибка обновления:', error);
      alert(`Ошибка при обновлении: ${error.message}`);
    }
  };

  if (!storage) {
    return <div className="storage">Загрузка...</div>;
  }

  if (isLoading) {
    return (
      <div className="storage loading">
        <div className="loading-spinner">Загрузка хранилища...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="storage error">
        <h3>Ошибка</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/panel')}>
          Вернуться в панель управления
        </button>
      </div>
    );
  }

  if (files === null) {
    return <div className="storage">Загрузка хранилища...</div>;
  }
  
  return (
    <div className='storage'>
      <div className="storage-header">
        <div className={`storage-title${storage_id === Number(storage) ? '' : ' other'}`}>
          {storage_id === Number(storage) 
            ? 'Моё хранилище' 
            : user 
              ? `Хранилище пользователя ${user.username} (ID: ${user.id})` 
              : 'Хранилище'}
        </div>
        <button className="btn-refresh" onClick={refreshData} title="Обновить">
          🔄
        </button>
      </div>
      
      {files.length > 0 ? (
        <table className="table table-files">
          <thead>
            <tr>
              <th>№</th>
              <th>Имя файла</th>
              <th>Размер</th>
              <th>Комментарий</th>
              <th>Дата загрузки</th>
              <th>Дата последнего скачивания</th>
              <th>Ссылка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, i) => (
              <tr key={file.id || i}>
                <td>{i+1}</td>
                
                <td 
                  className="td-pointer" 
                  name={`file_name_${file.id}`}
                  onClick={changeField}
                >
                  {statusField.status_edit && statusField.field_edit === `file_name_${file.id}` ? (
                    <FieldInputEditor 
                      statusField={statusField}
                      setStatusField={setStatusField}
                      object={file}
                      setObject={updateFile}
                    />
                  ) : (
                    decodeURIComponent(file.file_name)
                  )}
                </td>
                
                <td>{fileSize(Number(file.file_size || file.size))}</td>
                               
                <td 
                  className="td-pointer" 
                  name={`comment_${file.id}`}
                  onClick={changeField}
                >
                  {statusField.status_edit && statusField.field_edit === `comment_${file.id}` ? (
                    <FieldInputEditor 
                      statusField={statusField}
                      setStatusField={setStatusField}
                      object={file}
                      setObject={updateFile}
                    />
                  ) : (
                    file.comment || '-'
                  )}
                </td>
                
                <td>{moment(file.date_load).format("YYYY-MM-DD HH:mm:ss")}</td>
                <td>
                  {file.date_download === null 
                  ? '-' 
                  : moment(file.date_download).format("YYYY-MM-DD HH:mm:ss")
                  }
                </td>

                <td>
                {file.public_url === null 
                  ? '-' 
                  : <FontAwesomeIcon 
                  icon="earth" 
                  style={{cursor: 'pointer'}} 
                  onClick={() => {
                  const publicUrl = `${import.meta.env.VITE_SERVER_HOST}/api/files/public/${file.public_url}/`;
                  window.open(publicUrl, '_blank');
                  }} 
                  />
                }
              </td>
                <td>
                  <span className="icon-edit" onClick={() => fileEdit(file.id)} title="Редактировать">{'\u{270f}'}</span>&nbsp;
                  <span className="icon-download"  onClick={(e) => fileDownload(e, file.id)}  title="Скачать">
                    <FontAwesomeIcon icon="download" />
                  </span>&nbsp;
                  <span className="icon-delete" onClick={() => fileDelete(file.id)} title="Удалить">&#10060;</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="storage-empty">В хранилище нет файлов</div>
      )}
      
      <FilesUpload files={files} setFiles={setFiles} />
    </div>
  );
}

export default FileStorage;