import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { formatPrice } from '../format.js'

export default function Cart() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        api('GET', '/api/cart')
        .then((json) => setCart(json.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, [])

    async function refreshCart() {
        const json = await api('GET', '/api/cart')
        setCart(json.data)
    }

    async function updateCart(method, path, body) {
        setActionError('')
        setUpdating(true)
        try {
            const json = await api(method, path, body)
            if (json && json.data) {
                setCart(json.data)
            } else {
                await refreshCart()
            }
        } catch (err) {
            setActionError(err.message)
        } finally {
            setUpdating(false)
        }
    }

    function changeQuantity(vehicleId, quantity) {
        return updateCart('PATCH', '/api/cart/items/' + encodeURIComponent(vehicleId), { quantity })
    }

    async function removeItem(vehicleId) {
        return updateCart('DELETE', '/api/cart/items/' + encodeURIComponent(vehicleId))
    }

    function emptyCart() {
        return updateCart('DELETE', '/api/cart')
    }

    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error}</p>
    }
    if (cart.items.length === 0) {
        return (
            <section>
                <h2>Your cart</h2>
                <p>Your cart is empty</p>
            </section>
        )
    }

    return (
        <section>
            <h2>Your cart</h2>
            {actionError && <p role="alert">{actionError}</p>}
            <table border="1" cellPadding="4">
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Change</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.items.map((item) => (
                        <tr key={item.vehicleId}>
                            <td>{item.vehicle.year} {item.vehicle.make} {item.vehicle.model} {item.vehicle.trim}</td>
                            <td>{formatPrice(item.vehicle.price)}</td>
                            <td>{item.quantity}</td>
                            <td>{formatPrice(item.lineTotal)}</td>
                            <td>
                            <button disabled={updating || item.quantity === 1} onClick={() => changeQuantity(item.vehicleId, item.quantity - 1)} aria-label={'Decrease quantity of ' + item.vehicle.make + ' ' + item.vehicle.model}>-</button>
                            {' '}
                            <button disabled={updating} onClick={() => changeQuantity(item.vehicleId, item.quantity + 1)} aria-label={'Increase quantity of ' + item.vehicle.make + ' ' + item.vehicle.model}>+</button>
                            {' '}
                            <button disabled={updating} onClick={() => removeItem(item.vehicleId)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>Items: {cart.itemCount}</p>
            <p>Total: {formatPrice(cart.total)}</p>
            <button disabled={updating} onClick={emptyCart}>Empty cart</button>
            {' '}
            <Link to="/checkout">Proceed to checkout</Link>
        </section>
    )
}