import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { formatPrice } from '../format.js'

export default function Checkout() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [street, setStreet] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [orderError, setOrderError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [order, setOrder] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        Promise.all([api('GET', '/api/cart'), api('GET', '/api/users/me')])
        .then(([cartJson, userJson]) => {
            setCart(cartJson.data)
            const shipping = userJson.data.defaultShipping
            if (shipping) {
                setStreet(shipping.street)
                setCity(shipping.city)
                setProvince(shipping.province)
                setCountry(shipping.country)
                setPostalCode(shipping.postalCode)
            }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setOrderError('')
        setSubmitting(true) // disables the button so that a double click cannot place two orders
        try {
            const json = await api('POST', '/api/orders', {
                shipping: { street, city, province, country, postalCode },
                card: { number: cardNumber, expiry, cvv },
            })
            setOrder(json.data)
            setMessage(json.message)
        } catch (err) {
            setOrderError(err.message)
            if (err.status === 402) { // payment denied, user must re-enter card
                setCardNumber('')
                setExpiry('')
                setCvv('')
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error}</p>
    }
    if (order) {
        return (
            <section>
                <h2>Checkout</h2>
                <p>{message}</p>
                <p>Order number: {order.id}</p>
                <p>Total: {formatPrice(order.total)}</p>
                <Link to="/account">View your orders</Link>
                {' | '}
                <Link to="/">Back to vehicles</Link>
            </section>
        )
    }
    if (cart.items.length === 0) {
        return (
            <section>
                <h2>Checkout</h2>
                <p>Your cart is empty</p>
            </section>
        )
    }

    return (
        <section>
            <h2>Checkout</h2>
            <ul>
                {cart.items.map((item) => (
                    <li key={item.vehicleId}>
                        {item.quantity} x {item.vehicle.year} {item.vehicle.make} {item.vehicle.model} {item.vehicle.trim}: {formatPrice(item.lineTotal)}
                    </li>
                ))}
            </ul>
            <p>Total: {formatPrice(cart.total)}</p>
            <form onSubmit={handleSubmit}>
                <h3>Shipping address</h3>
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
                <h3>Card details</h3>
                <p>
                    <label>Card number </label>
                    <input autoComplete="off" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                </p>
                <p>
                    <label>Expiry (MM/YY) </label>
                    <input autoComplete="off" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </p>
                <p>
                    <label>CVV </label>
                    <input autoComplete="off" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                </p>
                <button type="submit" disabled={submitting}>Confirm order</button>
                {submitting && <p>Placing order...</p>}
                <p>{orderError}</p>
            </form>
        </section>
    )
}
