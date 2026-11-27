import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { formatPrice } from '../format.js'

export default function Account() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [addressError, setAddressError] = useState('')
    const [addressMessage, setAddressMessage] = useState('')

    useEffect(() => {
        Promise.all([api('GET', '/api/users/me'), api('GET', '/api/orders')])
        .then(([userJson, ordersJson]) => {
            setFullName(userJson.data.firstName + ' ' + userJson.data.lastName)
            setRole(userJson.data.role)
            const shipping = userJson.data.defaultShipping
            if (shipping) {
                setStreet(shipping.street)
                setCity(shipping.city)
                setProvince(shipping.province)
                setCountry(shipping.country)
                setPostalCode(shipping.postalCode)
            }
            setOrders(ordersJson.data)
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, [])

    async function handleSaveAddress(e) {
        e.preventDefault()
        setAddressError('')
        setAddressMessage('Saving...')
        try {
            await api('PATCH', '/api/users/me', { defaultShipping: { street, city, province, country, postalCode } })
            setAddressMessage('Address saved')
        } catch (err) {
            setAddressMessage('')
            setAddressError(err.message)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error}</p>
    }

    return (
        <section>
            <h2>Your account</h2>
            <p>Name: {fullName}</p>
            <p>Role: {role}</p>

            <h3>Default shipping address</h3>
            <form onSubmit={handleSaveAddress}>
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
                <button type="submit">Save address</button>
                <p>{addressError}</p>
                <p>{addressMessage}</p>
            </form>

            <h3>Order history</h3>
            {orders.length === 0 && <p>You have no orders yet</p>}
            {orders.length > 0 && (
                <table border="1" cellPadding="4">
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Vehicles</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString('en-CA')}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.items.map((item) => (
                                        <div key={item.vehicleId}>
                                            {item.quantity} x {item.vehicle.year} {item.vehicle.make} {item.vehicle.model} {item.vehicle.trim}
                                        </div>
                                    ))}
                                </td>
                                <td>{formatPrice(order.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}
