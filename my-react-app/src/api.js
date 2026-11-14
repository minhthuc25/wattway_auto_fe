export class ApiError extends Error {
    constructor(status, message, body) {
        super(message)
        this.status = status
        this.body = body
    }
}

export function getToken() {
    return localStorage.getItem('token')
}

export function setToken(token) {
    if (token) {
        localStorage.setItem('token', token)
    } else {
        localStorage.removeItem('token')
    }
}

export async function api(method, path, body) {
    const headers = {}
    if (body !== undefined) {
        headers['Content-Type'] = 'application/json'
    }

    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const options = { method, headers }
    if (body !== undefined) {
        options.body = JSON.stringify(body)
    }

    const res = await fetch (path, options)

    let json = null
    if (res.status !== 204) {
        json = await res.json().catch(() => null)
    }

    if (!res.ok) {
        let message = `Request failed (${res.status})`
        if (json && json.error) {
            message = json.error
        }
        throw new ApiError(res.status, message, json)
    }
    return json
}