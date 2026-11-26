import { useState } from 'react'
import { api } from '../api.js'
import { formatMoney } from '../format.js'

export default function SavingsCalculator({ vehicleId, batteryKwh, rangeKm }) {
    const [kmPerYear, setKmPerYear] = useState('15000')
    const [gasCarLPer100Km, setGasCarLPer100Km] = useState('')
    const [gasPricePerL, setGasPricePerL] = useState('')
    const [electricityPricePerKwh, setElectricityPricePerKwh] = useState('')
    const [savings, setSavings] = useState(null)
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSavings(null)

        const params = new URLSearchParams({ kmPerYear })
        // optional
        if (gasCarLPer100Km) {
            params.set('gasCarLPer100Km', gasCarLPer100Km)
        }
        if (gasPricePerL) {
            params.set('gasPricePerL', gasPricePerL)
        }
        if (electricityPricePerKwh) {
            params.set('electricityPricePerKwh', electricityPricePerKwh)
        }

        try {
            const json = await api('GET', '/api/vehicles/' + vehicleId + '/savings?' + params)
            setSavings(json.data)
            // show the values used in the inputs, including the server's defaults for the ones left empty
            const { assumptions } = json.data
            setGasCarLPer100Km(String(assumptions.gasCarLPer100Km))
            setGasPricePerL(String(assumptions.gasPricePerL))
            setElectricityPricePerKwh(String(assumptions.electricityPricePerKwh))
        } catch (err) {
            setError(err.message)
        }
    }

    let results = null
    if (savings) {
        const { yearly } = savings
        results = (
            <div>
                <p>Gas car fuel cost: {formatMoney(yearly.gasFuelCost)} per year</p>
                <p>This vehicle's charging cost: {formatMoney(yearly.evEnergyCost)} per year</p>
                <p><strong>You save: {formatMoney(yearly.costSavings)} per year</strong></p>
                <p>Gas car CO2: {yearly.gasCo2Kg.toLocaleString('en-CA')} kg per year</p>
                <p>This vehicle's CO2: {yearly.evCo2Kg.toLocaleString('en-CA')} kg per year</p>
                <p><strong>CO2 avoided: {yearly.co2SavedKg.toLocaleString('en-CA')} kg per year</strong></p>
            </div>
        )
    }

    return (
        <section>
            <h3>Savings compared with a gas car</h3>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Distance driven (km per year) </label>
                    <input type="number" min="1" value={kmPerYear} onChange={(e) => setKmPerYear(e.target.value)} />
                </p>
                <p>
                    <label>Gas car fuel use (L per 100 km, optional) </label>
                    <input type="number" min="0" step="0.1" value={gasCarLPer100Km} onChange={(e) => setGasCarLPer100Km(e.target.value)} />
                </p>
                <p>This vehicle's energy use: {(batteryKwh / rangeKm * 100).toFixed(1)} kWh per 100 km</p>
                <p>
                    <label>Gas price ($ per litre, optional) </label>
                    <input type="number" min="0" step="0.01" value={gasPricePerL} onChange={(e) => setGasPricePerL(e.target.value)} />
                </p>
                <p>
                    <label>Electricity price ($ per kWh, optional) </label>
                    <input type="number" min="0" step="0.01" value={electricityPricePerKwh} onChange={(e) => setElectricityPricePerKwh(e.target.value)} />
                </p>
                <button type="submit">Calculate</button>
            </form>
            <p>{error}</p>
            {results}
        </section>
    )
}
