import React from 'react';
import MessageIndexItemContainer from './message_index_item_container';
import { createChannelMessage } from './../../util/channel_message_api_util';
import { createDirectMessage } from './../../util/direct_message_api_util';
import setIcons from './../../util/set_icons';
import { checkSession } from '../../util/session_check_util';
import LoadSpinner from '../spinner/load_spinner';

class MessageIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: "",
            messages: []
        };
    }

    componentDidMount() {
        document.getElementById("chat-log").style.background = `url(${discordChat2}) no-repeat bottom left, url(${discordChat1}) no-repeat bottom right`;
        if (this.props.input) {

            let processForm;
            if (this.props.inputType === "server") {
                processForm = this.props.requestDirectMessages
            } else {
                processForm = this.props.requestChannelMessages
            }

            processForm(this.props.input.id).then(
                () => {
                    this.setState({ messages: this.props.messages })
                    this.expandMessages();
                }
            );   
        }

        App.cable.subscriptions.create(
            { channel: "ChannelChannel" },
            {
                received: data => {
                    let messages;
                    if(data.method === "create") {
                        this.setState({ messages: this.state.messages.concat(data.message) });
                    }
                    else if(data.method === "update") {
                        messages = this.state.messages.map(message => message.id === data.message.id ? data.message : message);
                        this.setState({ messages: messages })
                    } 
                    else if(data.method === "delete") {
                        messages = this.state.messages.filter(message => message.id !== data.message.id);
                        this.setState({ messages: messages })
                    }
    
                    this.checkChatLog();
                    
                },
                speak: function (data) {
                    return this.perform("speak", data);
                }
            });
    }

    componentDidUpdate(preProps) {
        if(this.props.input) {
            if(!preProps.input || this.props.input.id !== preProps.input.id) {
                let processForm;
                if (this.props.inputType === "server") {
                    processForm = this.props.requestDirectMessages
                } else {
                    processForm = this.props.requestChannelMessages
                }
    
                processForm(this.props.input.id).then(
                    data => {
                        this.setState({ messages: this.props.messages });
                        this.props.messages.forEach(message => {
                            setIcons(message.author_id);
                        })
                        this.checkChatLog();
                        this.expandMessages();
                    }
                );
            } else if (Object.keys(this.props.users).length > 0 && Object.keys(preProps.users).length > 0) {
                if (this.props.users[this.props.currentUserId].username !== preProps.users[this.props.currentUserId].username) {
                    let processForm;
                    if (this.props.inputType === "server") {
                        processForm = this.props.requestDirectMessages
                    } else {
                        processForm = this.props.requestChannelMessages
                    }

                    processForm(this.props.input.id).then(
                        data => {
                            this.setState({ messages: this.props.messages });
                            this.checkChatLog();
                        }
                    );
                }
            }
        } 
    }

    checkChatLog() {
        if (Boolean(document.getElementById("chat-log"))) {
            if (document.getElementById("chat-log").children.length > 0) {
                document.getElementById("chat-log").lastChild.scrollIntoView();
            }
        }
    }

    handleBody(e) {
        this.setState({ body: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        let message = Object.assign({}, this.state);
        message["author_id"] = this.props.currentUserId;
        this.props.createMessage(message).then(
            newMessage => {
                checkSession(newMessage.message[0], this.props.clearSession);
                if(newMessage.message[0] !== "Invalid Credentials") {
                    if(this.props.inputType === "channel") {
                        createChannelMessage(newMessage.message.id, this.props.input.id);
                    } else {
                        createDirectMessage(newMessage.message.id, this.props.input.id);
                    }
                    App.cable.subscriptions.subscriptions[0].speak({ message: newMessage.message, method: 'create' });
                    this.setState({ body: "" });
                }
            }
        );
    }

    expandMessages() {
        if (document.getElementsByClassName("chat-container")[0]) {
            if (this.props.inputType === "server") {
                document.getElementsByClassName("chat-container")[0].classList.add("expand");
            } else {
                document.getElementsByClassName("chat-container")[0].classList.remove("expand");
            }
        }
    }

    renderChat() {
        return (
            <section className="chat-container">

                <section id="chat-log">
                    <LoadSpinner type={"message"} />
                </section>

                <form className="message-input-container">
                    <input type="text" className="message-input" value={this.state.body} onChange={this.handleBody.bind(this)} />
                </form>

            </section>
        )
    }

    render() {
        if(!this.props.input) return this.renderChat();
        if(this.props.input && Object.keys(this.props.users).length === 0) return this.renderChat();

        return (
            <section className="chat-container">

                <section id="chat-log">
                    {
                        this.state.messages.map((message, idx) => <MessageIndexItemContainer key={idx} message={message} users={this.props.users} idx={idx} />)
                    }
                </section>

                <form className="message-input-container" onSubmit={this.handleSubmit.bind(this)}>
                    <input type="text" className="message-input" placeholder={`message ${this.props.inputType === "channel" ? "#" + this.props.input.name : this.renderUsername() }`} value={this.state.body} onChange={this.handleBody.bind(this)} />
                </form>

            </section>
        )
    }

    renderUsername() {
        if (Object.keys(this.props.input.userIds).length === 0) return null;
        const index = this.props.input.userIds.filter(id => id !== parseInt(this.props.currentUserId))[0];
        const otherUser = this.props.users[index] || this.props.friends[index];
        return "@" + otherUser.username;
    }
}
    
export default MessageIndex;