import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from './actionType.js';

export const loginfailure = (err) => {
    return {
        type: LOGIN_FAILURE,
        payload: err,
    };
};

export const loginsuccess = (token) => {
    return {
        type: LOGIN_SUCCESS,
        payload: token,
    };
};


export const logout = () => {
    return {
        type: LOGOUT,
    };
};
