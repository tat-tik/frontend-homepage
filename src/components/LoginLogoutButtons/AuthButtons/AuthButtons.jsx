import './AuthButtons.css';
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import useRequest from "../../CustomHooks/useRequest";
import useDispatching from "../../CustomHooks/useDispatching";

function AuthButtons() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { request }= useRequest();
  const { dispatching }= useDispatching();

  const logout = async() => {
    if(await request('GET', import.meta.env.VITE_SERVER_HOST + '/api/user/logout/')) {
      dispatching(false, false, false, false, false)
    };
  }

  return (
  <div className="sign-block">
     {isLoggedIn ? <input type='button' className="btn-signout" value="Выйти" onClick={logout} /> :
      <><input type='button' className="btn-signin" value="Войти" onClick={() => navigate("/login")} />
      <input type='button' className="btn-signup" value="Регистрация" onClick={() => navigate("/reg")}/></>
    }
  </div>

  )
}

export default AuthButtons;