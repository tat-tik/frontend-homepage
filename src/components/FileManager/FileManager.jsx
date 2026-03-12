import './FileManager.css';
import { Routes, Route } from 'react-router-dom';
import FileStorage from './FileStorage/FileStorage';
import File from './FileStorage/File/File';
import User from './User/User';
import Admin from './Admin/Admin';
import ControlPanel from './ControlPanel/ControlPanel'; 


function FileManager() {

  return (
    <div className="file-manager">
    
      <div className="content">
        <Routes>
          <Route index element={<ControlPanel />} />

          <Route path="storage/:storage" element={<FileStorage />} />
          <Route path="storage/:storage/:file_id" element={<File />} />
         <Route  path="user/:id_user" element={<User key={window.location.pathname} />} 
/>
          <Route path="admin" element={<Admin />} />
        </Routes>
      </div>
    </div>
  );
}

export default FileManager;