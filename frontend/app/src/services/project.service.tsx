

import { authHeader } from '../helpers/auth-helper';
import { userService } from './user.service';

import {  Project, } from '../models/projects';

export const projectService = {
    create,
    save,
    get,
    del,
    getAll,
};

export interface AbortHandle<T> {
    abort(): void
    ready: Promise<T>
};


function abortableFetch<T>(request: Request, opts?: any): AbortHandle<T> {
    const controller = new AbortController();
    const signal = controller.signal;

    return {
        abort: () => controller.abort(),
        ready: fetch(request, { ...opts, signal })
            .then(_handleResponse)
    };
}

export interface PagedResult<T> {
    count: number
    next: string
    previous: string
    results: T[]
}

async function _handleResponse(resp: Response) {
    if (resp.ok) {
        return resp.json();

    } else {
        if (resp.status === 401) {
            userService.logout();
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
async function _handleDeleteResponse(resp: Response) {
    if (!resp.ok) {
        if (resp.status === 401) {
            userService.logout();
        }
        try {
            const data = await resp.json();
            return Promise.reject(data.non_field_errors || data.detail || data);
        }
        catch {
            return Promise.reject(resp.statusText);
        }
    }
    else {
        window.location.reload(true);
    }
}



function create(project: Project, start: Date, end: Date): Promise<Project> {
    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const req = new Request(
        '/api/1.0/projects/',
        {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(project)
        });

    return fetch(req)
        .then(_handleResponse)
        .catch(error => { console.log(error); return Promise.reject(error); })
}

function save(proj: Project): Promise<Project> {
    const obj: any = {
        id: proj.id,
        name: proj.name,
        parent: proj.parent,
    }


    for (let key of Object.keys(obj)) {
        if (obj[key] === '') obj[key] = null;
    }

    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const requestOptions = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(obj)
    };

    return fetch(`/api/1.0/projects/${proj.id}/`, requestOptions)
        .then(_handleResponse)
        .catch(error => { console.log(error); return Promise.reject(error); })
}

function get(proj_id: number): Promise<Project> {
    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const requestOptions = {
        method: 'GET',
        headers: headers
    };

    return fetch('/api/1.0/projects/' + proj_id + '/', requestOptions)
        .then(_handleResponse)
        .catch(error => { console.log(error); return Promise.reject(error); })
}

function del(proj: Project): Promise<void> {
    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const requestOptions = {
        method: 'DELETE',
        headers: headers
    };

    return fetch('/api/1.0/projects/' + proj.id + '/', requestOptions)
        .then(_handleDeleteResponse)
        .catch(error => { console.log(error); return Promise.reject(error); })
}

function getAll(params: any): AbortHandle<PagedResult<Project>> {
    const headers = authHeader();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    const req = new Request(
        '/api/1.0/projects/?' + objectToQueryString(params),
        {
            method: 'GET',
            headers: headers
        });

    return abortableFetch<PagedResult<Project>>(req);
}


function objectToQueryString(obj: any) {
    return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
}




