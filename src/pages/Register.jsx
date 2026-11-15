import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../auth.jsx'

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [registered, setRegistered] = useState(false)
    const { user, checkingLogin } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setMessage('')

        const body = {username, password, firstName, lastName}
        const address = [street, city, province, country, postalCode]
        if (address.some((field) => field.trim())) { // the address is optional, but must be complete if given
            if (!address.every((field) => field.trim())) {
                setError('Fill in the whole address, or leave it empty')
                return
            }
            body.defaultShipping = { street, city, province, country, postalCode }
        }

        setMessage('Creating account...')
        try {
            await api('POST', '/api/users', body)
            setRegistered(true)
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
                <h2>Create an account</h2>
                <p>You are logged in as {user.firstName}</p>
            </div>
        )
    }
    if (registered) {
        return (
            <div>
                <h2>Registration complete</h2>
                <p>Your account has been created</p>
            </div>
        )
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
                <h3>Shipping address (optional)</h3>
                <p>
                    <label>Street </label>
                    <input value={street} onChange={(e) => setStreet(e.target.value)} />
                </p>
                <p>
                    <label>City </label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} />
                </p>
                <p>
                    <label>Province </label>
                    <input value={province} onChange={(e) => setProvince(e.target.value)} />
                </p>
                <p>
                    <label>Country </label>
                    <input value={country} onChange={(e) => setCountry(e.target.value)} />
                </p>
                <p>
                    <label>Postal code </label>
                    <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                </p>
                <button type="submit">Register</button>
                <p>{error}</p>
                <p>{message}</p>
            </form>
        </div>
    )
}