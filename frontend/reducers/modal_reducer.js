import { OPEN_MODAL, CLOSE_MODAL } from './../actions/modal_actions';

const modalReducer = (state = null, action) => {
    Object.freeze(state);
    switch(action.type) {
        case OPEN_MODAL:
            return {
                action: action.modal,
                user: action.user
            }
        case CLOSE_MODAL:
            return null;
        default:
            return state;
    }
};

export default modalReducer;