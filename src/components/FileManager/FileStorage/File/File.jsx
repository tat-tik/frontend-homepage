import './File.css';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSelector } from "react-redux";
import FieldInputEditor from "../../FieldInputEditor/FieldInputEditor";
import fileSize from "../../../CustomHooks/formatFileSize";
import Share from "./Share/Share";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import 'moment/locale/ru';
import useRequest from "../../../CustomHooks/useRequest";
import getCookie from "../../../CustomHooks/getCookie";

function File() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { storage, file_id } = useParams();
  const [statusField, setStatusField] = useState({status_edit: false, field_edit: ''});
  const { request } = useRequest();
  const navigate = useNavigate();
  
  const hasFetched = useRef(false);
  const { storage_id, isAdmin } = useSelector((state) => state.user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!storage || !file_id) return;
    if (hasFetched.current) return;

    let isMounted = true;

    const fetchFileData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching file details for storage: ${storage}, file: ${file_id}`);
        
        const response = await request(
          'GET', 
          `/api/storages/${storage}/files/${file_id}/`,
          null,
          getCookie('csrftoken')
        );
        
        console.log('File data received:', response);
        
        if (isMounted && response?.file) {
          setFile(response.file);
          hasFetched.current = true;
        }
        
      } catch (err) {
        console.error('❌ Ошибка загрузки файла:', err);
        if (isMounted) {
          setError(err.data?.error || err.message || 'Ошибка загрузки файла');
          if (err.status === 404) {
            setTimeout(() => navigate(`/panel/storage/${storage}`), 2000);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFileData();
    return () => { isMounted = false; };
  }, [storage, file_id, request, navigate]);

  const changeField = (e) => {
    const fieldName = e.target.getAttribute('name');
    console.log('Changing field:', fieldName);
    setStatusField({status_edit: true, field_edit: fieldName});
  };

  const updateFileField = (updatedObject) => {
    console.log('Updating file with:', updatedObject);
    setFile(updatedObject);
  };

 const saveFile = async (e) => {
  e.preventDefault();  // Добавьте эту строку - предотвращает отправку формы
  e.stopPropagation(); // Добавьте эту строку - останавливает всплытие события
  
  console.log('Save clicked, statusField:', statusField);
  console.log('Current file:', file);
  
  if (!file) return;
  
  // Определяем, какое поле сейчас редактируется
  const fieldToSave = statusField.field_edit;
  
  if (!fieldToSave) {
    console.log('No active field to save');
    return;
  }
  
  let serverFieldName;
  let valueToSave;
  
  if (fieldToSave.includes('file_name')) {
    serverFieldName = 'file_name';
    valueToSave = file.file_name;
  } else if (fieldToSave.includes('comment')) {
    serverFieldName = 'comment';
    valueToSave = file.comment;
  } else {
    serverFieldName = fieldToSave;
    valueToSave = file[fieldToSave];
  }
  
  console.log('Saving to server:', { field: serverFieldName, value: valueToSave });
  
  try {
    const response = await request(
      'PATCH',
      `/api/storages/${storage}/files/${file_id}/update/`,
      { [serverFieldName]: valueToSave },
      getCookie('csrftoken')
    );
    
    console.log('Save response:', response);
    
    if (response?.status === true) {
      alert('Изменения сохранены');
      
      // Закрываем редактор после успешного сохранения
      setStatusField({status_edit: false, field_edit: ''});
      
      // Обновляем данные файла с сервера
      const updatedResponse = await request(
        'GET', 
        `/api/storages/${storage}/files/${file_id}/`,
        null,
        getCookie('csrftoken')
      );
      
      if (updatedResponse?.file) {
        console.log('Updated file data:', updatedResponse.file);
        setFile(updatedResponse.file);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error);
    alert(`Ошибка сохранения: ${error.message}`);
  }
};

const handleDownload = (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('Downloading file:', file_id);
  
  // Используем переменную окружения с портом бэкенда
  const baseUrl = import.meta.env.VITE_SERVER_HOST || 'http://localhost:8000';
  window.open(`${baseUrl}/api/files/${file_id}/download/`, '_blank');
};

const goBack = () => {
  navigate(`/panel/storage/${storage}`, { replace: true });
};

  if (loading) 
    return 
    <div className="file loading">Загрузка файла...</div>;
  if (error) {
    return (
    <div className="file error">
      <h3>Ошибка</h3>
      <p>{error}</p>
      <button onClick={goBack}>Вернуться к хранилищу</button>
    </div>
    );
  }
  if (!file) 
    return 
    <div className="file">Файл не найден</div>;

  return (
    <div className='file'>
      <div style={{marginTop: '100px'}}>
        <div className="file-header">
          <button onClick={goBack} className="btn-back">← Назад к хранилищу</button>
        </div>
        
        <div className="file-information">
          <table className="table table-file">
            <tbody>
              <tr>
                <th>Имя файла</th>
                <td className='td-pointer' name="file_name" onClick={changeField}>
                  {statusField.field_edit === "file_name" && statusField.status_edit ? (
                    <FieldInputEditor 
                      statusField={statusField} 
                      setStatusField={setStatusField} 
                      object={file} 
                      setObject={updateFileField} 
                    />
                  ) : (
                    decodeURIComponent(file.file_name)
                  )}
                </td>
              </tr>
              <tr>
                <th>Размер</th>
                <td>{fileSize(Number(file.file_size || file.size))}</td>
              </tr>        
              <tr>
                <th>Комментарий</th>
                <td className='td-pointer' name="comment" onClick={changeField}>
                  {statusField.field_edit === "comment" && statusField.status_edit ? (
                    <FieldInputEditor 
                      statusField={statusField} 
                      setStatusField={setStatusField} 
                      object={file} 
                      setObject={updateFileField} 
                    />
                  ) : (
                    file.comment || '-'
                  )}
                </td>
              </tr>
              <tr>
                <th>Дата загрузки</th>
                <td>{moment(file.date_load).format("YYYY-MM-DD HH:mm:ss")}</td>
              </tr>   
              <tr>
                <th>Последнее скачивание</th>
                <td>
                  {file.date_download 
                    ? moment(file.date_download).format("YYYY-MM-DD HH:mm:ss") 
                    : 'никогда'}
                </td>
              </tr>   
              <tr>
                <th>Публичный доступ</th>
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
              </tr>   
            </tbody>
          </table>
          
          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <input 
              type='button' 
              className="file-btn-save" 
              value="СОХРАНИТЬ" 
              onClick={saveFile} 
            />
            <input 
              type='button' 
              className="file-btn-download" 
              value="Скачать" 
              onClick={(e) => handleDownload(e)} 
            />
          </div>
        </div> 
        <Share file={file} setFile={setFile} />
      </div>
    </div>
  );
}


export default File;