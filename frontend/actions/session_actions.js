import * as SessionApiUtil from './../util/sessions_api_util';

export const receiveCurrentUserId = currentUserId => {
    return ({
        type: "RECEIVE_CURRENT_USER_ID",
        currentUserId
    });
};

export const receiveCurrentUser = currentUser => {
    return({
        type: "RECEIVE_CURRENT_USER",
        currentUser
    });
};

const logoutCurrentUser = () => {
    return({
        type: "LOGOUT_CURRENT_USER"
    });
};

const receiveSessionErrors = errors => {
    return({
        type: "RECEIVE_SESSION_ERRORS",
        errors
    });
};

export const clearSession = () => {
    return({
        type: "LOGOUT_CURRENT_USER"
    })
}

export const clearSessionErrors = () => {
    return({
        type: "CLEAR_SESSION_ERRORS"
    })
}

export const login = user => dispatch => {
    return SessionApiUtil.login(user)
    .then(
        currentUser => dispatch(receiveCurrentUser(currentUser)),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    )
};

export const logout = () => dispatch => {
    return SessionApiUtil.logout().then(
        () => dispatch(logoutCurrentUser()),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    );
};

export const signup = user => dispatch => {
    return SessionApiUtil.signup(user)
    .then(
        newUser => dispatch(receiveCurrentUser(newUser)),
        errors => dispatch(receiveSessionErrors(errors.responseJSON))
    )
};

export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_CURRENT_USER_ID = "RECEIVE_CURRENT_USER_ID";
export const LOGOUT_CURRENT_USER = "LOGOUT_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const CLEAR_SESSION_ERRORS = "CLEAR_SESSION_ERRORS";