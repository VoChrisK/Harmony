import { RECEIVE_CURRENT_USER } from './../actions/session_actions';

const usersReducer = (state = {}, action) => {
    Object.freeze(state);
    let nextState;
    switch(action.type) {
        case RECEIVE_CURRENT_USER:
            nextState = Object.assign({}, state);
            nextState[action.currentUser.id] = action.currentUser;
            return nextState;
        default:
            return state;
    };
};

export default usersReducer;