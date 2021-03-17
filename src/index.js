const {Telegraf} = require('telegraf')
const {fetchRates} = require('./fetch-rates')

const bot = new Telegraf('1787880448:AAG3zyZI3U9mRN7TIg81fG1tax9HZPdJWbs')

bot.start((ctx) => {
    console.info('payload', ctx.startPayload)
    ctx.reply('Используйте команду /help, чтобы посмотреть инструкции')
})

bot.help((ctx) => {
    ctx.reply(
        'Используйте команды:\n' +
        '/showrates - показать курсы валют\n' +
        '/convert 50 eur - конвертировать валюту в рубли'
    )
})

bot.settings((ctx) => {
    ctx.reply('// todo Настройки бота')
})

bot.on('sticker', async (ctx) => {
    const stickerSet = await ctx.getStickerSet('Totoro')
    const stickerToAnswer = stickerSet.stickers.find((sticker) => {
        return sticker.emoji === '👋'
    }) || stickerSet.stickers[0]

    return ctx.replyWithSticker(stickerToAnswer.file_id)
})

bot.hears(['hi', 'Hi', 'Привет', 'привет'], (ctx) => {
    return ctx.reply('Hi!')
})

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

bot.command('convert', async (ctx) => {
    try {
        const message = ctx.update.message.text
        const arguments = message.replace('/convert', '').trim()
        let currency = 'usd'
        let amount = 1

        if (arguments.length > 0) {
            const argumentParts = arguments.split(' ')

            if (argumentParts.length > 0 && !isNaN(argumentParts[0])) {
                amount = Number(argumentParts[0])
            }

            if (argumentParts.length > 1 && ['usd', 'eur'].includes(argumentParts[1].toLowerCase())) {
                currency = argumentParts[1].toLowerCase()
            }
        }

        const rates = await fetchRates()

        return ctx.reply(`${amount} ${currency.toUpperCase()} = ${(1 / rates[currency] * amount).toFixed(4)} RUB`)
    } catch (error) {
        return ctx.reply('Не удалось сконвертировать валюту.')
    }
})

bot.launch()
    .then(() => {
        console.info('Bot started.')
    })
    .catch((error) => {
        console.error('Failed to start bot.', error)
    })