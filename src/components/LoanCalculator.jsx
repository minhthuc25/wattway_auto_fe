import { useState } from 'react'
import { api } from '../api.js'
import { formatMoney } from '../format.js'

const TERMS = [12, 24, 36, 48, 60, 72, 84, 96] // months

export default function LoanCalculator({ vehiclePrice }) {
    const [price, setPrice] = useState(String(vehiclePrice))
    const [downPayment, setDownPayment] = useState('0')
    const [rate, setRate] = useState('6')
    const [months, setMonths] = useState('60')
    const [loan, setLoan] = useState(null)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoan(null)
        try {
            const params = new URLSearchParams({ price, downPayment, rate, months })
            const json = await api('GET', '/api/loan?' + params)
            setLoan({ ...json.data, months: Number(months), downPayment: Number(downPayment) }) // save the inputs so editing the form doesn't change the results
        } catch (err) {
            setError(err.message)
        }
    }

    let results = null
    if (loan) {
        const totalCost = loan.downPayment + loan.loanAmount + loan.totalInterest
        results = (
            <div>
                <p>Amount borrowed: {formatMoney(loan.loanAmount)}</p>
                <p>Monthly payment: {formatMoney(loan.monthlyPayment)} for {loan.months} months</p>
                <p>Total interest: {formatMoney(loan.totalInterest)}</p>
                <p>Total cost (down payment included): {formatMoney(totalCost)}</p>
            </div>
        )
    }

    return (
        <section>
            <h3>Loan calculator</h3>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Price ($) </label>
                    <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                </p>
                <p>
                    <label>Down payment ($) </label>
                    <input type="number" min="0" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
                </p>
                <p>
                    <label>Interest rate (% per year) </label>
                    <input type="number" min="0" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
                </p>
                <p>
                    <label>Term </label>
                    <select value={months} onChange={(e) => setMonths(e.target.value)}>
                        {TERMS.map((term) => (
                            <option key={term} value={term}>{term} months</option>
                        ))}
                    </select>
                </p>
                <button type="submit">Calculate</button>
            </form>
            <p>{error}</p>
            {results}
        </section>
    )
}
