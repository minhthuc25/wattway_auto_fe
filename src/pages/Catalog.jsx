import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { formatPrice } from '../format.js'
import { Link } from 'react-router-dom'

const NO_FILTERS = { search: '', make: '', bodyType: '', condition: '', year: '', hasAccidents: '', available: '', sort: '' }

export default function Catalog() {
    const [vehicles, setVehicles] = useState([])
    const [makes, setMakes] = useState([])
    const [filters, setFilters] = useState(NO_FILTERS)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const params = new URLSearchParams()
        for (const [name, value] of Object.entries(filters)) {
            if (name !== 'sort' && value !== '') {
                params.set(name, value)
            }
        }
        if (filters.sort) {
            const [sort, order] = filters.sort.split('-') // e.g. "price-desc"
            params.set('sort', sort)
            params.set('order', order)
        }

        let outdated = false // set when the filters change again before this response arrives
        api('GET', '/api/vehicles?' + params)
        .then((res) => {
            if (outdated) {
                return
            }
            setVehicles(res.data)
            // the make list comes from the first, unfiltered load so it doesn't shrink while filtering
            setMakes((current) => (current.length > 0 ? current : [...new Set(res.data.map((v) => v.make))].sort()))
        })
        .catch((err) => {
            if (!outdated) {
                setError(err.message)
            }
        })
        .finally(() => {
            if (!outdated) {
                setLoading(false)
            }
        })
        return () => {
            outdated = true
        }
    }, [filters])

    function changeFilters(newFilters) {
        setFilters(newFilters)
        setLoading(true)
        setError('')
    }

    function handleChange(e) {
        changeFilters({ ...filters, [e.target.name]: e.target.value })
    }

    let results
    if (loading) {
        results = <p>Loading...</p>
    } else if (error) {
        results = <p>{error}</p>
    } else if (vehicles.length === 0) {
        results = <p>No vehicles match these filters</p>
    } else {
        results = (
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
                            <td>{formatPrice(v.price)}</td>
                            <td>{v.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <section>
            <h2>Vehicles</h2>
            <p>
                <label>Search </label>
                <input name="search" value={filters.search} onChange={handleChange} />
            </p>
            <p>
                <label>Make </label>
                <select name="make" value={filters.make} onChange={handleChange}>
                    <option value="">Any</option>
                    {makes.map((make) => (
                        <option key={make} value={make}>{make}</option>
                    ))}
                </select>
                {' '}
                <label>Body type </label>
                <select name="bodyType" value={filters.bodyType} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="truck">Truck</option>
                </select>
                {' '}
                <label>Model year </label>
                <input type="number" name="year" value={filters.year} onChange={handleChange} />
            </p>
            <p>
                <label>Condition </label>
                <select name="condition" value={filters.condition} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
                {' '}
                <label>Vehicle history </label>
                <select name="hasAccidents" value={filters.hasAccidents} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="false">No reported accidents</option>
                    <option value="true">Reported accidents</option>
                </select>
                {' '}
                <label>Availability </label>
                <select name="available" value={filters.available} onChange={handleChange}>
                    <option value="">Any</option>
                    <option value="true">In stock</option>
                    <option value="false">Sold out</option>
                </select>
            </p>
            <p>
                <label>Sort by </label>
                <select name="sort" value={filters.sort} onChange={handleChange}>
                    <option value="">Default</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="mileageKm-asc">Mileage: low to high</option>
                    <option value="mileageKm-desc">Mileage: high to low</option>
                </select>
                {' '}
                <button onClick={() => changeFilters(NO_FILTERS)}>Clear filters</button>
            </p>
            {results}
        </section>
    )
}
