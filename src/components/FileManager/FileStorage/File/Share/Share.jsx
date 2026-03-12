import './Share.css';
import { useParams } from "react-router";
import useRequest from "../../../../CustomHooks/useRequest"
import getCookie from "../../../../CustomHooks/getCookie";

function Share({ file, setFile }) {
  const { storage } = useParams();
  const { request }= useRequest();

  const shareFile = async() => {
    if (file.public_url === null) {
      // Создаем публичную ссылку
      const result = await request(
        'GET', 
        `/api/files/${file.id}/share/`,
        null,
        getCookie('csrftoken')
      );
      
      if (result && result.token) {
        setFile({...file, public_url: result.token});
      }
    } else {
      // Отзываем публичную ссылку
      const result = await request(
        'PATCH',
        `/api/storages/${storage}/files/${file.id}/update/`,
        { public_url: null },
        getCookie('csrftoken')
      );
      
      if (result && result.status === true) {
        setFile({...file, public_url: null});
      }
    }
  };

  return (
    <div className='file-share'>
      <div className='file-share-manage'>
        <input 
          type='button' 
          className="btn-share" 
          value={file.public_url === null ? "Разрешить публичный доступ" : "Запретить публичный доступ"} 
          onClick={shareFile} 
        />
        
        {file.public_url && (
          <div className='share-public-url'>
            <span className='share-public-url-text'>
              {import.meta.env.VITE_SERVER_HOST + `/api/files/public/${file.public_url}/`}
            </span>
            <span 
              className='share-public-url-copy' 
              title="Copy to Clipboard" 
              onClick={() => {
                navigator.clipboard.writeText(
                  import.meta.env.VITE_SERVER_HOST + `/api/files/public/${file.public_url}/`
                );
              }}
            >
              📋
            </span>
          </div>      
        )}
      </div>        
    </div>
  )
}

export default Share;