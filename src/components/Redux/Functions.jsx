import { CHANGE_ISLOGGEDIN, CHANGE_ISADMIN, SET_USER_ID, SET_STORAGE_ID, SET_CSRFTOKEN } from "./Actions"

const changeIsLoggedIn = (boolean) => {
  return {
    type: CHANGE_ISLOGGEDIN,
    payload: boolean,
  }
}

const changeIsAdmin = (boolean) => {
  return {
    type: CHANGE_ISADMIN,
    payload: boolean,
  }
}

const setUserId = (user_id) => {
  return {
    type: SET_USER_ID,
    payload: user_id,
  }
}

const setStorageId = (storage_id) => {
  return {
    type: SET_STORAGE_ID,
    payload: storage_id,
  }
}

const setCsrfToken = (csrftoken) => {
  return {
    type: SET_CSRFTOKEN,
    payload: csrftoken,
  }
}

export { changeIsLoggedIn, changeIsAdmin, setUserId, setStorageId, setCsrfToken };