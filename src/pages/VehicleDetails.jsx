import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'
import { formatPrice } from '../format.js'
import Reviews from '../components/Reviews.jsx'
import LoanCalculator from '../components/LoanCalculator.jsx'

export default function VehicleDetails() {
    const { id } = useParams()
    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [cartMessage, setCartMessage] = useState('')
    const [cartError, setCartError] = useState('')

    useEffect(() => {
        api('GET', '/api/vehicles/' + id)
        .then((json) => setVehicle(json.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error}</p>
    }

    let accidents = 'No'
    if (vehicle.hasAccidents) {
        accidents = 'Yes'
    }

    let image = <p>No image available</p>
    if (vehicle.imageUrl) {
        image = <img src={vehicle.imageUrl} alt={vehicle.year + ' ' + vehicle.make + ' ' + vehicle.model} width="400" />
    }

    async function handleAddToCart() {
        setCartMessage('')
        setCartError('')
        try {
            await api('POST', '/api/cart/items', { vehicleId: vehicle.id, quantity: 1})
            setCartMessage('Added to cart')
        } catch (err) {
            setCartError(err.message)
        }
    }

    return (
        <div>
            <h2>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</h2>
            <div>{image}</div>
            <p>Price: {formatPrice(vehicle.price)}</p>
            <p>Condition: {vehicle.condition}</p>
            <p>Mileage (km): {vehicle.mileageKm}</p>
            <p>Range (km): {vehicle.rangeKm}</p>
            <p>Battery: {vehicle.batteryKwh} kWh</p>
            <p>Colour: {vehicle.color}</p>
            <p>Body type: {vehicle.bodyType}</p>
            <p>Accidents: {accidents}</p>
            <p>History report: {vehicle.historyReport}</p>
            <p>In stock: {vehicle.quantity}</p>
            <p>Description: {vehicle.description}</p>
            <button onClick={handleAddToCart}>Add to cart</button>
            <p>{cartError}</p>
            <p>{cartMessage}</p>
            <LoanCalculator key={vehicle.id} vehiclePrice={vehicle.price} />
            <Reviews vehicleId={vehicle.id} />
            <Link to="/">Back to vehicles</Link>
        </div>
    )
}