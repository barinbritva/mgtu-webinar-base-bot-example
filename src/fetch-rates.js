const fetch = require('node-fetch');

function fetchRates() {
    return fetch('https://api.exchangeratesapi.io/latest?base=RUB&symbols=USD,EUR')
        .then((response) => {
            return response.text()
        })
        .then((text) => {
            const data = JSON.parse(text)
            return {
                eur: data.rates.EUR,
                usd: data.rates.USD
            }
        })
}

module.exports = {
    fetchRates
}