const {Telegraf} = require('telegraf')
const {fetchRates} = require('./fetch-rates')

const bot = new Telegraf('1787880448:AAG3zyZI3U9mRN7TIg81fG1tax9HZPdJWbs')

bot.command('showrates', async (ctx) => {
    try {
        const rates = await fetchRates()

        return ctx.reply(
            `USD: ${(1 / rates.usd).toFixed(4)}\n` +
            `EUR: ${(1 / rates.eur).toFixed(4)}`
        )
    } catch (error) {
        return ctx.reply('Не удалось получить котировки.')
    }
})

bot.launch()
    .then(() => {
        console.info('Bot started.')
    })
    .catch((error) => {
        console.error('Failed to start bot.', error)
    })