import { useState, useEffect } from 'react'
import { api } from '../api.js'
import { formatPrice } from '../format.js'

const THIS_YEAR = new Date().getFullYear()

async function fetchSales(year) {
    const json = await api('GET', '/api/analytics/sales?year=' + encodeURIComponent(year))
    return { year: Number(year), rows: json.data } // keep the year shown with its results
}

function monthName(year, month) {
    return new Date(year, month - 1).toLocaleString('en-CA', { month: 'long' }) // month is 1-12
}

export default function SalesReport() {
    const [year, setYear] = useState(String(THIS_YEAR))
    const [report, setReport] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchSales(THIS_YEAR)
        .then((data) => setReport(data))
        .catch((err) => setError(err.message))
    }, [])

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        try {
            setReport(await fetchSales(year))
        } catch (err) {
            setError(err.message)
        }
    }

    let results = null
    if (!report && !error) {
        results = <p>Loading...</p>
    } else if (report && report.rows.length === 0) {
        results = <p>No vehicles sold in {report.year}</p>
    } else if (report) {
        const months = [...new Set(report.rows.map((row) => row.month))] // rows come sorted by month
        let yearQuantity = 0
        let yearRevenue = 0
        results = (
            <table border="1" cellPadding="4">
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Vehicle</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    {months.map((month) => {
                        const rows = report.rows.filter((row) => row.month === month)
                        const monthQuantity = rows.reduce((sum, row) => sum + row.quantity, 0)
                        const monthRevenue = rows.reduce((sum, row) => sum + row.revenue, 0)
                        yearQuantity += monthQuantity
                        yearRevenue += monthRevenue
                        return [
                            ...rows.map((row) => (
                                <tr key={month + '-' + row.vehicleId}>
                                    <td>{monthName(report.year, month)}</td>
                                    <td>{row.year} {row.make} {row.model}</td>
                                    <td>{row.quantity}</td>
                                    <td>{formatPrice(row.revenue)}</td>
                                </tr>
                            )),
                            <tr key={month + '-total'}>
                                <td colSpan="2"><strong>{monthName(report.year, month)} total</strong></td>
                                <td><strong>{monthQuantity}</strong></td>
                                <td><strong>{formatPrice(monthRevenue)}</strong></td>
                            </tr>,
                        ]
                    })}
                    <tr>
                        <td colSpan="2"><strong>{report.year} total</strong></td>
                        <td><strong>{yearQuantity}</strong></td>
                        <td><strong>{formatPrice(yearRevenue)}</strong></td>
                    </tr>
                </tbody>
            </table>
        )
    }

    return (
        <section>
            <h3>Sales report</h3>
            <form onSubmit={handleSubmit}>
                <label>Year </label>
                <input type="number" min="2000" value={year} onChange={(e) => setYear(e.target.value)} />
                {' '}
                <button type="submit">Show</button>
            </form>
            <p>{error}</p>
            {results}
        </section>
    )
}
