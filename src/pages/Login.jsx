import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api, setToken } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const { user, setUser, checkingLogin } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('Logging in...')
        try {
            const result = await api('POST', '/api/sessions', {username, password})
            setToken(result.data.token)
            setUser(result.data.user) // the page then switches to the logged-in view below
        } catch (err) {
            setMessage('')
            setError(err.message)
        }
    }

    if (checkingLogin) {
        return <p>Loading...</p>
    }
    if (user) {
        return (
            <div>
                <h2>Log in</h2>
                <p>You are logged in as {user.firstName}</p>
            </div>
        )
    }

    return (
        <div>
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Username </label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                </p>
                <p>
                    <label>Password </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </p>
                <button type="submit">Log in</button>
                <p>{error}</p>
                <p>{message}</p>
            </form>
        </div>
    )
}