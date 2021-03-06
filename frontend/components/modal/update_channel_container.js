import { connect } from 'react-redux';
import { updateChannel } from "../../actions/channel_actions";
import ChannelForm from './channel_form';
import { withRouter } from 'react-router-dom';
import { closeModal } from '../../actions/modal_actions';
import { clearErrors } from '../../actions/error_actions';

const mapStateToProps = (state) => {
    return ({
        formType: 'update',
        errors: state.errors.general
    });
};

const mapDispatchToProps = (dispatch) => {
    return ({
        processForm: channel => dispatch(updateChannel(channel)),
        closeModal: () => dispatch(closeModal()),
        clearErrors: () => dispatch(clearErrors())
    });
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChannelForm));