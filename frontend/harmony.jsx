import React from 'react';
import ReactDOM from 'react-dom';
import { signup, login, logout } from './util/sessions_api_util';
import configureStore from './store/store';
// import Root from './components/root';

document.addEventListener('DOMContentLoaded', () => {
    const store = configureStore();
    const root = document.getElementById("root");
    window.signup = signup;
    window.login = login;
    window.logout = logout;
    window.store = store;
    ReactDOM.render(<h1>hi</h1>, root);
});