import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'

export default function Catalog() {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api('GET', '/api/vehicles')
        .then((res) => setVehicles(res.data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>{error}</p>
    }
    
    return (
        <section>
            <h2>Vehicles</h2>
            <table border="1" cellPadding="4">
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>Condition</th>
                        <th>Mileage (km)</th>
                        <th>Price</th>
                        <th>In stock</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.map((v) => (
                        <tr key={v.id}>
                            <td><Link to={'/vehicles/' + v.id}>{v.year} {v.make} {v.model} {v.trim}</Link></td>
                            <td>{v.condition}</td>
                            <td>{v.mileageKm}</td>
                            <td>{v.price}</td>
                            <td>{v.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}