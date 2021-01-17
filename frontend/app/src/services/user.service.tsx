

import { User } from '../models/users';
import { authHeader } from '../helpers/auth-helper';

export const userService = {
    login,
    logout,
    getUser,
    getProfile,
};


async function _handleResponse(resp: Response) {
    if (resp.ok) {
        return resp.json();
    } else {
        if (resp.status === 401) {
            logout();
            window.location.reload(true);
        }
        if (resp.status === 403) {
            document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:01 GMT; csrftoken=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            window.location.reload(true);
        }
        try {
            const data = await resp.json();
            return Promise.reject(data.non_field_errors || data.detail || data);
        }
        catch {
            return Promise.reject(resp.statusText);
        }
    }
}

function getUser(): User | null {
    try {
        const userJson = localStorage.getItem('user');
        return userJson !== null ? JSON.parse(userJson) : null;
    }
    catch {
        localStorage.removeItem('token');
        return null;
    }

}

function login(username: string, password: string) {
    const req = new Request(
        '/api/1.0/rest-auth/login/',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password
            })
        });

    return fetch(req)
        .then(_handleResponse)
        .then(token => {
            // login successful if there's a key in the response
            if (token) {
                // to keep user logged in between page refreshes
                localStorage.setItem('token', JSON.stringify(token));
                // fetch user info
                return getProfile()
                    .then(user => {
                        if (user) {
                            localStorage.setItem('user', JSON.stringify(user));
                        }
                        return user;
                    });
            }
            return null;
        });
}

function logout() {
    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const req = new Request(
        '/api/1.0/rest-auth/logout/',
        {
            method: 'POST',
            headers: headers
        });
    return fetch(req)
        .then(() => {
            // remove user from local storage to log user out
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            //window.location.reload(true);
        });
}

function getProfile() {
    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const requestOptions = {
        method: 'GET',
        headers: headers
    };

    return fetch('/api/1.0/rest-auth/user/', requestOptions)
        .then(_handleResponse);
}


