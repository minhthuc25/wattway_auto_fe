import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'

export default function VehicleDetails() {
    const { id } = useParams()
    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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

    return (
        <div>
            <h2>{vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}</h2>
            <p>Price: {vehicle.price}</p>
            <p>Condition: {vehicle.condition}</p>
            <p>Mileage (km): {vehicle.mileageKm}</p>
            <p>Range (km): {vehicle.rangeKm}</p>
            <p>Battery: {vehicle.batteryKwh}</p>
            <p>Colour: {vehicle.color}</p>
            <p>Body type: {vehicle.bodyType}</p>
            <p>Accidents: {accidents}</p>
            <p>History report: {vehicle.historyReport}</p>
            <p>In stock: {vehicle.quantity}</p>
            <p>Description: {vehicle.description}</p>
            <Link to="/">Back to vehicles</Link>
        </div>
    )
}