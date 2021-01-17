export function authHeader(): Headers {
    // return authorization header with basic auth credentials
    let token = JSON.parse(localStorage.getItem('token') || '{}');

    if (token && token.key) {
        return new Headers({ 'Authorization': 'Token ' + token.key });
    } else {
        return new Headers({});
    }
}
