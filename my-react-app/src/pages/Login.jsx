import { useState } from 'react'
import { api, setToken } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const { setUser } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')
        try {
            const result = await api('POST', '/api/sessions', {username, password})
            setToken(result.data.token)
            setUser(result.data.user)
            setMessage('Logged in as ' + result.data.user.firstName)
        } catch (err) {
            setError(err.message)
        }
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