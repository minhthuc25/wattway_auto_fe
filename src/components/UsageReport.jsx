import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

// share of views that ended in a purchase, e.g. 2 purchases from 50 views -> "4%"
function conversion(row) {
    if (row.views === 0) {
        return '-'
    }
    return Math.round(row.purchases / row.views * 100) + '%'
}

export default function UsageReport() {
    const [rows, setRows] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        api('GET', '/api/analytics/usage')
        .then((json) => setRows(json.data))
        .catch((err) => setError(err.message))
    }, [])

    let results = <p>Loading...</p>
    if (error) {
        results = <p>{error}</p>
    } else if (rows && rows.length === 0) {
        results = <p>No visits recorded yet</p>
    } else if (rows) {
        results = (
            <table border="1" cellPadding="4">
                <thead>
                    <tr>
                        <th>Vehicle</th>
                        <th>Views</th>
                        <th>Added to cart</th>
                        <th>Purchases</th>
                        <th>Visitors</th>
                        <th>Conversion</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.vehicleId}>
                            <td><Link to={'/vehicles/' + row.vehicleId}>{row.year} {row.make} {row.model}</Link></td>
                            <td>{row.views}</td>
                            <td>{row.cartAdds}</td>
                            <td>{row.purchases}</td>
                            <td>{row.visitors}</td>
                            <td>{conversion(row)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }

    return (
        <section>
            <h3>Website usage report</h3>
            {results}
			<p>*Conversion = Purchases / Views</p>
        </section>
    )
}
