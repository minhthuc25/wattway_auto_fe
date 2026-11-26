export function formatPrice(amount) {
    return '$' + amount.toLocaleString('en-CA')
}

export function formatMoney(amount) { // always shows cents
    return '$' + amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
