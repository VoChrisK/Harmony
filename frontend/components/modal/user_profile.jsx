import React from 'react';
import { connect } from 'react-redux'
import { createFriend } from '../../actions/friend_actions';
import chooseColor from '../../util/choose_color';
import ServerIndexItem from './../server/server_index_item';
import { closeModal } from '../../actions/modal_actions';
import { createAffiliation } from './../../util/affiliation_api_util';
import { createPrivateServer } from './../../actions/server_actions';
import { withRouter } from 'react-router-dom';
import setIcons from './../../util/set_icons';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.getElementsByClassName("modal-container")[0].classList.add("darker-modal");
        setIcons(this.props.user.id);
    }

    handlePrivateServer(event) {
        event.preventDefault();
        let users = [this.props.currentUser.id, this.props.user.id].sort();
        const server = Object.assign({}, { "name": `DM ${users[0]} and ${users[1]}` });
        this.props.createPrivateServer(server).then(
            newServer => {
                createAffiliation(this.props.currentUser.id, newServer.server.id);
                createAffiliation(this.props.user.id, newServer.server.id).then(
                    () => {
                        this.props.closeModal();
                        this.props.history.push(`/servers/@me/${newServer.server.id}`);
                    }
                );
            }
        );
    }

    handleFriend(event) {
        event.target.innerHTML = "Added!";
        event.target.classList.add("disabled");
        event.target.setAttribute("disabled", "true");
        window.setTimeout(() => this.props.createFriend(this.props.currentUser, this.props.user), 1000);
    }

    renderMutualServers() {
        if(this.props.currentUser.id !== this.props.user.id) {
            return (
                <section className="modal-section-2">
                    <h1 className="server-header">Mutual Servers</h1>
                    <ul className="mutual-servers">
                        {
                            this.props.user.serverIds.map((id, idx) => this.renderServerIcon(id, idx))
                        }
                    </ul>
                </section>
            );
        } else {
            return null;
        }
    }

    render() {
        const { user } = this.props;

        return (
            <div className="user-profile-container">
                <section className="modal-section-1">
                    <div className="user-container">
                        <div className={`big user-icon icon-container ${chooseColor(user.id)}`}>
                            <img className={`huge discord-icon ${user.id}`} src={discordIcon} alt="" />
                        </div>
                        <h1 className="username">{user.username}</h1>
                    </div>
                    <div className={`buttons-group ${this.props.currentUser.id === user.id ? "hide" : ""}`}>
                        <button className={this.props.friends[user.id] ? "hide add-friend" : "add-friend"} onClick={this.handleFriend.bind(this)}>Add Friend</button>
                        <button onClick={this.handlePrivateServer.bind(this)} className="message-button">Message</button>
                    </div>
                </section>
                {this.renderMutualServers()}
            </div>
        );
    }

    renderServerIcon(id, idx) {
        const server = this.props.servers[id];
        if(server) {
            return <ServerIndexItem key={idx} server={server} closeModal={this.props.closeModal} />
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        servers: state.entities.servers,
        friends: state.entities.friends,
        currentUser: state.entities.users[state.session.id]
    });
};

const mapDispatchToProps = (dispatch) => {
    return ({
        createFriend: (user1, user2) => dispatch(createFriend(user1, user2)),
        createPrivateServer: server => dispatch(createPrivateServer(server)),
        closeModal: () => dispatch(closeModal())
    });
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));