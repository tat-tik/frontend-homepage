import './HomePage.css';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function HomePage( {url} ) {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn ?? false);
  return (
      <div className="homepage">
        <div  className="homepage-title">Облако MyCloud — личное пространство для ваших файлов</div>
        {isLoggedIn ?
        <input type='button' className="btn-to-panel" value="Панель управления" onClick={() => navigate("/panel")} />
        : '' }
        <p className='homepage-text'>Сохраняйте в Облаке ценные файлы: фото, видео и документы. Оно надёжно хранит их и делает доступными на любом вашем устройстве </p>
      </div>
  )
}

export default HomePage;