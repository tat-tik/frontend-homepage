import './LoginLogoutButtons.css';
import { Link } from "react-router";
import AuthButtons from "./AuthButtons/AuthButtons"

function LoginLogoutButtons() {

  return (
    <div className="header">
      <div  className="header-title"><Link to={'/'} className="to-home">My Cloud</Link></div>
      <AuthButtons />
    </div>
  )
}

export default LoginLogoutButtons;