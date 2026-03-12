import './FilesUpload.css';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import useUploadFiles from "../../../CustomHooks/useUploadFiles"
import useRequest from "../../../CustomHooks/useRequest"
import fileSize from "../../../CustomHooks/formatFileSize"
import ProgressBar from "./ProgressBar/ProgressBar"
import FieldInputEditor from "../../FieldInputEditor/FieldInputEditor"; 

function FilesUpload({ files, setFiles }) {
  const input = useRef(null)
  const { csrftoken } = useSelector((state) => state.user);
  const { uploadFiles }= useUploadFiles();
  const { storage } = useParams();
  const { request }= useRequest();
  const [ statusField, setStatusField ]=useState({status_edit: false, field_edit: ''});
  const [ comments, setComments ]=useState({});
  const [load, setLoad] = useState(false)
  const [dataTransfer, setDataTransfer] = useState(new DataTransfer())
  const [progress, setProgress] = useState(0)

  const cloneDataTransfer = () => {
    let data = new DataTransfer()
    for (let i = 0; i < dataTransfer.files.length; i++) {
      let file = dataTransfer.files[i]
      data.items.add(file)
    }
    return data
  }

  const cleanUploadData = () => {
    setDataTransfer(new DataTransfer())
    setLoad(false)
    setProgress(0)
    setComments({});
    if (input.current) {
      input.current.value = '';
    }
  }

  useEffect(() => {
    if(load === 1) {
      cleanUploadData()
    }
  },[files])

  const handleFileClick = (e) => {
    if(load) {
      cleanUploadData()
    }
    input.current.dispatchEvent(new MouseEvent('click'));
  }

  const handleChangeFile = (e) => {
    setDataTransfer(() => {
      let data = cloneDataTransfer()
      for (let i = 0; i < e.target.files.length; i++) {
        let same = false
        let file = e.target.files[i]
        Array.from(dataTransfer.files).map((f) => {
          if(file.size === f.size && file.name === f.name && file.type === f.type) {
            same = true
            return
          }
        })
        if(!same){
          data.items.add(file)
        }
      }
      return data;
    })
  }

  const fileDelete = (i, fileName, fileSize) => {
    setDataTransfer(() => {
      let data = cloneDataTransfer()
      data.items.remove(i)
      return data
    })
    setComments(() => {
      let comm = {...comments}
      delete comm[`comment_${fileName}_${fileSize}`]
      return comm
    })
  }

const updateProgress = (event) => {
  if (event.lengthComputable) {
    const percent = Math.round((event.loaded / event.total) * 100);
    setProgress(percent); // Теперь передаем число, а не объект
    console.log('Progress:', percent); // Для отладки
  }
};


  const loadFiles = async() => {
    if(dataTransfer.files.length > 0) {
      try {
        setLoad(true)
        setProgress(0)
        
        console.log('Uploading files to storage:', storage);
        
        // Загружаем файлы
        const uploadResult = await uploadFiles(
          dataTransfer.files, 
          comments, 
          storage, 
          csrftoken, 
          updateProgress
        );
        
        console.log('Upload result:', uploadResult);
        
        // После успешной загрузки получаем обновленный список файлов
        // ИСПРАВЛЕННЫЙ URL: /api/storages/${storage}/files/
        const response = await request(
          'GET', 
          `/api/storages/${storage}/files/`,
          null, 
          csrftoken
        );
        
        console.log('Updated files:', response);
        
        if (response && response.files) {
          setFiles(response.files);
        }
        
        setLoad(1);
        setTimeout(() => cleanUploadData(), 700);
        
      } catch (error) {
        console.error('Upload error:', error);
        setLoad(false);
        setProgress(0);
        alert('Ошибка при загрузке файлов');
      }
    }
  }

  const changeField = (e) => {
    setStatusField({...statusField, status_edit: true, field_edit: e.target.getAttribute('name')})
  }

  return (
    <div className="files-upload">
      <div className="file-container" onClick={handleFileClick}>
        <input className="overlapped" type="file" multiple ref={input} onChange={handleChangeFile} disabled={load} />
        <span className="overlap">Добавить файлы</span>
      </div>
      
      {dataTransfer.files.length > 0 ? (
        <>
          <div className="files-add-text">Файлы для добавления:</div>
          <div className="files-center-blocks">
            <table className="table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Имя файла</th>
                  <th>Размер</th>
                  <th>Комментарий</th>
                  {!load && <th>Действия</th>}
                </tr>
              </thead>
              <tbody>
                {Array.from(dataTransfer.files).map((file, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{file.name}</td>
                    <td>{fileSize(Number(file.size))}</td>
                    <td 
                      className='td-pointer' 
                      name={`comment_${file.name}_${file.size}`} 
                      onClick={!load ? changeField : undefined}
                    >
                      {statusField.field_edit === `comment_${file.name}_${file.size}` && 
                       statusField.status_edit && 
                       !load ? 
                        <FieldInputEditor 
                          statusField={statusField} 
                          setStatusField={setStatusField} 
                          object={comments} 
                          setObject={setComments} 
                        /> 
                        : comments[`comment_${file.name}_${file.size}`] || ''}
                    </td> 
                    {!load && (
                      <td className="file-load-td-pointer">
                        <span className="file-delete" onClick={() => fileDelete(i, file.name, file.size)}>
                          &#10060;
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="files-save">
              {!load ? (
                <input 
                  type='button' 
                  className="files-btn-upload" 
                  value="Добавить" 
                  onClick={loadFiles} 
                />
              ) : (
                <ProgressBar progress={progress} />
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default FilesUpload;