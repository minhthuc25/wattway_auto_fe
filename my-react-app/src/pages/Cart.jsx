import { useState, useEffect } from 'react'
import { api } from '../api.js'

export default function Cart() {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')

    useEffect(() => {
        api('GET', '/api/cart')
        .then((json) => setCart(json.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }
    if(error) {
        return <p>{error}</p>
    }
    if(cart.items.length === 0) {
        return <p>Your cart is empty</p>
    }

    async function changeQuantity(vehicleId, quantity) {
        setActionError('')
        try {
            const json = await api('PATCH', '/api/cart/items/' + vehicleId, { quantity })
            setCart(json.data)
        } catch (err) {
            setActionError(err.message)
        }
    }

    async function removeItem(vehicleId) {
        setActionError('')
        try {
            const json = await api('DELETE', '/api/cart/items/' + vehicleId)
            setCart(json.data)
        } catch (err) {
            setActionError(err.message)
        }
    }

    return (
        <section>
            <h2>Your cart</h2>
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
                            <td>{item.vehicle.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.lineTotal}</td>
                            <td> <button disabled={item.quantity === 1} onClick={() => changeQuantity(item.vehicleId, item.quantity - 1)}>-</button>
                            {' '}
                            <button onClick={() => changeQuantity(item.vehicleId, item.quantity + 1)}>+</button>
                            {' '}
                            <button onClick={() => removeItem(item.vehicleId)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>Items: {cart.itemCount}</p>
            <p>Total: {cart.total}</p>
            <p>{actionError}</p>
        </section>
    )
}