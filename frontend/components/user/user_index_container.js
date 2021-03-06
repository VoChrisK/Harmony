import { connect } from "react-redux";
import UserIndex from "./user_index";
import { requestUsers } from "../../actions/user_actions";
import { withRouter } from 'react-router-dom';

const mapStateToProps = (state, ownProps) => {
    return({
        users: Object.values(state.entities.users),
        server: state.entities.servers[ownProps.match.params.serverId]
    });
};

const mapDispatchToProps = (dispatch) => {
    return ({
        requestUsers: serverId => dispatch(requestUsers(serverId))
    });
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserIndex));