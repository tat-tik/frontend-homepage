import { CHANGE_ISLOGGEDIN, CHANGE_ISADMIN, SET_USER_ID, SET_STORAGE_ID, SET_CSRFTOKEN } from "./Actions";

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  user_id: null,
  storage_id: null,
  csrftoken: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ISLOGGEDIN:
      return {
        ...state,
        isLoggedIn: action.payload
      }
    case CHANGE_ISADMIN:
      return {
        ...state,
        isAdmin: action.payload
      }
    case SET_USER_ID:
      return {
        ...state,
        user_id: action.payload
      }
    case SET_STORAGE_ID:
      return {
        ...state,
        storage_id: action.payload
      }
    case SET_CSRFTOKEN:
      return {
        ...state,
        csrftoken: action.payload,
      }
    default:
      return state;
  }
};

export default userReducer;