import { useState } from 'react'
import { api } from '../api.js'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')
        try {
            await api('POST', '/api/users', {username, password, firstName, lastName})
            setMessage('Account created')
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div>
            <h2>Create an account</h2>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Username </label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} />
                </p>
                <p>
                    <label>Password </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </p>
                <p>
                    <label>First name </label>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </p>
                <p>
                    <label>Last name </label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </p>
                <button type="submit">Register</button>
                <p>{error}</p>
                <p>{message}</p>
            </form>
        </div>
    )
}