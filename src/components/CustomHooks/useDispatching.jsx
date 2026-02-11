import { useDispatch } from "react-redux";
import { 
  changeIsLoggedIn, 
  changeIsAdmin, 
  setUserId, 
  setStorageId, 
  setCsrfToken 
} from "../Redux/Functions";

function useDispatching () {
  const dispatch = useDispatch();
  const dispatching = (isLoggedIn, isAdmin, user_id, storage_id, csrftoken) => {
    dispatch(changeIsLoggedIn(isLoggedIn));
    dispatch(changeIsAdmin(isAdmin));
    dispatch(setUserId(user_id));
    dispatch(setStorageId(storage_id));
    dispatch(setCsrfToken(csrftoken));
    return true;
  }
  return { dispatching }
}

export default useDispatching;